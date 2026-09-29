// Static flavour content — NOT stored in the DB (see docs/DATA-MODEL.md §2).
// Sourced from the client product catalogue. Edit + redeploy to update.

export const flavours = [
  {
    slug: 'masala-cola',
    name: 'Masala Cola',
    collection: 'classic',
    color: '#2A1810',
    tagline: 'Bold cola, rounded off with classic Indian masala spice.',
    description: 'Bold cola, rounded off with classic Indian masala spice.',
  },
  {
    slug: 'nimbu-soda',
    name: 'Nimbu Soda',
    collection: 'classic',
    color: '#C6D82E',
    tagline: 'Sharp, zesty lemon with a clean, snappy fizz.',
    description: 'Sharp, zesty lemon with a clean, snappy fizz.',
  },
  {
    slug: 'orange-crush',
    name: 'Orange Crush',
    collection: 'classic',
    color: '#F07E1A',
    tagline: 'Bright, juicy orange with a true fruit finish.',
    description: 'Bright, juicy orange with a true fruit finish.',
  },
  {
    slug: 'kala-khatta',
    name: 'Kala Khatta',
    collection: 'classic',
    color: '#4B1152',
    tagline: 'Tangy-sweet black currant, a street-food classic.',
    description: 'Tangy-sweet black currant, a street-food classic.',
  },
  {
    slug: 'jeera-masala',
    name: 'Jeera Masala',
    collection: 'exotic',
    color: '#8A5A2B',
    tagline: 'Roasted cumin and spice — cooling, savoury, moreish.',
    description: 'Roasted cumin and spice — cooling, savoury, moreish.',
  },
  {
    slug: 'rose',
    name: 'Rose',
    collection: 'exotic',
    color: '#D6296B',
    tagline: 'Delicate rose syrup, floral and smooth on the way down.',
    description: 'Delicate rose syrup, floral and smooth on the way down.',
  },
  {
    slug: 'pineapple',
    name: 'Pineapple',
    collection: 'exotic',
    color: '#F2B705',
    tagline: 'Tropical and syrup-sweet, no artificial edge.',
    description: 'Tropical and syrup-sweet, no artificial edge.',
  },
  {
    slug: 'green-apple',
    name: 'Green Apple',
    collection: 'exotic',
    color: '#5B9A32',
    tagline: 'Crisp, tart green apple with a sharp, clean finish.',
    description: 'Crisp, tart green apple with a sharp, clean finish.',
  },
]

export const sizes = [
  { value: '200ml', label: 'Single serve' },
  { value: '250ml', label: 'On the go' },
  { value: '500ml', label: 'Personal bottle' },
  { value: '750ml', label: 'Share size' },
  { value: '1.5L', label: 'Family pack' },
  { value: '2L', label: 'Party pack' },
]

export const qualityPillars = [
  {
    title: 'Pure Ingredients',
    body: 'No shortcuts in the mix — clean ingredients, clearly listed.',
  },
  {
    title: 'Refreshing Taste',
    body: 'Carbonation and flavour balanced for a genuinely crisp sip.',
  },
  {
    title: 'Quality You Can Trust',
    body: 'Checked at every stage, from batching through to bottling.',
  },
  {
    title: 'Healthier Choices',
    body: 'Recipes built with better-for-you choices in mind.',
  },
]

export const distributionCities = [
  'Ahmedabad',
  'Mumbai',
  'Delhi NCR',
  'Jaipur',
  'Lucknow',
  'Kolkata',
  'Hyderabad',
  'Bengaluru',
  'Chennai',
  'Pune',
]

/**
 * Pick a readable text color (near-black or cream) for content placed on a
 * flavour brand color. Compares WCAG contrast ratios and returns whichever
 * of the two neutrals contrasts more strongly.
 */
export function textOn(hex) {
  const c = hex.replace('#', '')
  const full = c.length === 3 ? c.split('').map((ch) => ch + ch).join('') : c
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
  const toLinear = (v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  const lum = (rr, gg, bb) =>
    0.2126 * toLinear(rr) + 0.7152 * toLinear(gg) + 0.0722 * toLinear(bb)
  const L = lum(r, g, b)
  const INK = '#211915'
  const CREAM = '#FFF8EC'
  const contrast = (l1, l2) =>
    (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  // Luminance of the two neutrals (precomputed constants would also do).
  const inkLum = lum(0x21 / 255, 0x19 / 255, 0x15 / 255)
  const creamLum = lum(0xff / 255, 0xf8 / 255, 0xec / 255)
  return contrast(L, inkLum) >= contrast(L, creamLum) ? INK : CREAM
}
