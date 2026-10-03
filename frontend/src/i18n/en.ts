import type { Translations } from './ru';

export const en: Translations = {
  meta: {
    home: {
      title: 'Websites, Telegram bots and CRM for business — Akmal, developer',
      description:
        'Websites, Telegram bots, Mini Apps and CRM systems for businesses in Tashkent. Full cycle: from discovery to launch and support.',
    },
    about: {
      title: 'About — Akmal, developer for business',
      description:
        'Direct work, no middlemen: discovery, design, development, launch and support of digital products for business.',
    },
    services: {
      title: 'Services — websites, Telegram bots, Mini Apps and CRM',
      description:
        'Multi-page websites, landing pages, Telegram bots, Mini Apps, CRM systems, integrations, hosting and support.',
    },
    projects: {
      title: 'Projects — websites and bots for business',
      description: 'Real websites, Telegram bots and web apps for learning centres, schools, cafés and communities.',
    },
    contacts: {
      title: 'Contact — discuss a project',
      description: "Leave a request or message me on Telegram — I'll reply and suggest a solution for your task.",
    },
    notFound: {
      title: 'Page not found — akmal.dev',
      description: "This page doesn't exist. Start from the home page or browse services.",
    },
  },
  common: {
    skip: 'Skip to content',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    language: 'Language',
    close: 'Close',
    prev: 'Previous',
    next: 'Next',
    toTop: 'Back to top',
    scroll: 'Scroll',
  },
  nav: {
    home: 'Home',
    about: 'About',
    services: 'Services',
    projects: 'Projects',
    contacts: 'Contact',
    cta: 'Discuss a project',
  },
  hero: {
    label: 'Developer for business · Tashkent',
    titleA: 'Websites, bots and CRM',
    titleB: 'for your business',
    lead: "I'm Akmal, a developer based in Tashkent. I build websites, Telegram bots, Telegram Mini Apps and CRM systems for companies — and connect them, so your leads, clients and sales live in one place.",
    ctaPrimary: 'Discuss a project',
    ctaSecondary: 'See projects',
    facts: ['12 projects in the portfolio', 'You work with me directly, no middlemen', 'Full cycle — from brief to support'],
  },
  scene: {
    label: 'Services',
    items: [
      {
        title: 'Business websites',
        text: 'Corporate sites and landing pages: clear structure, built for phones, ready for search, with an admin panel so you can change texts and prices without a developer.',
        tags: ['Landing pages', 'Multi-page', 'Catalogues'],
      },
      {
        title: 'Telegram bots',
        text: 'A bot that takes requests, answers common questions and sells: conversation flows, online payment, manager notifications and data sent straight to your CRM.',
        tags: ['Requests', 'Payments', 'Broadcasts'],
      },
      {
        title: 'Telegram Mini Apps',
        text: 'Any web app right inside Telegram: an online store, bookings, a personal account, a loyalty programme, an internal tool for your team. Everything a website can do — in the messenger, nothing to install.',
        tags: ['Stores', 'Services', 'Accounts'],
      },
      {
        title: 'CRM systems',
        text: 'One place for clients and deals: sales pipeline, tasks for your team, roles and access rights, reports, and links to your website and bot.',
        tags: ['Sales pipeline', 'Tasks', 'Reports'],
      },
    ],
    systemLabel: 'System',
    systemTitleA: 'Everything connected',
    systemTitleB: 'into one system',
    systemText: 'A request from your website lands in the CRM, your manager gets a task, and the client gets a Telegram notification.',
    systemCta: 'All services',
  },
  homeProjects: {
    label: 'Projects',
    titleA: 'Projects that are',
    titleB: 'already live',
    intro: 'Websites and bots for learning centres, music schools, cafés and communities. Each case shows the task, the solution and the screens.',
    cta: 'All projects',
  },
  process: {
    label: 'How I work',
    titleA: 'Six steps from brief',
    titleB: 'to launch',
    intro: 'You know in advance what happens at each stage and what you get at the end of it.',
    outLabel: 'You get',
    steps: [
      {
        title: 'Discovery',
        text: "I get to know your business and processes: where requests come from and where time gets lost. We decide what's needed at launch.",
        out: 'Scope, timeline and price',
      },
      {
        title: 'Design',
        text: 'I plan the structure and interface: which sections, what the client sees and where they click. We sign off the layout before development starts.',
        out: 'An approved layout',
      },
      {
        title: 'Development',
        text: 'I build the working product from the layout: pages, forms, payments, accounts, and links to your CRM and Telegram.',
        out: 'A working version to review',
      },
      {
        title: 'Testing',
        text: 'I check every scenario on phones and computers, fix bugs and make your edits within the agreed scope.',
        out: 'A launch-ready version',
      },
      {
        title: 'Launch',
        text: 'I put the project on a server, connect your domain and a secure connection, and set up analytics.',
        out: 'A live project on your domain',
      },
      {
        title: 'Support',
        text: 'After launch I stay in touch: updates, backups, improvements and new features as your business grows.',
        out: 'Stable operation and growth',
      },
    ],
  },
  form: {
    label: 'Request',
    titleA: 'Tell me',
    titleB: 'about your task',
    intro: "Leave your contacts — I'll get in touch, ask a few questions and suggest a solution, timeline and price. No strings attached.",
    nameLabel: 'Name',
    namePlaceholder: 'How should I address you',
    phoneLabel: 'Phone',
    phonePlaceholder: '+998 90 123 45 67',
    telegramLabel: 'Telegram',
    telegramPlaceholder: '@username',
    commentLabel: 'Comment',
    commentPlaceholder: 'Briefly about your task: what you need, timing, wishes',
    optional: 'optional',
    consent: 'I agree to the processing of my personal data',
    errorConsent: 'Please tick the consent to the processing of personal data',
    errorName: 'Please tell me how to address you',
    errorPhone: 'Enter the full number: +998 and 9 digits',
    errorTelegram: 'Telegram username: 5+ characters, Latin letters, digits and "_"',
    submit: 'Send request',
    submitting: 'Sending…',
    successTitle: 'Request sent',
    successText: "Thank you! I'll get back to you shortly.",
    successClose: 'OK',
    failTitle: "Couldn't send it",
    failText: 'Please try again or message me on Telegram.',
    retry: 'Try again',
    writeTelegram: 'Message on Telegram',
    alt: 'Prefer to write yourself?',
  },
  footer: {
    titleA: 'Have a task?',
    titleB: "Let's talk.",
    cta: 'Discuss a project',
    navTitle: 'Pages',
    contactsTitle: 'Contact',
    languageTitle: 'Language',
    city: 'Tashkent, Uzbekistan',
  },
  about: {
    label: 'About',
    title: 'About',
    lead: "My name is Akmal. I'm a developer based in Tashkent, and I build digital products for business: websites, Telegram bots, Telegram Mini Apps and CRM systems. I work with small and mid-sized businesses and with companies that need their own system for managing clients.",
    mission: "My job isn't just to ship a website or a bot — it's to make them useful: collecting requests, saving your team's time and helping you sell.",
    whyLabel: 'Why me',
    whyTitleA: 'Why it’s',
    whyTitleB: 'easy to work with me',
    why: [
      {
        title: 'One person in charge',
        text: 'You talk directly to the person doing the work. No account managers, no broken telephone, no agency markup.',
      },
      {
        title: 'Full cycle',
        text: 'Discovery, design, development, launch and support — all in one pair of hands. No need to hire a designer, a developer and someone to host it separately.',
      },
      {
        title: 'Plain language',
        text: 'I explain decisions without jargon: what it gives your business, what it costs and when it will be ready.',
      },
      {
        title: 'The project is yours',
        text: 'Once paid, the project is fully handed over to you: access, admin panel and all materials.',
      },
    ],
    processLabel: 'Process',
    ctaTitleA: 'Shall we start',
    ctaTitleB: 'with your task?',
    ctaText: "Tell me what your business needs — I'll suggest a solution, timeline and price.",
  },
  services: {
    label: 'Services',
    title: 'Services',
    intro: 'I build products for real business needs — from a website for your ads to a system where your team manages every client. Order a single service or bring everything together into one connected system.',
    priceNote: 'I estimate the price after a short, free conversation about your task.',
    includesLabel: "What's included",
    discuss: 'Discuss this service',
    items: [
      {
        title: 'Multi-page website',
        short: "A corporate site with sections, a catalogue and request forms — your company's face online.",
        includes: [
          'Sections built around your business',
          'Product or service catalogue',
          'Request forms with notifications',
          'Built for phones',
          'Ready for search',
          'Admin panel and analytics',
        ],
      },
      {
        title: 'Landing page',
        short: 'A one-page site for ads and product launches: a strong offer and a one-click request.',
        includes: ['Structure that leads to a request', 'Fast loading on phones', 'Requests to Telegram or CRM', 'Analytics and ad tracking'],
      },
      {
        title: 'Telegram bot',
        short: 'A bot for requests, consultations and sales that works around the clock.',
        includes: [
          'Conversation flows for your process',
          'Catalogue and cart',
          'Online payment',
          'Manager notifications',
          'Client broadcasts',
          'Data to your CRM or spreadsheet',
        ],
      },
      {
        title: 'Telegram Mini App',
        short: "A full web app inside Telegram for any task: a store, a booking service, a personal account, reservations, a loyalty programme or an internal tool for staff. Your clients don't need to install anything.",
        includes: [
          'Online stores and catalogues',
          'Booking and reservations',
          'Personal accounts and loyalty programmes',
          'Services and internal tools for your team',
          'Online payment and notifications',
          'Links to your CRM, website and bot',
        ],
      },
      {
        title: 'CRM system',
        short: 'A system where your team manages clients, deals and tasks — instead of spreadsheets and chats.',
        includes: [
          'Client base and request history',
          'Sales pipeline and deal stages',
          'Tasks for your team',
          'Roles and access levels',
          'Reports and analytics',
          'Links to your website, Telegram and other services',
        ],
      },
      {
        title: 'Integrations',
        short: 'I connect your website, bot, CRM and the tools you already use, so nobody copies data by hand.',
        includes: [
          'Website and bot requests — straight to CRM',
          'Online payment',
          'Google Sheets',
          'Telegram notifications',
          'Third-party services',
        ],
      },
      {
        title: 'Domain and email',
        short: "I'll pick and register a domain and set up company email on it.",
        includes: ['Domain in .uz, .com and other zones', 'DNS setup', 'Email like info@yourdomain'],
      },
      {
        title: 'Hosting and launch',
        short: 'I host your project on a reliable server and keep an eye on its availability.',
        includes: ['Secure connection (SSL)', 'Daily backups', 'Uptime monitoring', 'Domain connection'],
      },
      {
        title: 'Technical support',
        short: 'I take care of your project after launch.',
        includes: [
          'Updates and fixes',
          'Backups',
          'Monitoring',
          'Small improvements on request',
          'Fast response to critical incidents',
        ],
      },
      {
        title: 'Improvements',
        short: "New sections, features and integrations for a project that's already live — even if someone else built it.",
        includes: ['Estimate before we start', 'Agreed timeline', 'No downtime for your site'],
      },
    ],
  },
  projects: {
    label: 'Projects',
    title: 'Projects',
    intro: "Websites, bots and web apps I've built for businesses. Each case shows the task, what was done and how it looks.",
    filterAll: 'All',
    filterWebsite: 'Websites',
    filterBot: 'Bots',
    filterWebapp: 'Web apps',
    categoryWebsite: 'Website',
    categoryWebapp: 'Web app',
    categoryBot: 'Telegram bot',
    categoryOther: 'Project',
    statusLive: 'Live',
    statusCompleted: 'Completed',
    statusPrototype: 'Prototype',
    viewCase: 'View case',
    openSite: 'Open site',
    noLink: 'No public link',
    doneLabel: 'What was done',
    featuresLabel: 'Key features',
    mediaLabel: 'Project screens',
    videoLabel: 'Screen recording',
    items: {
      cashflow: {
        title: 'Cashflow Tashkent',
        subtitle: 'Website for a business community',
        description:
          'The community needed a site where members see upcoming meetups without organisers editing it by hand every time. Events are pulled from a Google Sheet automatically; texts are edited in the admin panel.',
        features: ['Event listings from Google Sheets', 'Admin panel for texts', 'Custom design'],
      },
      sonataSchool: {
        title: 'Sonata School',
        subtitle: 'Multilingual music school website',
        description:
          "The site introduces parents to the school's teachers and programmes, with teacher videos, several languages and a structure that helps the school get found in search.",
        features: ['Teacher videos', 'Several languages', 'Search-ready structure'],
      },
      flexcamp: {
        title: 'FlexCamp',
        subtitle: 'Summer camp website',
        description:
          'A business-card site where parents find up-to-date session info and read feedback from other families. Content is updated through the admin panel.',
        features: ['Visitor reviews', 'Admin panel', 'Built for phones'],
      },
      aysdrums: {
        title: 'AysDrums',
        subtitle: 'Sales website for a music studio',
        description:
          'A site that leads visitors to sign up: a form with number validation, lively animations and search optimisation. Equally comfortable on a phone and a big screen.',
        features: ['Sign-up form', 'Interface animations', 'Search optimisation'],
      },
      sonataBot: {
        title: 'Sonata Bot',
        subtitle: 'Schedule bot for a music school',
        description:
          'The schedule was kept by hand and lessons were being missed. The bot shows the timetable and sends reminders on its own; the admin updates it in a Google Sheet — no developer needed.',
        features: ['Automatic lesson reminders', 'Schedule from Google Sheets', 'Managed without a developer'],
      },
      learningCenter: {
        title: 'Learning Center',
        subtitle: 'Learning centre website',
        description:
          'A multi-page site with a course catalogue, a level test and online sign-up, so visitors immediately see which course suits them.',
        features: ['Level test', 'Course catalogue', 'Online sign-up'],
      },
      techProject: {
        title: 'Tech Project',
        subtitle: 'Web system for a company process',
        description:
          'A web app with a database, a thought-through interface and server deployment — a system built around a specific business task.',
        features: ['Data structure for the process', 'Working system logic', 'Server deployment'],
      },
      onlineShop: {
        title: 'Online Shop',
        subtitle: 'Online store',
        description:
          'Catalogue, cart, checkout, customer accounts and an admin panel for products — a store you can launch and start taking orders right away.',
        features: ['Cart and checkout', 'Customer account', 'Product management'],
      },
      fastfoodBot: {
        title: 'Fast-food Bot',
        subtitle: 'Ordering bot for a café',
        description:
          "Menu and cart right in Telegram, orders with an address and phone number. Every new order lands instantly in the café's staff group.",
        features: ['Menu and cart', 'Delivery location on the map', 'Orders to the staff group'],
      },
      messenger: {
        title: 'Messenger',
        subtitle: 'Web messenger',
        description:
          'A messenger with chats, people search by username, photo sharing and deleting messages and conversations.',
        features: ['Search by username', 'Photo sharing', 'Delete chats'],
      },
      newsPortal: {
        title: 'News Portal',
        subtitle: 'News portal with moderation',
        description:
          "Posts by category, search, reader submissions and an admin panel where editors review everything before it's published.",
        features: ['Post search', 'Reader submissions', 'Moderation'],
      },
      akkord: {
        title: 'Akkord',
        subtitle: 'Music school website prototype',
        description:
          'A design prototype with animations and a request form: the client sees what the site will look like before development begins.',
        features: ['Interface animations', 'Request form', 'Design prototype'],
      },
    },
  },
  contacts: {
    label: 'Contact',
    title: 'Contact',
    intro: "Write in whatever way suits you or leave a request — I'll reply and ask a couple of questions about your task.",
    phone: 'Phone',
    telegram: 'Telegram',
    email: 'Email',
    instagram: 'Instagram',
  },
  notFound: {
    code: '404',
    title: 'Page not found',
    text: 'The link may be out of date. Start from the home page or browse services.',
    home: 'Go home',
    services: 'Services',
  },
};
