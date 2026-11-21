/**
 * All site copy lives here.
 *
 * NOTE: this is finished sample copy for a fictional stable, "Ashgrove Stables".
 * Before launch, replace the name, numbers, prices, horse names and contact
 * details with the real ones (search this file for "SAMPLE").
 */

export const site = {
  name: 'Ashgrove Stables', // SAMPLE
  location: 'Vilnius region', // SAMPLE
};

export const seo = {
  title: 'Ashgrove Stables — Riding Lessons, Training & Livery near Vilnius',
  description:
    'Riding lessons for all ages, horse training and full livery in the countryside 20 minutes from Vilnius. Calm horses, small groups, experienced coaches. Book a first lesson.',
  image: {
    src: '/og-image.jpg',
    alt: 'A dark bay horse with a white blaze looking straight at the camera on a black background.',
  },
  // Used for Google's business listing data (structured data). SAMPLE values.
  business: {
    email: 'hello@ashgrovestables.lt',
    telephone: '+370 612 34567',
    priceRange: '€35–€70',
    address: {
      streetAddress: 'Ashgrove farm',
      addressLocality: 'Vilnius district',
      addressRegion: 'Vilnius County',
      addressCountry: 'LT',
    },
    areaServed: 'Vilnius',
    openingHours: [
      { days: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '20:00' },
      { days: ['Saturday', 'Sunday'], opens: '08:00', closes: '18:00' },
    ],
    offers: ['Riding lessons', 'Horse training', 'Livery', 'Competition coaching'],
  },
};

export const nav = [
  { label: 'The stable', href: '#stable' },
  { label: 'Lessons', href: '#lessons' },
  { label: 'A day', href: '#day' },
  { label: 'The horses', href: '#horses' },
  { label: 'Contact', href: '#contact' },
];

export const header = {
  skipLink: 'Skip to content',
  cta: { label: 'Book a visit', href: '#contact' },
  menuLabel: 'Menu',
};

export const preloader = {
  label: 'Saddling up',
};

export const hero = {
  number: '01',
  label: 'Equestrian centre · 20 minutes from Vilnius',
  // `accent` words are rendered in italic champagne.
  title: { before: 'Ride with', accent: 'quiet', after: 'confidence' },
  intro:
    'Riding lessons, training and livery in the countryside outside Vilnius — for first-timers, returning riders and everyone in between.',
  cta: { label: 'Book a lesson', href: '#contact' },
  scrollHint: 'Scroll',
  media: {
    still: '/images/hero-still.jpg',
    alt: 'A dark bay horse with a white blaze looks straight at you, then turns his head to the side as you scroll.',
  },
};

export const stable = {
  number: '02',
  label: 'The stable',
  title: { before: 'A place built', accent: 'around', after: 'the horse' },
  body: [
    'Ashgrove sits at the edge of a pine forest, twenty minutes from Vilnius. Twenty-four airy stalls, an indoor arena for the long winters, an outdoor arena for the long summer evenings, and forest trails that start at the gate.',
    'Our horses live as naturally as we can let them: out in the paddocks every day, hay around the clock, and a small team that knows each one by temperament as well as by name. Happy horses make confident riders — that is the whole idea.',
  ],
  facts: [
    { value: '24', label: 'Stalls' }, // SAMPLE
    { value: '18', label: 'Horses' }, // SAMPLE
    { value: '2009', label: 'Founded' }, // SAMPLE
  ],
  image: {
    src: '/images/stable/stable-01-aisle-dusk.jpg',
    alt: 'The stable aisle at dusk, lanterns glowing above the wooden stalls and a horse looking out.',
    width: 1600,
    height: 900,
  },
  // Two smaller photos layered over the aisle at different depths (also used in section 04).
  details: [
    {
      src: '/images/stable/stable-02-0600-morning-feed.jpg',
      alt: 'A horse eating hay in its stall at dawn, its breath steaming in the cold air.',
      width: 1600,
      height: 1067,
    },
    {
      src: '/images/stable/stable-05-2100-tack-room.jpg',
      alt: 'Saddles and bridles hanging in the tack room under a warm lamp at night.',
      width: 1600,
      height: 1067,
    },
  ],
};

export const lessons = {
  number: '03',
  label: 'Lessons',
  title: { before: 'Every rider at', accent: 'their own', after: 'pace' },
  video: {
    src: '/video/walk.mp4',
    poster: '/video/walk-poster.jpg',
    alt: 'A dark bay horse walking calmly, seen from the side.',
  },
  levels: [
    {
      number: '01',
      title: 'First steps',
      body: 'For complete beginners. You learn to groom, tack up and lead your horse, then take your first walk and trot on a calm, patient schoolmaster — on the lead rein until you feel ready.',
      details: ['From age 6', '45 min', '€35'],
    },
    {
      number: '02',
      title: 'Confidence',
      body: 'For riders who can walk and trot on their own. Rising trot, your first canter, simple patterns in the arena and, when you are ready, a quiet ride out along the forest trails.',
      details: ['Groups of up to 4', '60 min', '€40'],
    },
    {
      number: '03',
      title: 'Training',
      body: 'For independent riders who want more. Flatwork, pole work and small jumps to build a secure position, softer hands and a real conversation with the horse.',
      details: ['Private or pairs', '60 min', '€55'],
    },
    {
      number: '04',
      title: 'Competition',
      body: 'Coaching for dressage and show-jumping riders preparing for club and national shows. Ride your own horse or one of ours, with a plan built around your season.',
      details: ['Private', '60 min', '€70'],
    },
  ],
  cta: { label: 'Ask about lessons', href: '#contact' },
};

export const day = {
  number: '04',
  label: 'A day at the stable',
  title: { before: 'From first light', accent: 'to', after: 'last check' },
  scrollerLabel: 'A day at the stable, 06:00 to 21:00. Scroll sideways to see each time of day.',
  entries: [
    {
      time: '06:00',
      title: 'Morning feed',
      body: 'Hay, breakfast and a quiet check of every horse.',
      image: {
        src: '/images/stable/stable-02-0600-morning-feed.jpg',
        alt: 'A horse eating hay in its stall at dawn, its breath steaming in the cold air.',
        width: 1600,
        height: 1067,
      },
    },
    {
      time: '09:00',
      title: 'Arena lessons',
      body: 'The first riders arrive as light fills the arena.',
      image: {
        src: '/images/stable/stable-03-0900-arena-lesson.jpg',
        alt: 'A rider trotting a dark bay horse through beams of morning light in the indoor arena.',
        width: 1600,
        height: 1067,
      },
    },
    {
      time: '14:00',
      title: 'Paddock time',
      body: 'The herd goes out to graze, roll and be horses.',
      image: {
        src: '/images/stable/stable-04-1400-paddock-turnout.jpg',
        alt: 'Horses grazing in a misty paddock behind a wooden fence in the afternoon sun.',
        width: 1600,
        height: 1067,
      },
      // The paddock photo is brighter than the rest; darkened in CSS.
      darken: true,
    },
    {
      time: '18:00',
      title: 'Evening stables',
      body: 'The horses come in as the lanterns light the aisle.',
      image: {
        src: '/images/stable/stable-01-aisle-dusk.jpg',
        alt: 'The stable aisle at dusk, lanterns glowing above the wooden stalls and a horse looking out.',
        width: 1600,
        height: 900,
      },
    },
    {
      time: '21:00',
      title: 'Last check',
      body: 'Rugs on, and the lights go off stall by stall.',
      image: {
        src: '/images/stable/stable-05-2100-tack-room.jpg',
        alt: 'Saddles and bridles hanging in the tack room under a warm lamp at night.',
        width: 1600,
        height: 1067,
      },
    },
  ],
};

export const horses = {
  number: '05',
  label: 'The horses',
  title: { before: 'Meet', accent: 'the', after: 'herd' },
  intro:
    'Every horse at Ashgrove has a job they love and a rider level they suit. Here are a few of the faces you will meet.',
  // SAMPLE names. Portraits: every horse uses hero-still.jpg as a PLACEHOLDER until real
  // photos exist — then set `portrait` to e.g. '/images/horses/luna.jpg' and update `portraitAlt`.
  list: [
    { name: 'Luna', detail: 'Hanoverian mare · 11 · Dressage', portrait: '/images/hero-still.jpg', portraitAlt: 'Placeholder portrait for Luna: a dark bay horse with a white blaze.' },
    { name: 'Atlas', detail: 'Dutch Warmblood gelding · 12 · Jumping', portrait: '/images/hero-still.jpg', portraitAlt: 'Placeholder portrait for Atlas: a dark bay horse with a white blaze.' },
    { name: 'Vėjas', detail: 'Žemaitukas gelding · 16 · First lessons', portrait: '/images/hero-still.jpg', portraitAlt: 'Placeholder portrait for Vėjas: a dark bay horse with a white blaze.' },
    { name: 'Mira', detail: 'Connemara pony · 9 · Young riders', portrait: '/images/hero-still.jpg', portraitAlt: 'Placeholder portrait for Mira: a dark bay horse with a white blaze.' },
    { name: 'Bruno', detail: 'Trakehner gelding · 14 · Trail rides', portrait: '/images/hero-still.jpg', portraitAlt: 'Placeholder portrait for Bruno: a dark bay horse with a white blaze.' },
  ],
  portraitSize: { width: 1200, height: 1800 },
};

export const contact = {
  number: '06',
  label: 'Contact',
  title: { before: 'Come and', accent: 'meet', after: 'him.' },
  intro:
    'Book a first lesson, ask about livery, or just come and look around. We will put the kettle on and introduce you to the horses.',
  head: {
    // Frame 1 of the head-turn sequence = facing the camera.
    desktop: '/frames/head/001.webp',
    mobile: '/frames/head-mobile/001.webp',
    width: 1920,
    height: 1080,
    alt: 'The dark bay horse turns his head back to face you.',
  },
  // SAMPLE contact details.
  details: [
    { label: 'Address', value: 'Ashgrove farm, Vilnius district' },
    { label: 'Phone', value: '+370 612 34567', href: 'tel:+37061234567' as string | null },
    { label: 'Email', value: 'hello@ashgrovestables.lt', href: 'mailto:hello@ashgrovestables.lt' as string | null },
    { label: 'Hours', value: 'Tue–Fri 8:00–20:00 · Sat–Sun 8:00–18:00' },
  ],
  // SAMPLE: points at the sample email until a real booking link exists.
  cta: { label: 'Book a visit', href: 'mailto:hello@ashgrovestables.lt?subject=Booking%20a%20visit' },
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} Ashgrove Stables`,
  tagline: 'Riding lessons · Training · Livery',
  // Add real profile links here, e.g. { label: 'Instagram', href: 'https://instagram.com/...' }
  social: [] as { label: string; href: string | null }[],
  privacy: { label: 'Privacy & cookies', href: '/privacy/' },
  backToTop: 'Back to top',
};

export const privacy = {
  title: 'Privacy & Cookie Policy — Ashgrove Stables',
  description:
    'How Ashgrove Stables handles personal data and cookies on this website: what we collect, why, how long we keep it and your rights under the GDPR.',
  updated: '21 November 2026',
};

export const sectionCount = 6;
