export type Language = 'ar' | 'en';

export type NicheId =
  | 'all'
  | 'clothing'
  | 'perfume'
  | 'shoes'
  | 'accessories'
  | 'cafe'
  | 'wedding'
  | 'custom';

export interface ShowcaseSample {
  id: Exclude<NicheId, 'all' | 'custom'>;
  nicheTitle: string;
  brandName: string;
  tagline: string;
  highlights: string[];
  urlSlug: string;
}

export interface NicheCard {
  id: Exclude<NicheId, 'all'>;
  number: string;
  title: string;
  description: string;
}

export interface SimpleStudioCopy {
  nav: {
    niches: string;
    samples: string;
    contact: string;
    cta: string;
  };
  hero: {
    kicker: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    langSwitchLabel: string;
    logoCaption: string;
  };
  nichesSection: {
    kicker: string;
    title: string;
    subtitle: string;
  };
  samplesSection: {
    kicker: string;
    title: string;
    subtitle: string;
    allFilter: string;
    previewButton: string;
    requestSimilar: string;
    closeLabel: string;
    includedLabel: string;
  };
  contactSection: {
    kicker: string;
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    contactLabel: string;
    contactPlaceholder: string;
    typeLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitButton: string;
    errorRequired: string;
    successTitle: string;
    successBody: string;
    resetButton: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
  niches: NicheCard[];
  samples: ShowcaseSample[];
}

export const SIMPLE_STUDIO_COPY: Record<Language, SimpleStudioCopy> = {
  ar: {
    nav: {
      niches: 'المجالات',
      samples: 'أمثلة المواقع',
      contact: 'تواصل معنا',
      cta: 'اطلب موقعك',
    },
    hero: {
      kicker: 'Y-CRAFT · استوديو تصميم مواقع',
      headline: 'بنعملك ويب سايت شيك وسريع يعرض شغلك بأحسن شكل.',
      subheadline:
        'بنصمّم ونبني مواقع لبراندات الملابس، العطور والروائح، الشوزات، الإكسسوارات، الكافيهات، دعوات الأفراح الأونلاين، وأي فكرة تانية حابب تطلعها أونلاين.',
      primaryCta: 'اطلب موقعك دلوقتي',
      secondaryCta: 'شوف أمثلة المواقع',
      langSwitchLabel: 'English',
      logoCaption: 'تصميم بسيط · هوية واضحة',
    },
    nichesSection: {
      kicker: 'بنشتغل مع مين؟',
      title: 'مواقع معمولة مخصوص لنوع مشروعك.',
      subtitle:
        'كل مجال وليه طريقته في العرض، عشان عميلك يفهم منتجاتك ويطلب منك بسهولة من الموبايل.',
    },
    samplesSection: {
      kicker: 'أمثلة حية',
      title: 'شوف شكل الموقع لمجالك.',
      subtitle: 'اضغط على أي مثال عشان تشوف تفاصيله أو تطلب موقع زيه لبراندك.',
      allFilter: 'الكل',
      previewButton: 'معاينة الشكل',
      requestSimilar: 'عايز موقع زي ده',
      closeLabel: 'إغلاق',
      includedLabel: 'بيكون شامل إيه:',
    },
    contactSection: {
      kicker: 'يلا نبدأ',
      title: 'قولنا مشروعك إيه وهنكلمك.',
      subtitle: 'ابعتلنا بياناتك ونوع الموقع اللي محتاجه، وهنرد عليك بالتفاصيل والوقت والتكلفة.',
      nameLabel: 'الاسم',
      namePlaceholder: 'الاسم',
      contactLabel: 'رقم الواتساب أو الإيميل',
      contactPlaceholder: '010xxxxxxxx أو name@email.com',
      typeLabel: 'نوع الموقع المطلوب',
      notesLabel: 'تفاصيل بسيطة (اختياري)',
      notesPlaceholder: 'مثلاً: عايز موقع لبراند هدوم أو منيو لكافيه أو دعوة فرح...',
      submitButton: 'ابعت الطلب',
      errorRequired: 'من فضلك اكتب اسمك ورقم الواتساب أو الإيميل.',
      successTitle: 'وصلنا طلبك!',
      successBody: 'شكراً لتواصلك مع Y-CRAFT. هنتواصل معاك في أقرب وقت عشان نتفق على كل التفاصيل.',
      resetButton: 'ابعت طلب تاني',
    },
    footer: {
      tagline: 'مواقع لبراندات الملابس، العطور، الشوزات، الإكسسوارات، الكافيهات ودعوات الأفراح.',
      copyright: '© 2026 Y-CRAFT Web Design Studio',
    },
    niches: [
      {
        id: 'clothing',
        number: '01.',
        title: 'براندات الملابس',
        description: 'عرض الكولكشن، اختيار المقاسات والألوان، وطلب سريع عن طريق السلة أو الواتساب.',
      },
      {
        id: 'perfume',
        number: '02.',
        title: 'براندات العطور والروائح',
        description: 'تصميم هادي وراقي يوضح مكونات العطر، الأحجام المتاحة، وقصة كل ريحة.',
      },
      {
        id: 'shoes',
        number: '03.',
        title: 'الشوزات والأحذية',
        description: 'معرض صور واضح لكل زاوية، جدول المقاسات، وفلترة حسب الموديل واللون.',
      },
      {
        id: 'accessories',
        number: '04.',
        title: 'الإكسسوارات',
        description: 'عرض تفاصيل القطع، الخامات، وإمكانية تنسيق أكتر من قطعة في طلب واحد.',
      },
      {
        id: 'cafe',
        number: '05.',
        title: 'الكافيهات',
        description: 'منيو تفاعلي بالأسعار، QR Code للترابيزات، اللوكيشن، وحجز أو طلب أونلاين.',
      },
      {
        id: 'wedding',
        number: '06.',
        title: 'دعوات الأفراح',
        description: 'دعوة أونلاين باسم العريس والعروسة، عداد تنازلي، خريطة القاعة، وتأكيد الحضور.',
      },
      {
        id: 'custom',
        number: '07.',
        title: 'وحاجات تانية كتير',
        description: 'عندك فكرة براند، عيادة، استوديو، أو بورتفوليو شخصي؟ بنصمّمه من الصفر على مقاسك.',
      },
    ],
    samples: [
      {
        id: 'clothing',
        nicheTitle: 'براند ملابس',
        brandName: 'Kairo Threads',
        tagline: 'متجر ملابس ستريت وير مع اختيار المقاسات والطلب المباشر',
        highlights: [
          'عرض واضح للتيشيرتات والهوديز بالصور',
          'اختيار المقاس واللون بضغطة واحدة',
          'سلة شراء أو إرسال الطلب مباشرة على الواتساب',
        ],
        urlSlug: 'kairothreads.store',
      },
      {
        id: 'perfume',
        nicheTitle: 'براند عطور وروائح',
        brandName: 'Nafha Scents',
        tagline: 'واجهة فخمة لعرض العطور ومكونات كل زجاجة',
        highlights: [
          'توضيح النوتات العطرية (مقدمة وقلب وقاعدة)',
          'اختيار حجم العبوة (50ml / 100ml)',
          'تصميم دافئ يليق بهوية العطور الفاخرة',
        ],
        urlSlug: 'nafhascents.com',
      },
      {
        id: 'shoes',
        nicheTitle: 'براند شوزات',
        brandName: 'Khatwa Footwear',
        tagline: 'عرض موديلات الشوزات والسنيكرز بجدول مقاسات دقيق',
        highlights: [
          'فلترة حسب النوع والمقاس المتاح',
          'عرض تفاصيل الخامة والنعل في كل موديل',
          'تجربة تصفح سريعة جداً على الموبايل',
        ],
        urlSlug: 'khatwa.shoes',
      },
      {
        id: 'accessories',
        nicheTitle: 'إكسسوارات',
        brandName: 'Hala Silver & Craft',
        tagline: 'متجر بسيط وأنيق للخواتم، الساعات، والإكسسوارات',
        highlights: [
          'تنظيم الأقسام (خواتم، سلاسل، أساور)',
          'توضيح الخامات والعناية بالقطعة',
          'خيارات تغليف الهدايا داخل الطلب',
        ],
        urlSlug: 'halacraft.co',
      },
      {
        id: 'cafe',
        nicheTitle: 'كافيه',
        brandName: 'Bun & Roastery',
        tagline: 'منيو ديجيتال للكافيه يفتح بالـ QR Code مع اللوكيشن',
        highlights: [
          'أقسام واضحة للقهوة الساخنة، الآيسد، والحلويات',
          'تحديث سهل للأسعار والمشروبات الجديدة',
          'زر مباشر للوكيشن على الخريطة وساعات العمل',
        ],
        urlSlug: 'bunroastery.cafe',
      },
      {
        id: 'wedding',
        nicheTitle: 'دعوة فرح',
        brandName: 'Omar & Salma',
        tagline: 'دعوة فرح رقمية أنيقة تتبعت لينك على الواتساب للمعازيم',
        highlights: [
          'الأسماء والتاريخ والعداد التنازلي ليوم الفرح',
          'لوكيشن القاعة على Google Maps بضغطة زر',
          'فورم بسيط لتأكيد الحضور (RSVP) ورسالة تهنئة',
        ],
        urlSlug: 'omar-salma.wedding',
      },
    ],
  },
  en: {
    nav: {
      niches: 'What We Build',
      samples: 'Examples',
      contact: 'Contact',
      cta: 'Start a Site',
    },
    hero: {
      kicker: 'Y-CRAFT · Web Design Studio',
      headline: 'Clean, memorable websites made for your brand.',
      subheadline:
        'We design and build websites for clothing brands, perfume & fragrance labels, footwear, accessories, cafes, digital wedding invitations, and custom ideas.',
      primaryCta: 'Request Your Website',
      secondaryCta: 'See Examples',
      langSwitchLabel: 'العربية',
      logoCaption: 'Simple layouts · Clear identity',
    },
    nichesSection: {
      kicker: 'Who We Design For',
      title: 'Websites shaped around what you actually sell or share.',
      subtitle:
        'Each category has its own browsing rhythm so visitors understand your work and reach out easily from their phone.',
    },
    samplesSection: {
      kicker: 'Live Examples',
      title: 'Preview how your site can look.',
      subtitle: 'Pick a category or click any example to inspect what is included.',
      allFilter: 'All',
      previewButton: 'Preview Layout',
      requestSimilar: 'I Want a Site Like This',
      closeLabel: 'Close',
      includedLabel: 'What is included:',
    },
    contactSection: {
      kicker: 'Get Started',
      title: 'Tell us what kind of site you need.',
      subtitle:
        'Leave your contact info and project type, and we will get back to you with a clear plan and timeline.',
      nameLabel: 'Your Name',
      namePlaceholder: 'name',
      contactLabel: 'WhatsApp Number or Email',
      contactPlaceholder: '+20 10xxxxxxxx or name@email.com',
      typeLabel: 'Website Type',
      notesLabel: 'Quick Note (Optional)',
      notesPlaceholder: 'e.g., Clothing drop store, cafe QR menu, or wedding invite...',
      submitButton: 'Send Request',
      errorRequired: 'Please enter your name and a WhatsApp number or email.',
      successTitle: 'Request sent!',
      successBody:
        'Thanks for reaching out to Y-CRAFT. We will message or email you shortly to discuss your website.',
      resetButton: 'Send Another Request',
    },
    footer: {
      tagline: 'Websites for clothing, perfumes, shoes, accessories, cafes, and wedding invites.',
      copyright: '© 2026 Y-CRAFT Web Design Studio',
    },
    niches: [
      {
        id: 'clothing',
        number: '01.',
        title: 'Clothing Brands',
        description: 'Lookbook galleries, size & color selectors, and fast cart or WhatsApp checkout.',
      },
      {
        id: 'perfume',
        number: '02.',
        title: 'Perfume & Fragrance Brands',
        description: 'Warm, editorial layouts highlighting scent notes, bottle sizes, and mood.',
      },
      {
        id: 'shoes',
        number: '03.',
        title: 'Shoes & Footwear',
        description: 'Multi-angle product views, clear size charts, and quick model filtering.',
      },
      {
        id: 'accessories',
        number: '04.',
        title: 'Accessories',
        description: 'Detail-focused product pages for jewelry, bags, watches, and gift sets.',
      },
      {
        id: 'cafe',
        number: '05.',
        title: 'Cafes & Coffee Shops',
        description: 'QR-ready digital menus with prices, locations, hours, and easy ordering.',
      },
      {
        id: 'wedding',
        number: '06.',
        title: 'Wedding Invitations',
        description: 'Shareable event links with countdowns, Google Maps directions, and RSVP forms.',
      },
      {
        id: 'custom',
        number: '07.',
        title: 'And Much More',
        description: 'Launching a studio, portfolio, clinic, or local business? We craft it from scratch.',
      },
    ],
    samples: [
      {
        id: 'clothing',
        nicheTitle: 'Clothing Brand',
        brandName: 'Kairo Threads',
        tagline: 'Streetwear storefront with size selection & instant ordering',
        highlights: [
          'Clean lookbook grid for tees and hoodies',
          'One-tap size and color picker',
          'Direct cart or WhatsApp order checkout',
        ],
        urlSlug: 'kairothreads.store',
      },
      {
        id: 'perfume',
        nicheTitle: 'Perfume Brand',
        brandName: 'Nafha Scents',
        tagline: 'Editorial fragrance showcase highlighting scent notes & bottle sizes',
        highlights: [
          'Top, heart, and base scent note breakdown',
          'Bottle volume selector (50ml / 100ml)',
          'Warm visual tone matching luxury bottles',
        ],
        urlSlug: 'nafhascents.com',
      },
      {
        id: 'shoes',
        nicheTitle: 'Shoes Brand',
        brandName: 'Khatwa Footwear',
        tagline: 'Footwear catalog with quick EU/US size filtering',
        highlights: [
          'Filter models by style and available sizes',
          'Clear material and sole details',
          'Fast, lightweight mobile browsing',
        ],
        urlSlug: 'khatwa.shoes',
      },
      {
        id: 'accessories',
        nicheTitle: 'Accessories',
        brandName: 'Hala Silver & Craft',
        tagline: 'Minimal shop for rings, necklaces, and everyday pieces',
        highlights: [
          'Organized categories for rings, chains & bracelets',
          'Care instructions & material specs',
          'Optional gift wrapping at checkout',
        ],
        urlSlug: 'halacraft.co',
      },
      {
        id: 'cafe',
        nicheTitle: 'Cafe',
        brandName: 'Bun & Roastery',
        tagline: 'QR-friendly cafe menu with drinks, pastries & map directions',
        highlights: [
          'Clear sections for hot coffee, iced drinks & desserts',
          'Easy price and seasonal menu updates',
          'One-tap Google Maps location & opening hours',
        ],
        urlSlug: 'bunroastery.cafe',
      },
      {
        id: 'wedding',
        nicheTitle: 'Wedding Invite',
        brandName: 'Omar & Salma',
        tagline: 'Shareable digital wedding invitation with countdown & RSVP',
        highlights: [
          'Couple names, date & live countdown timer',
          'Direct venue map pin for guests',
          'Simple RSVP attendance form & guest wishes',
        ],
        urlSlug: 'omar-salma.wedding',
      },
    ],
  },
};
