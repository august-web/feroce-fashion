/**
 * RLS policy verification suite — runs against the LIVE Supabase project.
 *
 *   npm run test:rls
 *
 * Reads VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY
 * from .env.local (or the process environment), creates two throwaway users
 * ("subject" and "other"), seeds minimal data, and exercises every table policy,
 * the `products` storage bucket, and the function grants as anonymous,
 * customer, and admin. All test data is removed on exit, including on failure.
 *
 * Semantics used here:
 *  - SELECT: RLS default-deny returns an empty result (no error), so "hidden"
 *    means zero rows / filtered out; "visible" means the expected rows appear.
 *  - INSERT: a blocked insert always surfaces as an error (42501).
 *  - UPDATE/DELETE: a blocked write is either an error or a silent no-op, so we
 *    additionally verify the target row was actually left unchanged.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'

// ---------------------------------------------------------------------------
// Env + clients
// ---------------------------------------------------------------------------

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {}
  if (existsSync('.env.local')) {
    for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const i = t.indexOf('=')
      if (i > 0) out[t.slice(0, i).trim()] = t.slice(i + 1).trim()
    }
  }
  return { ...out, ...process.env }
}

const env = loadEnv()
const url = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !anonKey || !serviceKey) {
  console.error('Missing env: need VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const service = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
const anon = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } })
const auth = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } })
let role: 'anon' | 'customer' | 'admin' = 'anon'

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

let passed = 0
const failures: string[] = []

function section(name: string) {
  console.log(`\n\x1b[36m== ${name}\x1b[0m`)
}

function ok(label: string) {
  passed++
  console.log(`  \x1b[32m✓\x1b[0m ${label}`)
}

function fail(label: string, detail?: unknown) {
  failures.push(`[${role}] ${label}`)
  console.log(`  \x1b[31m✗\x1b[0m ${label}${detail !== undefined ? ` — ${String(detail)}` : ''}`)
}

function assert(cond: boolean, label: string, detail?: unknown) {
  cond ? ok(label) : fail(label, detail)
}

/** Run a write; treat an error, a 0-row result (RLS-filtered update/delete),
 *  or an unchanged target row as "blocked". */
async function expectDenied(
  label: string,
  run: () => PromiseLike<{ error: { message?: string } | null; count?: number | null }>,
  verifyUnaffected?: () => Promise<boolean>,
) {
  const { error, count } = await run()
  if (error) return ok(label)
  if (count === 0) return ok(label)
  if (verifyUnaffected) {
    const intact = await verifyUnaffected()
    return assert(intact, label, 'write returned no error but the target changed — RLS did not block')
  }
  assert(false, label, 'write returned no error — RLS did not block')
}

/** Run a write; optionally verify the effect actually landed. */
async function expectAllowed(
  label: string,
  run: () => PromiseLike<{ error: { message?: string } | null }>,
  verify?: () => Promise<boolean>,
) {
  const { error } = await run()
  assert(!error, label, error?.message)
  if (!error && verify) assert(await verify(), `${label} (effect verified)`)
}

const len = (d: unknown[] | null) => (d ? d.length : 0)

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const RAND = randomUUID().slice(0, 8)
const EMAIL_A = `rls.a.${RAND}@feroce.test`
const EMAIL_B = `rls.b.${RAND}@feroce.test`
const PASSWORD = 'rls-test-2026!Strong'

const created: {
  userA?: string
  userB?: string
  profileA?: string
  profileB?: string
  addressA?: string
  addressB?: string
  wishlistA?: string
  wishlistB?: string
  orderA?: string
  orderB?: string
  orderItemA?: string
  orderItemB?: string
  paymentA?: string
  draftProduct?: string
  draftVariant?: string
  draftImage?: string
  inactiveVariant?: string
  draftCollection?: string
  contactId?: string
  contactCustomerId?: string
  newsletterId?: string
  newsletterCustomerId?: string
  storageKeeper?: string
  product1?: { id: string; name: string; sku: string }
  product2?: { id: string; name: string; sku: string }
  storagePaths: string[]
} = { storagePaths: [] }

async function createUser(email: string, firstName: string): Promise<string> {
  const { data, error } = await service.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { first_name: firstName },
  })
  if (error) throw new Error(`createUser(${email}): ${error.message}`)
  return data.user!.id
}

async function setup(): Promise<void> {
  section('Setup (service role)')

  created.userA = await createUser(EMAIL_A, 'RlsA')
  created.userB = await createUser(EMAIL_B, 'RlsB')
  console.log(`  created users: ${EMAIL_A}, ${EMAIL_B}`)

  // Two catalog products + a variant each (for wishlist/order snapshots).
  const { data: products, error: pe } = await service
    .from('products')
    .select('id, name')
    .eq('status', 'active')
    .limit(2)
  if (pe || !products || products.length === 0) throw new Error(`no active products: ${pe?.message}`)

  for (const [i, p] of products.entries()) {
    const { data: v } = await service
      .from('product_variants')
      .select('id, sku')
      .eq('product_id', p.id)
      .eq('active', true)
      .limit(1)
      .single()
    if (!v) throw new Error(`no active variant for ${p.id}`)
    ;(created as Record<string, unknown>)[i === 0 ? 'product1' : 'product2'] = {
      id: p.id,
      name: p.name,
      sku: v.sku,
    }
  }
  const p1 = created.product1!

  // Addresses / wishlists / orders / payments for both users.
  const { data: addrA } = await service
    .from('addresses')
    .insert({
      user_id: created.userA, label: 'RLS home', first_name: 'RlsA', last_name: 'Test',
      phone: '+2330000000', line1: '1 Test Street', city: 'Accra', country_code: 'GH', is_default: true,
    })
    .select('id')
    .single()
  created.addressA = addrA!.id

  const { data: addrB } = await service
    .from('addresses')
    .insert({
      user_id: created.userB, label: 'RLS home', first_name: 'RlsB', last_name: 'Test',
      phone: '+2330000000', line1: '2 Test Street', city: 'Kumasi', country_code: 'GH', is_default: true,
    })
    .select('id')
    .single()
  created.addressB = addrB!.id

  const { data: wishA } = await service.from('wishlists').insert({ user_id: created.userA }).select('id').single()
  created.wishlistA = wishA!.id
  const { data: wishB } = await service.from('wishlists').insert({ user_id: created.userB }).select('id').single()
  created.wishlistB = wishB!.id
  await service.from('wishlist_items').insert({ wishlist_id: wishA!.id, product_id: p1.id })
  await service.from('wishlist_items').insert({ wishlist_id: wishB!.id, product_id: p1.id })

  const orderShape = {
    currency: 'GHS', subtotal_minor: 1000, shipping_minor: 0, tax_minor: 0, total_minor: 1000,
    shipping_address: { line1: '1 Test Street', city: 'Accra', country_code: 'GH' }, shipping_method: 'test',
  }
  const { data: orderA } = await service
    .from('orders')
    .insert({ order_number: `TEST-A-${RAND}`, user_id: created.userA, email: EMAIL_A, status: 'pending', ...orderShape })
    .select('id')
    .single()
  created.orderA = orderA!.id
  const { data: orderB } = await service
    .from('orders')
    .insert({ order_number: `TEST-B-${RAND}`, user_id: created.userB, email: EMAIL_B, status: 'pending', ...orderShape })
    .select('id')
    .single()
  created.orderB = orderB!.id

  const { data: itemA } = await service
    .from('order_items')
    .insert({
      order_id: orderA!.id, product_id: p1.id, product_name: p1.name, sku: p1.sku,
      unit_price_minor: 1000, quantity: 1,
    })
    .select('id')
    .single()
  created.orderItemA = itemA!.id
  const { data: itemB } = await service
    .from('order_items')
    .insert({
      order_id: orderB!.id, product_id: p1.id, product_name: p1.name, sku: p1.sku,
      unit_price_minor: 1000, quantity: 1,
    })
    .select('id')
    .single()
  created.orderItemB = itemB!.id

  const { data: payA } = await service
    .from('payments')
    .insert({
      order_id: orderA!.id, provider: 'test', provider_payment_id: `pm_rls_${RAND}`, status: 'pending',
      amount_minor: 1000, currency: 'GHS', raw_metadata: {},
    })
    .select('id')
    .single()
  created.paymentA = payA!.id

  // Catalog rows that only admins should see.
  const { data: draft } = await service
    .from('products')
    .insert({
      name: 'RLS Draft Product', slug: `rls-draft-${RAND}`, gender: 'Unisex', status: 'draft',
      base_price_minor: 100, currency: 'GHS', search_keywords: ['rls'],
    })
    .select('id')
    .single()
  created.draftProduct = draft!.id
  const { data: draftV } = await service
    .from('product_variants')
    .insert({ product_id: draft!.id, sku: `RLS-DRAFT-${RAND}`, name: 'Draft Variant', inventory: 1, active: true })
    .select('id')
    .single()
  created.draftVariant = draftV!.id
  const { data: draftImg } = await service
    .from('product_images')
    .insert({ product_id: draft!.id, storage_path: `rls-test/${RAND}/draft.png`, alt_text: 'draft', sort_order: 0, is_primary: true })
    .select('id')
    .single()
  created.draftImage = draftImg!.id

  const { data: inactV } = await service
    .from('product_variants')
    .insert({ product_id: p1.id, sku: `RLS-INACT-${RAND}`, name: 'Inactive Variant', inventory: 0, active: false })
    .select('id')
    .single()
  created.inactiveVariant = inactV!.id

  const { data: draftC } = await service
    .from('collections')
    .insert({ name: 'RLS Draft Collection', slug: `rls-draft-collection-${RAND}`, status: 'draft' })
    .select('id')
    .single()
  created.draftCollection = draftC!.id

  // Keeper object in the products bucket: must survive anon/customer delete attempts
  // and only be removable by an admin.
  const keeper = `rls-test/${RAND}/keeper.png`
  const { error: keeperErr } = await service.storage
    .from('products')
    .upload(keeper, new Blob(['rls'], { type: 'image/png' }))
  if (keeperErr) throw new Error(`keeper upload: ${keeperErr.message}`)
  created.storageKeeper = keeper
  created.storagePaths.push(keeper)

  console.log('  fixtures ready')
}

// ---------------------------------------------------------------------------
// Anonymous phase
// ---------------------------------------------------------------------------

async function phaseAnon(): Promise<void> {
  section('Anonymous')

  // Public catalog reads: active-only visibility.
  const { data: prodAll } = await anon.from('products').select('*')
  assert(len(prodAll) > 0, 'can select catalog products')
  assert((prodAll ?? []).every((p) => p.status === 'active'), 'anon sees only active products')
  assert(!(prodAll ?? []).some((p) => p.id === created.draftProduct), 'draft product hidden from anon')

  const { data: cats } = await anon.from('categories').select('*')
  assert(len(cats) > 0, 'can select categories (public read)')

  const { data: colls } = await anon.from('collections').select('*')
  assert((colls ?? []).every((c) => c.status === 'active'), 'collections: only active visible')
  assert(!(colls ?? []).some((c) => c.id === created.draftCollection), 'draft collection hidden from anon')

  const { data: variants } = await anon.from('product_variants').select('*')
  assert(len(variants) > 0, 'can select product variants')
  assert(!(variants ?? []).some((v) => v.id === created.draftVariant), 'variant of draft product hidden')
  assert(!(variants ?? []).some((v) => v.id === created.inactiveVariant), 'inactive variant hidden')

  const { data: images } = await anon.from('product_images').select('*')
  assert(!(images ?? []).some((i) => i.id === created.draftImage), 'image of draft product hidden')

  const { data: links } = await anon.from('product_collections').select('*')
  assert(Array.isArray(links), 'can select product_collections (public read)')

  // Site settings: public read for the storefront bar, admin-only write.
  const { data: settings } = await anon.from('site_settings').select('*')
  assert(len(settings) === 1, 'anon can read site settings')
  await expectDenied('anon cannot update site settings', () =>
    anon.from('site_settings').update({ returns_days: 99 }, { count: 'exact' }).eq('id', 1),
  )
  await expectDenied('anon cannot insert site settings', () =>
    anon.from('site_settings').insert({ id: 1, currency_code: 'GHS', free_shipping_over_minor: 1, returns_days: 1 }),
  )
  await expectDenied('anon cannot delete site settings', () =>
    anon.from('site_settings').delete({ count: 'exact' }).eq('id', 1),
  )

  // Customer/order data: completely invisible.
  for (const [table, label] of [
    ['profiles', 'profiles'],
    ['addresses', 'addresses'],
    ['wishlists', 'wishlists'],
    ['wishlist_items', 'wishlist_items'],
    ['orders', 'orders'],
    ['order_items', 'order_items'],
    ['payments', 'payments'],
    ['newsletter_subscribers', 'newsletter subscribers'],
    ['contact_messages', 'contact messages'],
  ] as const) {
    const { data } = await anon.from(table).select('*')
    assert(len(data) === 0, `anon cannot read ${label}`)
  }

  // Catalog writes: blocked.
  await expectDenied('anon cannot insert product', () =>
    anon.from('products').insert({ name: 'X', slug: `rls-x-${RAND}`, gender: 'Unisex', base_price_minor: 1, currency: 'GHS', search_keywords: [] }),
  )
  await expectDenied('anon cannot update product', () =>
    anon.from('products').update({ subtitle: 'hacked' }, { count: 'exact' }).eq('id', created.product1!.id),
  )
  await expectDenied('anon cannot delete product', () =>
    anon.from('products').delete({ count: 'exact' }).eq('id', created.product1!.id),
  )
  await expectDenied('anon cannot insert category', () =>
    anon.from('categories').insert({ name: 'RLS x', slug: `rls-x-${RAND}` }),
  )
  await expectDenied('anon cannot insert collection', () =>
    anon.from('collections').insert({ name: 'RLS x', slug: `rls-x-${RAND}` }),
  )
  await expectDenied('anon cannot insert variant', () =>
    anon.from('product_variants').insert({ product_id: created.product1!.id, sku: `RLS-X-${RAND}`, name: 'x', inventory: 0 }),
  )
  await expectDenied('anon cannot insert product image', () =>
    anon.from('product_images').insert({ product_id: created.product1!.id, storage_path: 'rls-test/x.png', alt_text: 'x' }),
  )
  await expectDenied('anon cannot link product collection', () =>
    anon.from('product_collections').insert({ product_id: created.product1!.id, collection_id: created.draftCollection! }),
  )

  // User data writes: blocked.
  await expectDenied('anon cannot insert profile', () =>
    anon.from('profiles').insert({ id: randomUUID(), role: 'customer' }),
  )
  await expectDenied('anon cannot update profile', () =>
    anon.from('profiles').update({ first_name: 'hacked' }, { count: 'exact' }).eq('id', created.userA!),
  )
  await expectDenied('anon cannot insert address', () =>
    anon.from('addresses').insert({ user_id: created.userA!, first_name: 'x', last_name: 'x', line1: 'x', city: 'x', country_code: 'GH' }),
  )
  await expectDenied('anon cannot create wishlist', () =>
    anon.from('wishlists').insert({ user_id: created.userA! }),
  )
  await expectDenied('anon cannot add wishlist item', () =>
    anon.from('wishlist_items').insert({ wishlist_id: created.wishlistA!, product_id: created.product1!.id }),
  )
  await expectDenied('anon cannot insert order', () =>
    anon.from('orders').insert({ order_number: `X-${RAND}`, email: 'x@x.x', currency: 'GHS', subtotal_minor: 1, shipping_minor: 0, tax_minor: 0, total_minor: 1, shipping_address: {} }),
  )
  await expectDenied('anon cannot update order', () =>
    anon.from('orders').update({ status: 'paid' }, { count: 'exact' }).eq('id', created.orderA!),
  )
  await expectDenied('anon cannot insert order item', () =>
    anon.from('order_items').insert({ order_id: created.orderA!, product_name: 'x', sku: 'x', unit_price_minor: 1, quantity: 1 }),
  )
  await expectDenied('anon cannot insert payment', () =>
    anon.from('payments').insert({ order_id: created.orderA!, provider: 'x', amount_minor: 1, currency: 'GHS', raw_metadata: {} }),
  )

  // Anonymous capture: insert-only. Do NOT request a representation back —
  // the read-back is filtered by the admin-only SELECT policy (a real, useful
  // RLS nuance), so we assert the plain insert and fetch the id via service role.
  const anonContactEmail = `contact.${RAND}@feroce.test`
  const { error: contactErr } = await anon
    .from('contact_messages')
    .insert({ name: 'RLS Tester', email: anonContactEmail, subject: 'rls', message: 'rls' })
  assert(!contactErr, 'anon can insert contact message', contactErr?.message)
  const { data: contactRow } = await service
    .from('contact_messages')
    .select('id')
    .eq('email', anonContactEmail)
    .single()
  created.contactId = contactRow?.id

  const anonNewsEmail = `news.${RAND}@feroce.test`
  const { error: newsErr } = await anon
    .from('newsletter_subscribers')
    .insert({ email: anonNewsEmail, source: 'rls-test' })
  assert(!newsErr, 'anon can subscribe to newsletter', newsErr?.message)
  const { data: newsRow } = await service
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', anonNewsEmail)
    .single()
  created.newsletterId = newsRow?.id

  // Functions.
  const { data: isAdmin } = await anon.rpc('is_admin')
  assert(isAdmin === false, 'is_admin() returns false for anon')

  const fakeId = randomUUID()
  await expectDenied('anon cannot call confirm_order_payment', () => anon.rpc('confirm_order_payment', { p_payment_id: fakeId }))
  await expectDenied('anon cannot call cancel_order_payment', () => anon.rpc('cancel_order_payment', { p_payment_id: fakeId }))
  await expectDenied('anon cannot call next_order_number', () => anon.rpc('next_order_number'))

  // Storage: public read, no write.
  const { error: listErr } = await anon.storage.from('products').list('', { limit: 100 })
  assert(!listErr, 'anon can list products bucket', listErr?.message)
  const blob = new Blob(['rls'], { type: 'image/png' })
  await expectDenied('anon cannot upload to products bucket', () =>
    anon.storage.from('products').upload(`rls-test/${RAND}/anon.png`, blob),
  )
  await expectDenied('anon cannot delete from products bucket', () =>
    anon.storage.from('products').remove([created.storageKeeper!]),
    async () => {
      const { data } = await service.storage.from('products').list(`rls-test/${RAND}`, { limit: 100 })
      return (data ?? []).some((f) => f.name === 'keeper.png')
    },
  )
}

// ---------------------------------------------------------------------------
// Customer phase (user A signed in, user B is "someone else")
// ---------------------------------------------------------------------------

async function phaseCustomer(): Promise<void> {
  section('Customer (user A)')

  const { error: signInErr } = await auth.auth.signInWithPassword({ email: EMAIL_A, password: PASSWORD })
  if (signInErr) throw new Error(`signIn(${EMAIL_A}): ${signInErr.message}`)
  role = 'customer'

  // Catalog: same public visibility as anon.
  const { data: prodAll } = await auth.from('products').select('*')
  assert(len(prodAll) > 0, 'customer can select catalog products')
  assert(!(prodAll ?? []).some((p) => p.id === created.draftProduct), 'draft product hidden from customer')

  // Site settings: readable like anon, not writable by customers.
  const { data: custSettings } = await auth.from('site_settings').select('*')
  assert(len(custSettings) === 1, 'customer can read site settings')
  await expectDenied('customer cannot update site settings', () =>
    auth.from('site_settings').update({ returns_days: 99 }, { count: 'exact' }).eq('id', 1),
  )

  // Own rows visible; other user's rows invisible.
  const { data: profiles } = await auth.from('profiles').select('*')
  assert(len(profiles) === 1 && profiles![0].id === created.userA, 'customer reads only own profile')

  const { data: ownAddr } = await auth.from('addresses').select('*')
  assert(len(ownAddr) === 1 && ownAddr![0].id === created.addressA, 'customer reads only own address')
  const { data: otherAddr } = await auth.from('addresses').select('*').eq('user_id', created.userB)
  assert(len(otherAddr) === 0, "customer cannot read other user's addresses")

  const { data: ownWish } = await auth.from('wishlists').select('*')
  assert(len(ownWish) === 1 && ownWish![0].id === created.wishlistA, 'customer reads only own wishlist')

  const { data: ownItems } = await auth.from('wishlist_items').select('*')
  assert(len(ownItems) === 1, 'customer reads only own wishlist items')
  const { data: otherItems } = await auth.from('wishlist_items').select('*').eq('wishlist_id', created.wishlistB)
  assert(len(otherItems) === 0, "customer cannot read other user's wishlist items")

  const { data: ownOrders } = await auth.from('orders').select('*')
  assert(len(ownOrders) === 1 && ownOrders![0].id === created.orderA, 'customer reads only own orders')
  const { data: otherOrders } = await auth.from('orders').select('*').eq('user_id', created.userB)
  assert(len(otherOrders) === 0, "customer cannot read other user's orders")

  const { data: ownItemsO } = await auth.from('order_items').select('*')
  assert(len(ownItemsO) === 1 && ownItemsO![0].order_id === created.orderA, 'customer reads only own order items')

  const { data: pays } = await auth.from('payments').select('*')
  assert(len(pays) === 0, 'customer cannot read payments (admin only)')
  const { data: news } = await auth.from('newsletter_subscribers').select('*')
  assert(len(news) === 0, 'customer cannot read newsletter subscribers')
  const { data: contacts } = await auth.from('contact_messages').select('*')
  assert(len(contacts) === 0, 'customer cannot read contact messages')

  // Own-profile edits (column-restricted).
  await expectAllowed(
    'customer can update own profile name/phone',
    () => auth.from('profiles').update({ first_name: 'RLS-Customer', phone: '+2331111111' }).eq('id', created.userA!),
    async () => {
      const { data } = await service.from('profiles').select('first_name, phone').eq('id', created.userA!).single()
      return data?.first_name === 'RLS-Customer' && data?.phone === '+2331111111'
    },
  )
  await expectDenied('customer cannot escalate own role', () =>
    auth.from('profiles').update({ role: 'admin' }).eq('id', created.userA!),
  )
  await expectDenied(
    "customer cannot edit another user's profile",
    () => auth.from('profiles').update({ first_name: 'hacked' }).eq('id', created.userB!),
    async () => {
      const { data } = await service.from('profiles').select('first_name').eq('id', created.userB!).single()
      return data?.first_name === 'RlsB'
    },
  )

  // Address CRUD: own only.
  let tmpAddrId: string | undefined
  const { data: tmpAddr, error: insErr } = await auth
    .from('addresses')
    .insert({
      user_id: created.userA!, label: 'RLS tmp', first_name: 'RlsA', last_name: 'Test',
      line1: 'Tmp Street', city: 'Accra', country_code: 'GH',
    })
    .select('id')
    .single()
  assert(!insErr, 'customer can insert own address', insErr?.message)
  tmpAddrId = tmpAddr?.id
  await expectAllowed(
    'customer can update own address',
    () => auth.from('addresses').update({ line1: 'Tmp Street 2' }).eq('id', tmpAddrId!),
    async () => {
      const { data } = await service.from('addresses').select('line1').eq('id', tmpAddrId!).single()
      return data?.line1 === 'Tmp Street 2'
    },
  )
  await expectDenied('customer cannot update another user\'s address', () =>
    auth.from('addresses').update({ line1: 'hacked' }, { count: 'exact' }).eq('id', created.addressB!),
  )
  await expectDenied('customer cannot create address for another user', () =>
    auth.from('addresses').insert({ user_id: created.userB!, first_name: 'x', last_name: 'x', line1: 'x', city: 'x', country_code: 'GH' }),
  )
  await expectAllowed('customer can delete own address', () =>
    auth.from('addresses').delete().eq('id', tmpAddrId!),
  )
  tmpAddrId = undefined

  // Wishlist items: own only.
  if (created.product2) {
    await expectAllowed(
      'customer can add own wishlist item',
      () => auth.from('wishlist_items').insert({ wishlist_id: created.wishlistA!, product_id: created.product2!.id }),
      async () => {
        const { data } = await service
          .from('wishlist_items')
          .select('product_id')
          .eq('wishlist_id', created.wishlistA!)
          .eq('product_id', created.product2!.id)
        return len(data) === 1
      },
    )
    await expectAllowed('customer can remove own wishlist item', () =>
      auth.from('wishlist_items').delete().eq('wishlist_id', created.wishlistA!).eq('product_id', created.product2!.id),
    )
  }
  await expectDenied('customer cannot add item to another user\'s wishlist', () =>
    auth.from('wishlist_items').insert({ wishlist_id: created.wishlistB!, product_id: created.product1!.id }),
  )

  // Orders: read-only for customers.
  await expectDenied('customer cannot update own order status', () =>
    auth.from('orders').update({ status: 'paid' }, { count: 'exact' }).eq('id', created.orderA!),
  )
  await expectDenied('customer cannot insert an order', () =>
    auth.from('orders').insert({ order_number: `X-${RAND}`, email: EMAIL_A, currency: 'GHS', subtotal_minor: 1, shipping_minor: 0, tax_minor: 0, total_minor: 1, shipping_address: {} }),
  )

  // Catalog writes still blocked for customers.
  await expectDenied('customer cannot insert product', () =>
    auth.from('products').insert({ name: 'X', slug: `rls-x-${RAND}`, gender: 'Unisex', base_price_minor: 1, currency: 'GHS', search_keywords: [] }),
  )
  await expectDenied('customer cannot update product', () =>
    auth.from('products').update({ subtitle: 'hacked' }, { count: 'exact' }).eq('id', created.product1!.id),
  )
  await expectDenied('customer cannot insert category', () =>
    auth.from('categories').insert({ name: 'RLS x', slug: `rls-x-${RAND}` }),
  )

  // Anonymous capture still insert-only for authenticated users.
  const custContactEmail = `contact.a.${RAND}@feroce.test`
  const { error: contactErr } = await auth
    .from('contact_messages')
    .insert({ name: 'RlsA', email: custContactEmail, subject: 'rls', message: 'rls' })
  assert(!contactErr, 'customer can insert contact message', contactErr?.message)
  const { data: contactA } = await service
    .from('contact_messages')
    .select('id')
    .eq('email', custContactEmail)
    .single()
  created.contactCustomerId = contactA?.id

  const custNewsEmail = `news.a.${RAND}@feroce.test`
  const { error: newsErr } = await auth
    .from('newsletter_subscribers')
    .insert({ email: custNewsEmail, source: 'rls-test' })
  assert(!newsErr, 'customer can subscribe to newsletter', newsErr?.message)
  const { data: newsA } = await service
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', custNewsEmail)
    .single()
  created.newsletterCustomerId = newsA?.id

  // Functions.
  const { data: isAdmin } = await auth.rpc('is_admin')
  assert(isAdmin === false, 'is_admin() returns false for customer')
  const fakeId = randomUUID()
  await expectDenied('customer cannot call confirm_order_payment', () => auth.rpc('confirm_order_payment', { p_payment_id: fakeId }))
  await expectDenied('customer cannot call cancel_order_payment', () => auth.rpc('cancel_order_payment', { p_payment_id: fakeId }))
  await expectDenied('customer cannot call next_order_number', () => auth.rpc('next_order_number'))

  // Storage.
  const { error: listErr } = await auth.storage.from('products').list('', { limit: 100 })
  assert(!listErr, 'customer can list products bucket', listErr?.message)
  const blob = new Blob(['rls'], { type: 'image/png' })
  await expectDenied('customer cannot upload to products bucket', () =>
    auth.storage.from('products').upload(`rls-test/${RAND}/customer.png`, blob),
  )
  await expectDenied('customer cannot delete from products bucket', () =>
    auth.storage.from('products').remove([created.storageKeeper!]),
    async () => {
      const { data } = await service.storage.from('products').list(`rls-test/${RAND}`, { limit: 100 })
      return (data ?? []).some((f) => f.name === 'keeper.png')
    },
  )
}

// ---------------------------------------------------------------------------
// Admin phase (user A promoted)
// ---------------------------------------------------------------------------

async function phaseAdmin(): Promise<void> {
  section('Admin (user A promoted)')

  const { error: promoteErr } = await service.from('profiles').update({ role: 'admin' }).eq('id', created.userA!)
  if (promoteErr) throw new Error(`promote: ${promoteErr.message}`)
  role = 'admin'

  const { data: isAdmin } = await auth.rpc('is_admin')
  assert(isAdmin === true, 'is_admin() returns true for admin')

  // Full catalog visibility, including drafts/inactive.
  const { data: prodAll } = await auth.from('products').select('*')
  assert(prodAll?.some((p) => p.id === created.draftProduct), 'admin sees draft products')
  const { data: variants } = await auth.from('product_variants').select('*')
  assert(variants?.some((v) => v.id === created.draftVariant), 'admin sees draft-product variants')
  assert(variants?.some((v) => v.id === created.inactiveVariant), 'admin sees inactive variants')
  const { data: images } = await auth.from('product_images').select('*')
  assert(images?.some((i) => i.id === created.draftImage), 'admin sees draft-product images')
  const { data: colls } = await auth.from('collections').select('*')
  assert(colls?.some((c) => c.id === created.draftCollection), 'admin sees draft collections')

  // Every customer's rows are visible.
  const { data: profiles } = await auth.from('profiles').select('*')
  assert(profiles?.some((p) => p.id === created.userA) && profiles?.some((p) => p.id === created.userB), 'admin sees all profiles')
  const { data: addrs } = await auth.from('addresses').select('*')
  assert(addrs?.some((a) => a.id === created.addressA) && addrs?.some((a) => a.id === created.addressB), 'admin sees all addresses')
  const { data: wishes } = await auth.from('wishlists').select('*')
  assert(wishes?.some((w) => w.id === created.wishlistA) && wishes?.some((w) => w.id === created.wishlistB), 'admin sees all wishlists')
  const { data: wishItems } = await auth.from('wishlist_items').select('*')
  assert(wishItems?.some((w) => w.wishlist_id === created.wishlistA) && wishItems?.some((w) => w.wishlist_id === created.wishlistB), 'admin sees all wishlist items')
  const { data: orders } = await auth.from('orders').select('*')
  assert(orders?.some((o) => o.id === created.orderA) && orders?.some((o) => o.id === created.orderB), 'admin sees all orders')
  const { data: orderItems } = await auth.from('order_items').select('*')
  assert(orderItems?.some((i) => i.order_id === created.orderA) && orderItems?.some((i) => i.order_id === created.orderB), 'admin sees all order items')
  const { data: pays } = await auth.from('payments').select('*')
  assert(pays?.some((p) => p.id === created.paymentA), 'admin sees payments')
  const { data: news } = await auth.from('newsletter_subscribers').select('*')
  assert(news?.some((n) => n.id === created.newsletterId), 'admin sees newsletter subscribers')
  const { data: contacts } = await auth.from('contact_messages').select('*')
  assert(contacts?.some((c) => c.id === created.contactId), 'admin sees contact messages')

  // Site settings: admin may update the single row (values restored afterwards).
  const { data: settings } = await auth.from('site_settings').select('*')
  assert(len(settings) === 1, 'admin can read site settings')
  const { data: settingsBefore } = await service
    .from('site_settings')
    .select('currency_code,free_shipping_over_minor,returns_days')
    .eq('id', 1)
    .single()
  await expectAllowed(
    'admin can update site settings',
    () => auth.from('site_settings').update({ currency_code: 'GBP', returns_days: 42 }).eq('id', 1),
    async () => {
      const { data } = await service.from('site_settings').select('currency_code,returns_days').eq('id', 1).single()
      return data?.currency_code?.trim() === 'GBP' && data?.returns_days === 42
    },
  )
  await service
    .from('site_settings')
    .update({
      currency_code: settingsBefore?.currency_code ?? 'GHS',
      free_shipping_over_minor: settingsBefore?.free_shipping_over_minor ?? 200000,
      returns_days: settingsBefore?.returns_days ?? 30,
    })
    .eq('id', 1)

  // Catalog CRUD.
  await expectAllowed(
    'admin can update a product',
    () => auth.from('products').update({ subtitle: 'admin-edited' }).eq('id', created.draftProduct!),
    async () => {
      const { data } = await service.from('products').select('subtitle').eq('id', created.draftProduct!).single()
      return data?.subtitle === 'admin-edited'
    },
  )
  let tmpCatId: string | undefined
  const { data: cat, error: catErr } = await auth
    .from('categories')
    .insert({ name: `RLS Cat ${RAND}`, slug: `rls-cat-${RAND}` })
    .select('id')
    .single()
  assert(!catErr, 'admin can insert category', catErr?.message)
  tmpCatId = cat?.id
  await expectAllowed(
    'admin can update a category',
    () => auth.from('categories').update({ description: 'admin-edited' }).eq('id', tmpCatId!),
    async () => {
      const { data } = await service.from('categories').select('description').eq('id', tmpCatId!).single()
      return data?.description === 'admin-edited'
    },
  )
  await expectAllowed('admin can delete a category', () => auth.from('categories').delete().eq('id', tmpCatId!))
  tmpCatId = undefined

  let tmpCollId: string | undefined
  const { data: coll, error: collErr } = await auth
    .from('collections')
    .insert({ name: `RLS Coll ${RAND}`, slug: `rls-coll-${RAND}` })
    .select('id')
    .single()
  assert(!collErr, 'admin can insert collection', collErr?.message)
  tmpCollId = coll?.id
  await expectAllowed('admin can delete a collection', () => auth.from('collections').delete().eq('id', tmpCollId!))
  tmpCollId = undefined

  let tmpVarId: string | undefined
  const { data: vari, error: varErr } = await auth
    .from('product_variants')
    .insert({ product_id: created.draftProduct!, sku: `RLS-ADMIN-${RAND}`, name: 'Admin Variant', inventory: 5, active: true })
    .select('id')
    .single()
  assert(!varErr, 'admin can insert variant', varErr?.message)
  tmpVarId = vari?.id
  await expectAllowed('admin can delete a variant', () => auth.from('product_variants').delete().eq('id', tmpVarId!))
  tmpVarId = undefined

  let tmpImgId: string | undefined
  const { data: img, error: imgErr } = await auth
    .from('product_images')
    .insert({ product_id: created.draftProduct!, storage_path: `rls-test/${RAND}/admin.png`, alt_text: 'admin', sort_order: 1, is_primary: false })
    .select('id')
    .single()
  assert(!imgErr, 'admin can insert product image', imgErr?.message)
  tmpImgId = img?.id
  await expectAllowed('admin can delete a product image', () => auth.from('product_images').delete().eq('id', tmpImgId!))
  tmpImgId = undefined

  await expectAllowed(
    'admin can link a product to a collection',
    () => auth.from('product_collections').insert({ product_id: created.draftProduct!, collection_id: created.draftCollection! }),
    async () => {
      const { data } = await service
        .from('product_collections')
        .select('product_id')
        .eq('product_id', created.draftProduct!)
        .eq('collection_id', created.draftCollection!)
      return len(data) === 1
    },
  )
  await expectAllowed('admin can unlink a product from a collection', () =>
    auth.from('product_collections').delete().eq('product_id', created.draftProduct!).eq('collection_id', created.draftCollection!),
  )

  // Customer data administration.
  await expectAllowed(
    'admin can edit another user\'s profile (non-role columns)',
    () => auth.from('profiles').update({ first_name: 'RlsB-Edited' }).eq('id', created.userB!),
    async () => {
      const { data } = await service.from('profiles').select('first_name').eq('id', created.userB!).single()
      return data?.first_name === 'RlsB-Edited'
    },
  )
  await expectDenied(
    'admin cannot change a role via PostgREST (column privilege)',
    () => auth.from('profiles').update({ role: 'admin' }).eq('id', created.userB!),
    async () => {
      const { data } = await service.from('profiles').select('role').eq('id', created.userB!).single()
      return data?.role === 'customer'
    },
  )
  await expectAllowed(
    'admin can edit another user\'s address',
    () => auth.from('addresses').update({ line1: 'Edited Street' }).eq('id', created.addressB!),
    async () => {
      const { data } = await service.from('addresses').select('line1').eq('id', created.addressB!).single()
      return data?.line1 === 'Edited Street'
    },
  )
  await expectAllowed(
    'admin can update an order status',
    () => auth.from('orders').update({ status: 'processing' }).eq('id', created.orderB!),
    async () => {
      const { data } = await service.from('orders').select('status').eq('id', created.orderB!).single()
      return data?.status === 'processing'
    },
  )
  await service.from('orders').update({ status: 'pending' }).eq('id', created.orderB!)
  await expectAllowed('admin can remove an item from another user\'s wishlist', () =>
    auth.from('wishlist_items').delete().eq('wishlist_id', created.wishlistB!),
  )
  // Restore B's item so the isolation phase still sees it.
  await service.from('wishlist_items').insert({ wishlist_id: created.wishlistB!, product_id: created.product1!.id })
  await expectAllowed(
    'admin can triage a contact message',
    () => auth.from('contact_messages').update({ status: 'resolved' }).eq('id', created.contactId!),
    async () => {
      const { data } = await service.from('contact_messages').select('status').eq('id', created.contactId!).single()
      return data?.status === 'resolved'
    },
  )

  // No insert path on orders/payments exists for any authenticated role.
  await expectDenied('admin cannot insert an order', () =>
    auth.from('orders').insert({ order_number: `X-${RAND}`, email: EMAIL_A, currency: 'GHS', subtotal_minor: 1, shipping_minor: 0, tax_minor: 0, total_minor: 1, shipping_address: {} }),
  )
  await expectDenied('admin cannot insert a payment', () =>
    auth.from('payments').insert({ order_id: created.orderA!, provider: 'x', amount_minor: 1, currency: 'GHS', raw_metadata: {} }),
  )

  // Payment functions stay service-role-only even for admins.
  const fakeId = randomUUID()
  await expectDenied('admin cannot call confirm_order_payment', () => auth.rpc('confirm_order_payment', { p_payment_id: fakeId }))
  await expectDenied('admin cannot call cancel_order_payment', () => auth.rpc('cancel_order_payment', { p_payment_id: fakeId }))
  await expectDenied('admin cannot call next_order_number', () => auth.rpc('next_order_number'))

  // Storage: admin upload/update/delete, plus removing the service-uploaded keeper.
  const blob = new Blob(['rls'], { type: 'image/png' })
  const p1 = `rls-test/${RAND}/admin.png`
  const p2 = `rls-test/${RAND}/admin-moved.png`
  const { error: upErr } = await auth.storage.from('products').upload(p1, blob)
  assert(!upErr, 'admin can upload to products bucket', upErr?.message)
  created.storagePaths.push(p1, p2)
  const { error: mvErr } = await auth.storage.from('products').update(p2, blob, { upsert: true })
  assert(!mvErr, 'admin can update (move) an object', mvErr?.message)
  const { error: rmErr } = await auth.storage.from('products').remove([p1, p2])
  assert(!rmErr, 'admin can delete objects', rmErr?.message)

  const { error: keeperRmErr } = await auth.storage.from('products').remove([created.storageKeeper!])
  assert(!keeperRmErr, 'admin can delete an object uploaded by service role', keeperRmErr?.message)
  const { data: afterKeeper } = await service.storage.from('products').list(`rls-test/${RAND}`, { limit: 100 })
  assert(!(afterKeeper ?? []).some((f) => f.name === 'keeper.png'), 'keeper object actually removed by admin')
  created.storageKeeper = undefined
  created.storagePaths = created.storagePaths.filter((p) => p !== `rls-test/${RAND}/keeper.png`)
}

// ---------------------------------------------------------------------------
// Isolation phase (user B signs in)
// ---------------------------------------------------------------------------

async function phaseOtherIsolation(): Promise<void> {
  section('Isolation (user B)')

  const { error: signInErr } = await auth.auth.signInWithPassword({ email: EMAIL_B, password: PASSWORD })
  if (signInErr) throw new Error(`signIn(${EMAIL_B}): ${signInErr.message}`)
  role = 'customer'

  const { data: profiles } = await auth.from('profiles').select('*')
  assert(len(profiles) === 1 && profiles![0].id === created.userB, 'B reads only own profile')
  const { data: addrs } = await auth.from('addresses').select('*')
  assert(len(addrs) === 1 && addrs![0].id === created.addressB, 'B reads only own address')
  const { data: orders } = await auth.from('orders').select('*')
  assert(len(orders) === 1 && orders![0].id === created.orderB, 'B reads only own order')
  const { data: items } = await auth.from('order_items').select('*')
  assert(len(items) === 1 && items![0].order_id === created.orderB, 'B reads only own order items')
  const { data: wishItems } = await auth.from('wishlist_items').select('*')
  assert(len(wishItems) === 1 && wishItems![0].wishlist_id === created.wishlistB, 'B reads only own wishlist items')
  const { data: otherAddr } = await auth.from('addresses').select('*').eq('user_id', created.userA)
  assert(len(otherAddr) === 0, "B cannot read A's addresses")
  const { data: otherOrders } = await auth.from('orders').select('*').eq('user_id', created.userA)
  assert(len(otherOrders) === 0, "B cannot read A's orders")
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

async function cleanup(): Promise<void> {
  section('Cleanup (service role)')
  const steps: Array<[string, PromiseLike<unknown>]> = []
  const run = (label: string, p: PromiseLike<unknown>) => steps.push([label, p])

  run('order items', service.from('order_items').delete().in('order_id', [created.orderA!, created.orderB!]))
  run('orders', service.from('orders').delete().in('id', [created.orderA!, created.orderB!]))
  run('payments', service.from('payments').delete().in('order_id', [created.orderA!, created.orderB!]))
  run('addresses', service.from('addresses').delete().in('user_id', [created.userA!, created.userB!]))
  run('wishlist items', service.from('wishlist_items').delete().in('wishlist_id', [created.wishlistA!, created.wishlistB!]))
  run('wishlists', service.from('wishlists').delete().in('id', [created.wishlistA!, created.wishlistB!]))
  run('draft product (cascade)', service.from('products').delete().eq('id', created.draftProduct!))
  run('inactive variant', service.from('product_variants').delete().eq('id', created.inactiveVariant!))
  run('draft collection (cascade)', service.from('collections').delete().eq('id', created.draftCollection!))
  run('contact message (anon)', service.from('contact_messages').delete().eq('id', created.contactId!))
  run('contact message (customer)', service.from('contact_messages').delete().eq('id', created.contactCustomerId!))
  run('newsletter (anon)', service.from('newsletter_subscribers').delete().eq('id', created.newsletterId!))
  run('newsletter (customer)', service.from('newsletter_subscribers').delete().eq('id', created.newsletterCustomerId!))
  for (const p of created.storagePaths) run(`storage ${p}`, service.storage.from('products').remove([p]))

  for (const [label, p] of steps) {
    const res = (await p) as { error?: { message?: string } }
    if (res?.error) console.log(`  \x1b[33m! ${label}: ${res.error.message}\x1b[0m`)
  }

  if (created.userA) {
    const { error } = await service.auth.admin.deleteUser(created.userA)
    if (error) console.log(`  \x1b[33m! deleteUser A: ${error.message}\x1b[0m`)
  }
  if (created.userB) {
    const { error } = await service.auth.admin.deleteUser(created.userB)
    if (error) console.log(`  \x1b[33m! deleteUser B: ${error.message}\x1b[0m`)
  }

  // Verify nothing is left behind.
  const checks: Array<[string, () => PromiseLike<{ data: unknown[] | null; error: { message?: string } | null }>]> = [
    ['profiles', () => service.from('profiles').select('id')],
    ['addresses', () => service.from('addresses').select('id')],
    ['wishlists', () => service.from('wishlists').select('id')],
    ['wishlist_items', () => service.from('wishlist_items').select('*')],
    ['orders', () => service.from('orders').select('id')],
    ['order_items', () => service.from('order_items').select('id')],
    ['payments', () => service.from('payments').select('id')],
    ['contact messages', () => service.from('contact_messages').select('id')],
    ['newsletter subscribers', () => service.from('newsletter_subscribers').select('id')],
  ]
  for (const [label, q] of checks) {
    const { data, error } = await q()
    assert(!error && len(data) === 0, `cleanup: no ${label} left`, error?.message)
  }
  const { data: drafts } = await service.from('products').select('id').eq('id', created.draftProduct!)
  assert(len(drafts) === 0, 'cleanup: draft product gone')
  const { data: inact } = await service.from('product_variants').select('id').eq('id', created.inactiveVariant!)
  assert(len(inact) === 0, 'cleanup: inactive variant gone')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log(`\x1b[1mRLS policy verification\x1b[0m — ${url}`)
  console.log(`run id: ${RAND}`)
  try {
    await setup()
    await phaseAnon()
    await phaseCustomer()
    await phaseAdmin()
    await phaseOtherIsolation()
  } catch (err) {
    console.error(`\n\x1b[31mAborted: ${err instanceof Error ? err.message : err}\x1b[0m`)
    failures.push(`[setup] ${err instanceof Error ? err.message : String(err)}`)
  } finally {
    await cleanup().catch((e) => console.error(`\n\x1b[31mCleanup error: ${e.message}\x1b[0m`))
  }

  console.log(`\n\x1b[1mResult: ${passed} passed, ${failures.length} failed\x1b[0m`)
  if (failures.length > 0) {
    console.log('Failed checks:')
    for (const f of failures) console.log(`  - ${f}`)
    process.exitCode = 1
  }
}

void main()
