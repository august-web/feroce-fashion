/**
 * BRAND HANDOFF — client to complete before launch.
 * ==================================================
 * These are the last honest placeholders on the storefront. The client must
 * supply approved text for each pending item. `value` renders once provided;
 * `handoff` renders while pending, so the site never claims details it
 * doesn't have. Every rendered note contains the phrase "client to supply" —
 * search for it to find all live handoff notes, or grep `handoff.` to find
 * every field below.
 *
 * Approved so far:
 *   email      hello@feroce.com — domain-matched business address; the
 *              feroce.com domain inbox MUST be provisioned by the client
 *              before launch (see emailInbox below). Old address
 *              ferocefashionff@gmail.com is retired.
 *   instagram  https://www.instagram.com/ferocefashion_ff
 *
 * Pending — the client supplies:
 *   legalLine      registered entity + jurisdiction (footer legal line)
 *   privacyConsent approved newsletter privacy / consent line
 *   emailInbox     provision the feroce.com email account/inbox for hello@feroce.com
 *   phone          telephone number for the contact page
 *   location       registered business location / address
 *   hours          client service hours
 *   tiktok, pinterest — social profile URLs
 */
export interface HandoffDetail {
  /** Approved client text; null while the client has not supplied it. */
  value: string | null
  /** Honest note shown in the UI while pending. */
  handoff: string
}

export const handoff = {
  legalLine: { value: null, handoff: 'Legal line pending — client to supply registered entity' },
  privacyConsent: { value: null, handoff: 'Privacy consent line pending — client to supply' },
  phone: { value: null, handoff: 'Phone — client to supply' },
  location: { value: null, handoff: 'Location — client to supply' },
  hours: { value: null, handoff: 'Client hours — client to supply' },
  emailInbox: { value: null, handoff: 'Domain email and inbox to be provisioned before launch — client to supply' },
  tiktok: { value: null, handoff: 'TikTok — client to supply' },
  pinterest: { value: null, handoff: 'Pinterest — client to supply' },
} satisfies Record<string, HandoffDetail>

/** Contact details shown on the Contact page. The email is a domain-matched
 *  business address; the feroce.com inbox for it must be provisioned before
 *  launch (tracked as handoff.emailInbox). */
export const contact = {
  email: 'hello@feroce.com',
  instagram: 'https://www.instagram.com/ferocefashion_ff',
}

/** Render a handoff detail: approved text when supplied, the handoff note otherwise. */
export const detail = (d: HandoffDetail): string => d.value ?? d.handoff
