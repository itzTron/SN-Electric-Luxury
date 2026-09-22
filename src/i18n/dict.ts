export type Lang = "en" | "bn";

export type Dict = {
  nav: Record<"home"|"about"|"services"|"projects"|"gallery"|"testimonials"|"faq"|"blog"|"career"|"contact"|"quote", string>;
  common: Record<"callNow"|"whatsapp"|"getQuote"|"learnMore"|"viewAll"|"readMore"|"email"|"phone"|"name"|"message"|"submit"|"address"|"close", string>;
  hero: { eyebrow: string; title: string; sub: string };
  trust: Record<"projects"|"years"|"emergency"|"certified"|"rating"|"response", string>;
  sections: Record<"servicesTitle"|"servicesSub"|"whyTitle"|"whySub"|"aboutTitle"|"projectsTitle"|"projectsSub"|"testimonialsTitle"|"faqTitle"|"blogTitle"|"contactTitle", string>;
};

export const dict: Record<Lang, Dict> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      projects: "Projects",
      gallery: "Gallery",
      testimonials: "Testimonials",
      faq: "FAQ",
      blog: "Blog",
      career: "Career",
      contact: "Contact",
      quote: "Get Quote",
    },
    common: {
      callNow: "Call Now",
      whatsapp: "WhatsApp",
      getQuote: "Get Free Quote",
      learnMore: "Learn More",
      viewAll: "View All",
      readMore: "Read More",
      email: "Email",
      phone: "Phone",
      name: "Name",
      message: "Message",
      submit: "Submit",
      address: "Address",
      close: "Close",
    },
    hero: {
      eyebrow: "Certified Electricians · Since 2014",
      title: "Powering Your Home with Safety & Trust",
      sub: "Professional residential, commercial and industrial electrical solutions from certified electricians you can rely on — day, night, and every emergency in between.",
    },
    trust: {
      projects: "Projects Delivered",
      years: "Years of Experience",
      emergency: "Emergency Support",
      certified: "Certified Electricians",
      rating: "Average Rating",
      response: "Avg. Response Time",
    },
    sections: {
      servicesTitle: "Everything electrical, under one roof",
      servicesSub: "Ten focused service lines, each delivered by a licensed specialist and warrantied end-to-end.",
      whyTitle: "Craftsmanship you can trust — down to the last wire.",
      whySub: "We combine decade-long field experience with modern tools and safety-first protocols so your electrical work is done right the first time.",
      aboutTitle: "A decade wiring safer homes and smarter workplaces.",
      projectsTitle: "Recent work",
      projectsSub: "A snapshot of installations across residential, commercial, and industrial sites.",
      testimonialsTitle: "Loved by homeowners & operators",
      faqTitle: "Frequently asked",
      blogTitle: "From the workbench",
      contactTitle: "Let's talk about your project",
    },
  },
  bn: {
    nav: {
      home: "হোম",
      about: "আমাদের সম্পর্কে",
      services: "সেবাসমূহ",
      projects: "প্রজেক্ট",
      gallery: "গ্যালারি",
      testimonials: "রিভিউ",
      faq: "প্রশ্নোত্তর",
      blog: "ব্লগ",
      career: "ক্যারিয়ার",
      contact: "যোগাযোগ",
      quote: "কোটেশন",
    },
    common: {
      callNow: "কল করুন",
      whatsapp: "হোয়াটসঅ্যাপ",
      getQuote: "ফ্রি কোটেশন",
      learnMore: "বিস্তারিত",
      viewAll: "সবগুলো দেখুন",
      readMore: "আরও পড়ুন",
      email: "ইমেইল",
      phone: "ফোন",
      name: "নাম",
      message: "বার্তা",
      submit: "পাঠান",
      address: "ঠিকানা",
      close: "বন্ধ",
    },
    hero: {
      eyebrow: "সার্টিফাইড ইলেকট্রিশিয়ান · ২০১৪ থেকে",
      title: "নিরাপত্তা ও বিশ্বাসের সাথে আপনার বাড়িকে সচল রাখা",
      sub: "সার্টিফাইড ইলেকট্রিশিয়ানদের কাছ থেকে পেশাদার আবাসিক, বাণিজ্যিক ও শিল্প ইলেকট্রিকাল সেবা — দিনরাত, প্রতিটি জরুরি মুহূর্তে।",
    },
    trust: {
      projects: "সম্পূর্ণ প্রজেক্ট",
      years: "বছরের অভিজ্ঞতা",
      emergency: "জরুরি সাপোর্ট",
      certified: "সার্টিফাইড টেকনিশিয়ান",
      rating: "গড় রেটিং",
      response: "গড় রেসপন্স সময়",
    },
    sections: {
      servicesTitle: "এক ছাদের নিচে সকল ইলেকট্রিকাল সেবা",
      servicesSub: "দশটি বিশেষায়িত সেবা, প্রতিটি লাইসেন্সপ্রাপ্ত বিশেষজ্ঞ দ্বারা এবং সম্পূর্ণ ওয়ারেন্টিসহ।",
      whyTitle: "শেষ তারটি পর্যন্ত — বিশ্বস্ত কারিগরি।",
      whySub: "এক দশকের ফিল্ড অভিজ্ঞতা, আধুনিক সরঞ্জাম ও সেফটি-ফার্স্ট প্রোটোকল — প্রথমবারেই সঠিক কাজ।",
      aboutTitle: "এক দশক ধরে নিরাপদ ঘর ও স্মার্ট কর্মস্থল তৈরি।",
      projectsTitle: "সাম্প্রতিক কাজ",
      projectsSub: "আবাসিক, বাণিজ্যিক ও শিল্প সাইটে সাম্প্রতিক ইনস্টলেশনের একটি ঝলক।",
      testimonialsTitle: "গৃহস্থ ও ব্যবসায়ীদের প্রিয়",
      faqTitle: "সাধারণ প্রশ্ন",
      blogTitle: "ওয়ার্কবেঞ্চ থেকে",
      contactTitle: "আপনার প্রজেক্ট নিয়ে কথা বলি",
    },
  },
};

