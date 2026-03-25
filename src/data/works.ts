export interface Work {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  additionalContent?: {
    type: 'text' | 'image';
    content: string;
  }[];
}

export interface ServiceWorks {
  [serviceId: string]: {
    title: string;
    description: string;
    works: Work[];
  };
}

export const serviceWorks: ServiceWorks = {
  "01": {
    title: "Graphics & Logo Design",
    description: "A collection of my best logo designs and graphic branding projects.",
    works: [
      {
        id: "m2",
        title: "John Wick Thumbnail",
        description: "This is a thumbnail for my 1v1 Duel Map in Fortnite creative",
        type: "image",
        url: "https://i.imgur.com/y4HYaPD.jpeg",
        additionalContent: [
          { type: 'text', content: 'Profile version' },
          { type: 'image', content: 'https://i.imgur.com/QIJN4Ru.jpeg' },
          { type: 'text', content: 'Wide Version for Wallpaper' },
          { type: 'image', content: 'https://i.imgur.com/cZmNg3X.jpeg' },
        ]
      },
      {
        id: "g2",
        title: "Equinox Logo",
        description: "Logo for a Esports Brand",
        type: "video",
        url: "https://i.imgur.com/zTPjeab.mp4",
        additionalContent: [
          { type: 'text', content: 'Logo Details' },
          { type: 'image', content: 'https://i.imgur.com/TAmvyKU.png' },
          { type: 'text', content: 'Banner to represent the logo.' },
          { type: 'image', content: 'https://i.imgur.com/P8BAiLf.png' }
        ]
      },
      {
        id: "g3",
        title: "7R Esports Logo",
        description: "Logo for a Esports Brand",
        type: "image",
        url: "https://i.imgur.com/SDyFpc9.png",
        additionalContent: [
          { type: 'text', content: 'Banner to represent the logo.' },
          { type: 'image', content: 'https://i.imgur.com/dvGWBRL.png' }
        ]
      }
    ]
  },
  "02": {
    title: "Motion Graphics & Animation",
    description: "Dynamic animations and motion graphics that bring stories to life.",
    works: [
      {
        id: "m1",
        title: "Hand Shake Alert Animation",
        description: "A high-energy intro for a new mobile application.",
        type: "video",
        url: "https://i.imgur.com/VPas3dU.mp4",
        additionalContent: [
          { type: 'text', content: 'This is the logo that client provided.' },
          { type: 'image', content: 'https://i.imgur.com/NlBasJV.png' },
          { type: 'text', content: 'Client gave this review on the gig' },
          { type: 'image', content: 'https://i.imgur.com/xiVDp3z.png' },
        ]
      },
      {
        id: "m2",
        title: "Logo Reveal",
        description: "A smooth and professional logo animation for a corporate client.",
        type: "video",
        url: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-logo-reveal-31584-large.mp4"

      },
      {
        id: "m3",
        title: "Logo Reveal",
        description: "A smooth and professional logo animation for a corporate client.",
        type: "video",
        url: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-logo-reveal-31584-large.mp4"
      }
    ]
  },
  "03": {
    title: "Video Editing & Promo",
    description: "Professional video editing for commercials, promos, and social media.",
    works: [
      {
        id: "v1",
        title: "Money In Yo Pocket Commercial",
        description: "A fast-paced commercial for promoting a event.",
        type: "video",
        url: "https://i.imgur.com/VjCUynz.mp4"
      },
      {
        id: "v2",
        title: "Website Promotion Commercial for Hood Gear",
        description: "Commercial to promote Hood Gear",
        type: "video",
        url: "https://i.imgur.com/PU4uGKt.mp4"
      }
    ]
  },
  "04": {
    title: "Streaming Overlay & Branding",
    description: "Custom streaming assets for Twitch, YouTube, and Facebook Gaming.",
    works: [
      {
        id: "s1",
        title: "Esports Overlay Pack",
        description: "Complete set of overlays including alerts, panels, and screens.",
        type: "image",
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
      },
      {
        id: "s2",
        title: "Animated Alert System",
        description: "Eye-catching alerts for new followers and subscribers.",
        type: "video",
        url: "https://assets.mixkit.co/videos/preview/mixkit-gaming-stream-overlay-with-neon-lights-31585-large.mp4"
      }
    ]
  }
};

export const portfolioWorks: ServiceWorks = {
  "p1": {
    title: "Hood Report Podcast Branding",
    description: "Designed all graphical elements for brand, podcast, and business marketing.",
    works: [
      {
        id: "p1-1",
        title: "Podcast Branding Intro",
        description: "The opening sequence setting the mood for the podcast.",
        type: "video",
        url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-motion-graphics-of-circles-and-lines-32696-large.mp4",
        additionalContent: [
          { type: 'text', content: 'The Hood Report Podcast branding project was a comprehensive design effort. We created a visual language that reflects the raw and authentic nature of the podcast\'s content.' },
          { type: 'image', content: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop' },
          { type: 'text', content: 'From the logo to the social media assets, every element was carefully crafted to ensure brand consistency across all platforms.' }
        ]
      },
      {
        id: "p1-2",
        title: "Visual Identity",
        description: "Key frames and visual elements used throughout the branding.",
        type: "image",
        url: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop"
      }
    ]
  },
  "p2": {
    title: "RNE Premier Mobile Notary Visuals",
    description: "Comprehensive branding and marketing visuals for a professional notary service.",
    works: [
      {
        id: "p2-1",
        title: "Promotional Banner",
        description: "High-impact banner for social media marketing.",
        type: "image",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
      },
      {
        id: "p2-2",
        title: "Service Explainer",
        description: "A short video explaining the mobile notary process.",
        type: "video",
        url: "https://assets.mixkit.co/videos/preview/mixkit-man-editing-a-video-on-his-computer-42415-large.mp4"
      }
    ]
  },
  "p3": {
    title: "Streaming Overlay Package",
    description: "Custom designed streaming assets for professional content creators.",
    works: [
      {
        id: "p3-1",
        title: "Main Overlay",
        description: "The primary streaming layout with integrated webcam and alerts.",
        type: "image",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
      },
      {
        id: "p3-2",
        title: "Transition Animation",
        description: "Smooth stinger transition between scenes.",
        type: "video",
        url: "https://assets.mixkit.co/videos/preview/mixkit-gaming-stream-overlay-with-neon-lights-31585-large.mp4"
      }
    ]
  }
};
