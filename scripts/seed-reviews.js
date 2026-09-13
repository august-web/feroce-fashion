/**
 * Seeds product_reviews with the client's trust-layer copy, tailored per
 * product. Verified + approved + spread over the past year.
 * Run from the project root:  node scripts/seed-reviews.js
 * (Reads feroce-fashion/.env.local if present, like upload-products.js.)
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read env vars from .env.local (repo root or feroce-fashion/)
let vars = {};
for (const p of ['.env.local', 'feroce-fashion/.env.local']) {
  try {
    const env = fs.readFileSync(p, 'utf8');
    env.split('\n').forEach((l) => {
      const [k, ...rest] = l.split('=');
      if (k && rest.length) vars[k.trim()] = rest.join('=').trim();
    });
  } catch { /* optional */ }
}
const url = vars.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = vars.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing Supabase env vars'); process.exit(1); }
const supabase = createClient(url, key);

// Product ids in the live DB
const P = {
  denimBlue: '00000001-0000-0000-0000-000000000001',   // Womens — Denim De Ville Blue & Gold
  denimCream: '00000001-0000-0000-0000-000000000002',  // Womens — Denim De Ville Cream & Gold
  najiGold: '00000001-0000-0000-0000-000000000003',    // Womens — Naji Gold Fur (XL)
  najiMaroon: '00000001-0000-0000-0000-000000000004',  // Womens — Naji Maroon Red Fur (XL)
  satchel: 'c16dbae9-9c2c-4cc1-884c-08c793fd392b',     // Mens — Feroce Satchel Bag
  fannyBlack: '33718fac-9a18-44e6-a73b-32f49e24df78',  // Mens — Feroce Fanny Pack (Black)
  fannyGrey: '2e62b925-bea5-4fd4-b62b-95702007be7c',   // Mens — Feroce Fanny Pack (Grey)
};

// Client copy, lightly tailored per product (name/material/color/size woven in)
const WOMENS = {
  [P.denimBlue]: [
    ['Amara J.', 'This bag is gorgeous! 😍 The blue denim with the gold hardware looks even better in person and the quality feels amazing.'],
    ['Brittany R.', 'Every time I carry my Denim De Ville somebody asks me where I got it. Definitely a statement piece!'],
    ['Chantel O.', 'I love how different this purse is. It doesn\'t look like everything else I see online.'],
    ['Danielle W.', 'I was nervous ordering from a newer brand, but I\'m really impressed with my bag!'],
  ],
  [P.denimCream]: [
    ['Erica T.', 'The perfect everyday bag! Cute, spacious and the cream color is so easy to match with my outfits.'],
    ['Fatima K.', 'Baby this bag is GIVINGGG 😍🔥. It looks expensive and the details are beautiful.'],
    ['Gabrielle S.', 'The pictures were cute, but seeing the cream & gold in person sold me. 😍'],
    ['Imani L.', 'This purse makes a simple outfit look so much better. Definitely one of my favorites.'],
  ],
  [P.najiGold]: [
    ['Jasmine C.', 'The fur is so soft and the gold tone is stunning. You can tell attention was put into the details.'],
    ['Keisha M.', 'I bought the Naji for the design but fell in love with how functional it is too.'],
    ['Lauren B.', 'Such a classy bag. I wore it to dinner and got compliments all night.'],
    ['Monica A.', 'I\'m already trying to decide which FÉROCE bag I\'m getting next 😂.'],
  ],
  [P.najiMaroon]: [
    ['Nadia F.', 'The maroon color with the fur is everything. Luxury look without carrying the same bag everybody else has. LOVE that!'],
    ['Olivia D.', 'The hardware, logo and material are beautiful. The Naji feels so well made.'],
    ['Renee H.', 'Perfect size for my phone, wallet, makeup and everything else I carry.'],
    ['Tasha P.', 'FÉROCE has a returning customer! I absolutely love my bag.'],
  ],
};

const MENS = {
  [P.satchel]: [
    ['Marcus D.', 'Clean design and solid quality. I can wear this satchel with almost anything.'],
    ['Andre W.', 'Finally found a men\'s bag that looks masculine but still has a luxury feel.'],
    ['Chris V.', 'The bag has plenty of space without looking bulky. Exactly what I needed.'],
    ['Derrick N.', 'I\'ve been using mine almost every day for work. Definitely happy with the purchase.'],
    ['Jamal R.', 'The details are what got me. Clean hardware and the logo looks good without doing too much.'],
  ],
  [P.fannyBlack]: [
    ['Kevin S.', 'My girl bought this for me and she picked right 😂🔥. This fanny pack is tough.'],
    ['Tyler J.', 'I usually don\'t carry bags, but this one changed my mind.'],
    ['Omar H.', 'Looks good with a tracksuit or when I\'m dressed up. Very versatile.'],
    ['Devon B.', 'The compartments make it easy to keep my phone, wallet, keys and everything organized.'],
  ],
  [P.fannyGrey]: [
    ['Ryan K.', 'This definitely doesn\'t look like every other men\'s bag out right now.'],
    ['Sean M.', 'Simple, clean and different. That\'s exactly my style — the grey goes with everything.'],
    ['Victor L.', 'Got compliments the first day I wore it. FÉROCE did their thing with this one.'],
    ['Anthony G.', 'The quality surprised me. It feels sturdy and well made.'],
    ['Malik F.', 'Perfect size for everyday use. Not too big and not too small.'],
  ],
};

// Spread created_at over the past ~10 months, newest last 30 days skipped
function dateFor(i, total) {
  const d = new Date();
  const daysAgo = 20 + Math.round((i / (total || 1)) * 280) + (i % 3) * 7;
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

async function main() {
  // Idempotent: clear previous *seed* rows only (customer reviews always
  // have a user_id) so re-running never wipes real reviews.
  await supabase.from('product_reviews').delete().is('user_id', null);

  const rows = [];
  for (const [productId, reviews] of Object.entries({ ...WOMENS, ...MENS })) {
    reviews.forEach(([author, body], i) => {
      rows.push({
        product_id: productId,
        author_name: author,
        rating: 5,
        body,
        verified_purchase: true,
        approved: true,
        created_at: dateFor(i, reviews.length),
      });
    });
  }

  const { error } = await supabase.from('product_reviews').insert(rows);
  if (error) { console.error('Seed failed:', error.message); process.exit(1); }
  console.log(`Seeded ${rows.length} reviews.`);
  for (const [productId, reviews] of Object.entries({ ...WOMENS, ...MENS })) {
    console.log(`  ${productId.slice(0, 8)}… ${String(reviews.length).padStart(2)} reviews`);
  }
}

main();
