/**
 * All site copy lives here.
 * Anything in [square brackets] is a placeholder for a fact we don't have yet —
 * replace it with real information. Do not invent facts.
 */

export const site = {
  name: '[stable name]',
  location: '[location]',
  title: '[stable name] — Equestrian centre in [location]',
  description:
    '[stable name] is an equestrian centre in [location] offering riding lessons, training and livery.',
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
  label: 'Equestrian centre · [location]',
  // `accent` words are rendered in italic champagne.
  title: { before: 'Ride with', accent: 'quiet', after: 'confidence' },
  intro: 'Riding lessons, training and livery at [stable name], [location].',
  cta: { label: 'Book a lesson', href: '#contact' },
  scrollHint: 'Scroll',
  media: {
    idleVideo: '/video/idle.mp4',
    idlePoster: '/video/idle-poster.jpg',
    still: '/images/hero-still.jpg',
    alt: 'A horse standing in soft light, looking straight at the camera.',
  },
};

export const stable = {
  number: '02',
  label: 'The stable',
  title: { before: 'A place built', accent: 'around', after: 'the horse' },
  body: [
    '[Short paragraph about the stable: its history, the setting in [location], the facilities.]',
    '[Second paragraph: the team, the approach to horse care, livery options.]',
  ],
  facts: [
    { value: '[00]', label: 'Stables' },
    { value: '[00]', label: 'Horses' },
    { value: '[year]', label: 'Founded' },
  ],
  image: {
    src: '/images/stable/stable-01-aisle-dusk.jpg',
    alt: 'The stable aisle at dusk, warm light falling across the stall doors.',
    width: 1600,
    height: 900,
  },
};

export const lessons = {
  number: '03',
  label: 'Lessons',
  title: { before: 'Every rider at', accent: 'their own', after: 'pace' },
  video: {
    src: '/video/walk.mp4',
    poster: '/video/walk-poster.jpg',
    alt: 'A horse walking calmly, seen from the side.',
  },
  levels: [
    {
      number: '01',
      title: 'First steps',
      body: '[Who this level is for and what riders learn.]',
      details: ['[Age / experience]', '[Duration]', '[Price]'],
    },
    {
      number: '02',
      title: 'Confidence',
      body: '[Who this level is for and what riders learn.]',
      details: ['[Age / experience]', '[Duration]', '[Price]'],
    },
    {
      number: '03',
      title: 'Training',
      body: '[Who this level is for and what riders learn.]',
      details: ['[Age / experience]', '[Duration]', '[Price]'],
    },
    {
      number: '04',
      title: 'Competition',
      body: '[Who this level is for and what riders learn.]',
      details: ['[Age / experience]', '[Duration]', '[Price]'],
    },
  ],
  cta: { label: 'Ask about lessons', href: '#contact' },
};

export const day = {
  number: '04',
  label: 'A day at the stable',
  title: { before: 'From first light', accent: 'to', after: 'last check' },
  entries: [
    {
      time: '06:00',
      title: 'Morning feed',
      body: '[What happens at this time of day.]',
      image: {
        src: '/images/stable/stable-02-0600-morning-feed.jpg',
        alt: 'Horses being fed in their stalls in the early morning.',
        width: 1600,
        height: 1067,
      },
    },
    {
      time: '09:00',
      title: 'Arena lesson',
      body: '[What happens at this time of day.]',
      image: {
        src: '/images/stable/stable-03-0900-arena-lesson.jpg',
        alt: 'A rider and horse during a lesson in the arena.',
        width: 1600,
        height: 1067,
      },
    },
    {
      time: '14:00',
      title: 'Paddock',
      body: '[What happens at this time of day.]',
      image: {
        src: '/images/stable/stable-04-1400-paddock-turnout.jpg',
        alt: 'Horses turned out to graze in the paddock in the afternoon.',
        width: 1600,
        height: 1067,
      },
      // The paddock photo is brighter than the rest; darkened in CSS.
      darken: true,
    },
    {
      time: '21:00',
      title: 'Tack room',
      body: '[What happens at this time of day.]',
      image: {
        src: '/images/stable/stable-05-2100-tack-room.jpg',
        alt: 'Saddles and bridles hanging in the tack room at night.',
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
  intro: '[Short introduction to the horses.]',
  // Names, details and portraits are placeholders. No horse portraits exist yet:
  // set `portrait` to an image path (e.g. '/images/horses/name.jpg') when available.
  list: [
    { name: '[Horse name 1]', detail: '[Breed · age]', portrait: null as string | null },
    { name: '[Horse name 2]', detail: '[Breed · age]', portrait: null as string | null },
    { name: '[Horse name 3]', detail: '[Breed · age]', portrait: null as string | null },
    { name: '[Horse name 4]', detail: '[Breed · age]', portrait: null as string | null },
    { name: '[Horse name 5]', detail: '[Breed · age]', portrait: null as string | null },
  ],
  portraitPlaceholder: '[Portrait]',
};

export const contact = {
  number: '06',
  label: 'Contact',
  title: { before: 'Come and', accent: 'meet', after: 'us' },
  intro: '[Invitation to visit or book a first lesson.]',
  head: {
    // Frame 1 of the head-turn sequence = facing the camera.
    desktop: '/frames/head/001.webp',
    mobile: '/frames/head-mobile/001.webp',
    width: 1280,
    height: 720,
    alt: 'The horse turns back to face you.',
  },
  details: [
    { label: 'Address', value: '[Street address], [location]' },
    { label: 'Phone', value: '[phone number]', href: null as string | null },
    { label: 'Email', value: '[email address]', href: null as string | null },
    { label: 'Hours', value: '[Opening hours]' },
  ],
  cta: { label: 'Get in touch', href: '#contact-details' },
};

export const footer = {
  copyright: `© ${new Date().getFullYear()} [stable name]`,
  tagline: 'Riding lessons · Training · Livery',
  social: [
    { label: '[Instagram]', href: null as string | null },
    { label: '[Facebook]', href: null as string | null },
  ],
  backToTop: 'Back to top',
};

export const sectionCount = 6;
