// ===========================================================================
//  MILESTONE DATA — the single source of truth for the whole timeline.
//
//  To add YOUR photos later: drop image files in /public/images/ and list
//  their URLs in the `images` array of each milestone, e.g.
//      images: ["/images/wedding-1.jpg", "/images/wedding-2.jpg"]
//  An empty array renders an elegant styled placeholder instead.
// ===========================================================================

export interface Milestone {
  /** ISO date "YYYY-MM-DD" — used for the day-counter math. */
  date: string;
  /** True when the exact day is approximate (shows a gentle "around" hint). */
  approximate?: boolean;
  /** Human-friendly label shown in the UI, e.g. "Summer 2011". */
  year: string;
  title: string;
  location: string;
  description: string;
  /** Photo URLs. Leave empty for a styled placeholder; add URLs to show photos. */
  images: string[];
  /** Dot + accent color for this milestone. Muted, watercolor-like hex. */
  dotColor: string;
}

/** Anchor date for the counter — the day everything is measured from. */
export const WEDDING_DATE = "2018-06-23";

export const milestones: Milestone[] = [
  {
    date: "2007-09-01",
    approximate: true,
    year: "2007",
    title: "We First Met",
    location: "National Tsing Hua University, Hsinchu, Taiwan",
    description:
      "We met each other in the wind band at NTHU. This was the quiet beginning of a story we did not yet know we were writing.",
    images: ["/images/We First Met .jpg"],
    dotColor: "#C4AAAA", // dusty blush
  },
  {
    date: "2011-04-01",
    approximate: true,
    year: "April 2011",
    title: "New Moon Beach",
    location: "New Moon Beach, Zhubei, Hsinchu, Taiwan",
    description:
      "We met again at New Moon Beach in Zhubei. Some memories become clearer only years later, because they quietly changed the direction of life.",
    images: ["/images/new moon beach.webp"],
    dotColor: "#8CAEC2", // soft steel blue
  },
  {
    date: "2011-08-01",
    approximate: true,
    year: "August 2011",
    title: "We Decided to Be Together",
    location: "NTHU Campus, Hsinchu, Taiwan",
    description:
      "That summer, on campus, we decided to be together. This became the real beginning of us.",
    images: ["/images/We Decided to Be Together.jpg"],
    dotColor: "#C4A8AC", // soft rose-mauve
  },
  {
    date: "2011-09-01",
    approximate: true,
    year: "September 2011",
    title: "Two New Chapters",
    location: "Taiwan",
    description:
      "She joined HTC, stepping into a new stage of her career. Around the same time, I began my studies at NTU. We were each growing into who we would become — and into each other.",
    images: ["/images/two chapters.jpg"],
    dotColor: "#96A89E", // muted sage
  },
  {
    date: "2013-06-01",
    approximate: true,
    year: "2013",
    title: "Graduation from NTU",
    location: "National Taiwan University, Taipei, Taiwan",
    description:
      "I graduated from NTU and stepped into a new stage of life, with our relationship continuing alongside all the changes.",
    images: ["/images/2013.jpg"],
    dotColor: "#ACA896", // warm gray-green
  },
  {
    date: "2014-01-01",
    approximate: true,
    year: "2014",
    title: "A New Chapter at MOXA",
    location: "Taiwan",
    description:
      "She joined MOXA, building her career in a new direction. Both of us were finding our footing in the world, even as we continued building our life together.",
    images: ["/images/A New Chapter at MOXA .jpg"],
    dotColor: "#C8B49A", // warm taupe
  },
  {
    date: "2015-01-01",
    approximate: true,
    year: "2015",
    title: "A Long-Distance Chapter",
    location: "China",
    description:
      "I went to China for work for two years. It became one of the chapters where distance, work, and life tested how we stayed connected.",
    images: ["/images/long-distance.jpg"],
    dotColor: "#B0A8BE", // dusty lavender
  },
  {
    date: "2017-07-01",
    approximate: true,
    year: "Summer 2017",
    title: "The Proposal",
    location: "Kyoto, Japan",
    description:
      "I proposed in Kyoto during the summer. It was the moment our future started to become more real.",
    images: ["/images/kyoto.jpg"],
    dotColor: "#C2B0A0", // warm blush sand
  },
  {
    // ★ This dot is always visible as the timeline anchor.
    date: "2018-06-23",
    year: "June 23, 2018",
    title: "Day 0 — We Got Married",
    location: "Taiwan",
    description:
      "On June 23, 2018, we got married. From this day forward, the counter begins.",
    images: ["/images/wedding.jpg"],
    dotColor: "#C2A86E", // soft gold — the one constant on the timeline
  },
  {
    date: "2018-07-01",
    approximate: true,
    year: "July 2018",
    title: "Honeymoon in Paris and Iceland",
    location: "Paris, France and Iceland",
    description:
      "We traveled to Paris and Iceland for our honeymoon, carrying the excitement of a new marriage into places that felt almost unreal.",
    images: ["/images/iceland.jpg"],
    dotColor: "#D2BC9E", // soft champagne
  },
  {
    date: "2018-08-01",
    approximate: true,
    year: "August 2018",
    title: "A New Life in California",
    location: "Berkeley, California",
    description:
      "We moved to Berkeley, California, as I started my journey at UC Berkeley. It was the beginning of our life in the United States.",
    images: ["/images/life in california.jpg"],
    dotColor: "#8CAEC2", // soft steel blue
  },
  {
    date: "2019-01-01",
    approximate: true,
    year: "2019",
    title: "Brazil",
    location: "Brazil",
    description:
      "We traveled to Brazil, adding another faraway memory to our early married life.",
    images: ["/images/Brazil.jpg"],
    dotColor: "#C8AA90", // warm sand
  },
  {
    date: "2019-02-01",
    approximate: true,
    year: "February 2019",
    title: "University Village",
    location: "555 Ohlone Avenue, Albany / Berkeley, California",
    description:
      "We moved to University Village and slowly built our everyday life in California.",
    images: ["/images/University Village.jpg"],
    dotColor: "#96A89E", // muted sage
  },
  {
    date: "2020-03-01",
    approximate: true,
    year: "March 2020",
    title: "The World Changed",
    location: "California",
    description:
      "COVID changed everything. Like many people, we began a new remote-life chapter and learned to live through uncertainty together.",
    images: ["/images/Covid.jpg"],
    dotColor: "#B8AAAA", // muted rose-gray
  },
  {
    date: "2020-06-01",
    approximate: true,
    year: "2020",
    title: "A New Career Chapter",
    location: "California",
    description:
      "I received an offer from Cisco, opening another chapter in our life in the Bay Area.",
    images: ["/images/A New Career Chapter.jpg"],
    dotColor: "#98AEC4", // soft slate blue
  },
  {
    date: "2020-08-01",
    approximate: true,
    year: "August 2020",
    title: "Expecting Aidan",
    location: "Berkeley, California",
    description:
      "We were expecting our first child at the Higby apartment in Berkeley — a quiet anticipation, a home filling with hope before it filled with laughter.",
    images: ["/images/higby.JPG"],
    dotColor: "#98A8A0", // gray-sage
  },
  {
    date: "2021-04-27",
    year: "April 27, 2021",
    title: "Aidan Was Born",
    location: "California",
    description:
      "Our first son, Aidan, was born. Our story changed from two people building a life together to a family beginning a new chapter.",
    images: ["/images/Aidan was born.jpg"],
    dotColor: "#C8AABC", // soft petal
  },
  {
    date: "2022-03-01",
    approximate: true,
    year: "March 2022",
    title: "Our Home in San Jose",
    location: "San Jose, California",
    description:
      "We moved to our current house in San Jose, creating the home where many of our family memories now live.",
    images: ["/images/home in san jose.jpg"],
    dotColor: "#C4AA92", // warm sand
  },
  {
    date: "2022-10-29",
    year: "October 29, 2022",
    title: "Family Trip to Houston",
    location: "Houston, Texas",
    description:
      "A family trip to Houston — Aidan's first big road adventure, and a chance to explore somewhere new together as a growing family.",
    images: ["/images/family trip to texas.jpg"],
    dotColor: "#C4B4A0", // warm sand-taupe
  },
  {
    date: "2023-07-01",
    approximate: true,
    year: "July 2023",
    title: "Visiting Yosemite",
    location: "Yosemite National Park, California",
    description:
      "A summer trip to Yosemite with the family. Granite walls, waterfalls, and wide-open skies — a reminder of how big and beautiful the world is just a few hours from home.",
    images: ["/images/visiting Yosemite.jpg"],
    dotColor: "#96A87E", // earthy olive-green
  },
  {
    date: "2023-11-26",
    year: "November 26, 2023",
    title: "Italy — Visiting Rueben",
    location: "Italy",
    description:
      "We traveled to Italy to visit Rueben. The trip brought some unexpected moments, but everything turned out okay — and we came back with a memory we'll always hold onto.",
    images: ["/images/italy.jpg"],
    dotColor: "#A8B4C4", // soft periwinkle blue
  },
  {
    date: "2024-02-04",
    year: "February 4, 2024",
    title: "Ready for Baby Brother",
    location: "San Jose, California",
    description:
      "A maternity portrait before Asher arrived — the three of us, already a family of three, waiting to become four. Aidan held the ultrasound picture and already knew: a baby brother was on the way.",
    images: ["/images/baby brother.jpg"],
    dotColor: "#C8AABC", // soft petal
  },
  {
    date: "2024-03-12",
    year: "March 12, 2024",
    title: "Asher Was Born",
    location: "California",
    description:
      "Our second son, Asher, was born. Our family grew again, and life became fuller, louder, and richer.",
    images: ["/images/asher was born.jpg"],
    dotColor: "#88B2A8", // soft teal
  },
  {
    date: "2024-12-16",
    year: "December 16, 2024",
    title: "Family Trip to Japan & Tokyo Disneyland",
    location: "Tokyo, Japan",
    description:
      "We took the whole family to Japan for the first time — and ended up at Tokyo Disneyland. Aidan's eyes lit up, Asher was along for the ride, and for a few days the whole world felt magical.",
    images: ["/images/tokyo disney.jpg"],
    dotColor: "#A8BCC4", // soft sky-blue
  },
  {
    date: "2025-01-04",
    year: "January 4, 2025",
    title: "Trip back to Taiwan",
    location: "Taichung, Taiwan",
    description:
      "A family portrait to mark the new year — now a family of four, dressed up for Christmas, glowing in the light of the tree. This is what we built.",
    images: ["/images/family-portrait-jan-2025.webp"],
    dotColor: "#C8B498", // warm champagne-gold
  },
  {
    date: "2025-05-10",
    year: "May 10, 2025",
    title: "Family Trip to Hawaii",
    location: "Maui, Hawaii",
    description:
      "We brought the family to Maui — ocean air, lei around our necks, Aidan by our side. A memory made together before the summer ahead.",
    images: ["/images/hawaii-may-2026.webp"],
    dotColor: "#8AB4C4", // ocean blue
  },
  {
    date: "2025-08-04",
    year: "August 4, 2025",
    title: "Family Trip to Yellowstone",
    location: "Yellowstone National Park",
    description:
      "A summer adventure to Yellowstone with grandparents, Aidan, and Asher. We watched Old Faithful together and realized that the best memories are the ones made as a whole family.",
    images: ["/images/yellowstone-aug-2025.webp"],
    dotColor: "#96A892", // earthy sage
  },
  {
    date: "2025-12-01",
    approximate: true,
    year: "December 2025",
    title: "Visiting Texas",
    location: "Texas",
    description:
      "A December trip to Texas with the whole family — warm reunions, big skies, and the kind of time together that feels easy and full.",
    images: ["/images/visiting Texas.jpg"],
    dotColor: "#C4A890", // warm sand
  },
  {
    date: "2026-06-23",
    year: "June 23, 2026",
    title: "Eight Years Together",
    location: "San Jose, California",
    description:
      "Eight years ago today, we became family. From the wind band at NTHU to a home in San Jose, from Kyoto to Berkeley, from two to four — every day has been worth counting. Happy 8th anniversary.",
    images: ["/images/anniversary-8yr-jun-2026.webp"],
    dotColor: "#C2A86E", // soft gold — matches the wedding anchor
  },
];
