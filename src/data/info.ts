/** Informational pages (footer links). Content is written in the house's voice;
 *  where a policy or detail is not yet brand-approved it renders an honest
 *  "client to supply" handoff note instead of a fabricated claim. */

export interface InfoSection { title: string; body: string }
export interface InfoPageDef {
  slug: string
  eyebrow: string
  title: string
  intro: string
  sections: InfoSection[]
  /** Rendered as a small handoff note when pending. */
  note?: string
}

export const infoPages: InfoPageDef[] = [
  {
    slug: 'care-guide',
    eyebrow: 'Client services',
    title: 'Care guide.',
    intro: 'Féroce pieces are made to be lived in — and with the right care, to last. A few house rules for the De Ville canvas and the Naji fur.',
    sections: [
      { title: 'Denim-textured coated canvas', body: 'Wipe the surface with a soft, slightly damp cloth and let it dry away from direct heat. Do not soak the bag or submerge it — the coated canvas is durable, not waterproof. For the all-over gold monogram, buff gently with a dry microfiber cloth and avoid abrasive or alcohol-based cleaners.' },
      { title: 'Hardware', body: 'Gold-tone hardware keeps its finish longest when it stays dry. After rain or heavy use, wipe the metal with a soft cloth before storing. Avoid contact with perfume, oils and solvents.' },
      { title: 'Fur pieces — the Naji line', body: 'Naji fur bags are made from high-quality fur, bobby-shiney and satin. Brush the fur lightly with a wide-tooth comb or soft brush in the direction of the pile, keep the piece dry, and store it flat in the dust bag away from moisture and direct sun.' },
      { title: 'Storage', body: 'Store every piece in its dust bag, lightly stuffed to hold its shape, in a cool, dry place. Do not stack heavy items on top. Rotate your pieces — a rested bag is a beautiful bag.' },
    ],
    note: 'Care details are drafted from the brand’s materials — confirm with the founder before launch.',
  },
  {
    slug: 'shipping-returns',
    eyebrow: 'Client services',
    title: 'Shipping & returns.',
    intro: 'How your order travels from the house to you — and what happens if a piece isn’t the one.',
    sections: [
      { title: 'Shipping markets and rates', body: 'Approved shipping markets, rates and estimated delivery windows are being confirmed with the founder. Until they are supplied, we do not publish a shipping promise we cannot keep.' },
      { title: 'Order processing', body: 'Once checkout is live, every order is verified by the server before a secure payment session is created, and a confirmation is sent to your email. Estimated dispatch windows for pre-order pieces are confirmed with the brand.' },
      { title: 'Returns', body: 'A 30-day returns window is advertised on the site. The full process — condition requirements, who covers return shipping, and how refunds are issued — is pending brand approval before launch.' },
    ],
    note: 'Shipping markets, rates and the return policy — client to supply before launch.',
  },
  {
    slug: 'privacy',
    eyebrow: 'Legal',
    title: 'Privacy.',
    intro: 'What the house collects, why, and how it is protected.',
    sections: [
      { title: 'Information we collect', body: 'The site collects what you choose to share: contact and delivery details at checkout, a message if you write to us, and an account profile if you sign in. The cart, wishlist and search are kept in your browser only.' },
      { title: 'How it is used', body: 'Your details are used to process orders, confirm payment, deliver messages, and improve the store. Payment details are handled by a secure payment provider — never by this site.' },
      { title: 'Your rights', body: 'You can request access to, correction of, or deletion of the personal data we hold about you by contacting the house. Final privacy wording is pending legal review.' },
    ],
    note: 'Final privacy policy — client to supply (pending legal review).',
  },
  {
    slug: 'terms',
    eyebrow: 'Legal',
    title: 'Terms.',
    intro: 'The conditions that govern your use of the store.',
    sections: [
      { title: 'Use of the store', body: 'Products, descriptions and prices are shown for your consideration. While the store is in preview, pieces shown are stopgap records until real SKUs are uploaded by the brand.' },
      { title: 'Orders and payment', body: 'An order is confirmed only after payment is verified by a secure provider. Prices are in Ghana cedis (GHS) and may change as final pricing is approved.' },
      { title: 'Intellectual property', body: 'The FÉROCE name, gold monogram and photography belong to the brand. Nothing on this site grants you a right to reuse them.' },
    ],
    note: 'Final terms — client to supply (pending legal review).',
  },
  {
    slug: 'journal',
    eyebrow: 'The house',
    title: 'Journal.',
    intro: 'Notes from the house — the making, the moments and what comes next.',
    sections: [
      { title: 'The house opens', body: 'Féroce begins with one belief: a designer bag should be lived in, not saved. High quality, sturdy and luxury — the De Ville structured flap in denim-textured coated canvas with an all-over gold monogram, and the Naji statement fur handbags in red maroon and golden. Two collections, one instinct.' },
      { title: 'What is on the way', body: 'The house is young and moving fast — new drops, one-of-one commissions and more collections are being finished with the founder. Follow the journey at @ferocefashion_ff to see the next chapter first.' },
    ],
    note: 'Further journal entries are being written — client to supply.',
  },
  {
    slug: 'accessibility',
    eyebrow: 'The house',
    title: 'Accessibility.',
    intro: 'The store is built to be usable by everyone.',
    sections: [
      { title: 'Our commitment', body: 'We design with accessibility in mind: keyboard-navigable menus and dialogs, visible focus states, reduced-motion support, and text that holds at least WCAG AA contrast over imagery.' },
      { title: 'Getting help', body: 'If any part of the store is hard to use, tell us and we will fix it. Reach the house through the contact page — every message is read.' },
    ],
  },
  {
    slug: 'cookies',
    eyebrow: 'Legal',
    title: 'Cookies.',
    intro: 'How the store keeps your session and what it remembers.',
    sections: [
      { title: 'What we use', body: 'Your bag, wishlist and preferences are stored in your own browser so your session survives a refresh. We do not currently run advertising or analytics cookies.' },
      { title: 'Consent', body: 'If analytics or marketing tools are added before launch, a consent platform will be configured first and your choice respected.' },
    ],
  },
]

export const getInfoPage = (slug: string | undefined) => infoPages.find(p => p.slug === slug)
