import type {
  CurrencyCode,
  LanguageCode,
  OrderFulfillmentStatus,
  PriceRangePreset,
  ProductBadgeType,
  SortOption,
  SouvenirCategory,
} from '../types/store';

export const LANGUAGE_CODES: LanguageCode[] = ['en', 'zh-CN'];

export const LANGUAGE_OPTIONS: Array<{
  code: LanguageCode;
  shortLabel: string;
  nativeLabel: string;
}> = [
  { code: 'en', shortLabel: 'EN', nativeLabel: 'English' },
  { code: 'zh-CN', shortLabel: '中文', nativeLabel: '简体中文' },
];

export interface TranslationDictionary {
  brand: {
    wordmark: string;
    fullTitle: string;
  };
  header: {
    primaryNavAria: string;
    mobileNavAria: string;
    collection: string;
    wishlist: string;
    regions: string;
    collectors: string;
    shipping: string;
    orderTracking: string;
    bag: string;
    currencyAria: string;
    languageGroupAria: string;
    switchToEnglishAria: string;
    switchToChineseAria: string;
    openMenuAria: string;
    closeMenuAria: string;
    openBagAria: string;
    openWishlistAria: string;
    loyaltyLabel: string;
    pointsUnit: string;
    loyaltyAria: string;
    loyaltyTitle: string;
    loyaltyEstimateLabel: string;
    loyaltyRateNote: string;
    loyaltyRedeemNote: string;
    loyaltyEmptyHint: string;
    loyaltyOpenBag: string;
  };
  breadcrumb: {
    navAria: string;
    home: string;
    catalog: string;
    saved: string;
    showingPrefix: string;
    showingSingular: string;
    showingPlural: string;
  };
  promo: {
    regionAria: string;
    badge: string;
    title: string;
    description: string;
    endsIn: string;
    expired: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    daysFull: string;
    hoursFull: string;
    minutesFull: string;
    secondsFull: string;
  };
  announcements: {
    regionAria: string;
    dismissAria: string;
    messages: readonly string[];
  };
  hero: {
    carouselAria: string;
    prevAria: string;
    nextAria: string;
    tablistAria: string;
    inspectPiece: string;
    slides: Record<
      string,
      {
        kicker: string;
        headlineLine1: string;
        headlineLine2: string;
        description: string;
        ctaLabel: string;
      }
    >;
  };
  catalog: {
    eyebrow: string;
    heading: string;
    subtitlePrefix: string;
    artifactSingular: string;
    artifactPlural: string;
    subtitleSuffix: string;
    categoryGroupAria: string;
    saved: string;
    searchLabel: string;
    searchPlaceholder: string;
    clearSearchAria: string;
    sortLabel: string;
    sortFeatured: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    priceRangeLabel: string;
    priceGroupAria: string;
    allPrices: string;
    underPrefix: string;
    overPrefix: string;
    upToPrefix: string;
    maxPriceLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    resetFilters: string;
    outOfStock: string;
    compare: string;
    comparing: string;
    details: string;
    addToBag: string;
    quickBuy: string;
    quickLook: string;
    notifyMe: string;
    alertSet: string;
    badgeBestSeller: string;
    badgeNewArrival: string;
    badgeLowStock: string;
  };
  recommendations: {
    eyebrow: string;
    heading: string;
    curatedSubtitle: string;
    personalizedPrefix: string;
    personalizedSuffix: string;
    viewPiece: string;
    quickBuy: string;
    quickLook: string;
    notifyMe: string;
    alertSet: string;
    outOfStock: string;
  };
  craftsmanship: {
    eyebrow: string;
    heading: string;
    subtitle: string;
    stories: Record<
      string,
      {
        region: string;
        craft: string;
        summary: string;
        provenanceDetail: string;
      }
    >;
    notesHeading: string;
    notesSubheading: string;
    notes: Record<
      string,
      {
        location: string;
        purchasedItem: string;
        quote: string;
      }
    >;
  };
  newsletter: {
    eyebrow: string;
    heading: string;
    description: string;
    seasonalHighlight: string;
    storiesHighlight: string;
    emailLabel: string;
    emailPlaceholder: string;
    subscribeButton: string;
    subscribedPrefix: string;
    confirmationNote: string;
    changeButton: string;
    privacyNote: string;
    emptyEmailError: string;
    invalidEmailError: string;
  };
  footer: {
    brandSummary: string;
    shippingHeading: string;
    shippingDescription: string;
    navigationHeading: string;
    navCollection: string;
    navWorkshops: string;
    navCollectors: string;
    navTrackOrder: string;
    orderLookupHeading: string;
    orderLookupDescription: string;
    orderNumberLabel: string;
    orderNumberPlaceholder: string;
    lookUpButton: string;
    samplesPrefix: string;
    copyright: string;
    guarantee: string;
    emptyOrderError: string;
  };
  pdp: {
    inStock: string;
    outOfStock: string;
    closeAria: string;
    workshop: string;
    materials: string;
    dimensions: string;
    reviewSingular: string;
    reviewPlural: string;
    selectEdition: string;
    included: string;
    decreaseQtyAria: string;
    increaseQtyAria: string;
    selectedQtyAria: string;
    addToBag: string;
    restockAlertSet: string;
    notifyWhenAvailable: string;
    provenanceGuarantee: string;
    reviewsHeading: string;
    reviewsSubtitle: string;
    noReviews: string;
    relatedHeading: string;
    relatedSubtitleSuffix: string;
    share: string;
    shareAria: string;
    sharedFeedback: string;
    linkCopiedFeedback: string;
    hoverToZoom: string;
    writeReviewTitle: string;
    ratingLabel: string;
    starAriaSuffix: string;
    authorLabel: string;
    authorPlaceholder: string;
    locationLabel: string;
    locationPlaceholder: string;
    commentLabel: string;
    commentPlaceholder: string;
    submitReview: string;
    reviewSubmitted: string;
    authorError: string;
    commentError: string;
    verifiedCollector: string;
  };
  wishlist: {
    dialogAria: string;
    title: string;
    closeAria: string;
    emptyTitle: string;
    emptyDescription: string;
    browseCollection: string;
    outOfStock: string;
    addToBag: string;
    notifyMe: string;
    alertSet: string;
    remove: string;
    clearAll: string;
    moveInStockPrefix: string;
    noInStockItems: string;
  };
  cart: {
    dialogAria: string;
    backToBagAria: string;
    closeAria: string;
    bagTitle: string;
    checkoutTitle: string;
    receiptTitle: string;
    orderConfirmedTag: string;
    orderConfirmedHeadingPrefix: string;
    orderConfirmedHeadingSuffix: string;
    receiptPreparedFor: string;
    deliveryDetails: string;
    paymentLabel: string;
    paymentCod: string;
    paymentCard: string;
    giftCardNoteLabel: string;
    itemizedReceipt: string;
    qtyLabel: string;
    subtotal: string;
    giftWrap: string;
    expressShipping: string;
    complimentary: string;
    totalPaidDue: string;
    emptyTitle: string;
    emptyDescription: string;
    browseCollection: string;
    freeShippingUnlockedPrefix: string;
    freeShippingRemainingPrefix: string;
    freeShippingRemainingMid: string;
    remove: string;
    giftWrapTitle: string;
    giftWrapDescription: string;
    itemsCountSingular: string;
    itemsCountPlural: string;
    expressDelivery: string;
    totalLabel: string;
    fullName: string;
    fullNamePlaceholder: string;
    emailAddress: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    paymentMethod: string;
    cardInvoiceLink: string;
    cashOnDelivery: string;
    optionalGiftNote: string;
    giftNotePlaceholder: string;
    continueExploring: string;
    total: string;
    proceedToCheckout: string;
    placeOrder: string;
    loyaltyEstimatedPrefix: string;
    loyaltyRedeemNote: string;
  };
  compare: {
    title: string;
    subtitlePrefix: string;
    subtitleSuffix: string;
    clearAll: string;
    closeAria: string;
    emptyTitle: string;
    emptyDescription: string;
    returnToCollection: string;
    tableAria: string;
    artifactSpec: string;
    remove: string;
    price: string;
    originRegion: string;
    workshopKiln: string;
    materialsCraft: string;
    dimensionsCapacity: string;
    collectorRating: string;
    noReviewsYet: string;
    availableEditions: string;
    standard: string;
    provenanceNote: string;
    defaultProvenanceNote: string;
    bilingualCardSuffix: string;
    availability: string;
    inStock: string;
    outOfStock: string;
    action: string;
    addToBag: string;
    notifyMe: string;
    alertSet: string;
    tipOneSelected: string;
  };
  orderLookup: {
    title: string;
    subtitle: string;
    closeAria: string;
    orderNumberLabel: string;
    placeholder: string;
    checkStatus: string;
    recentAndSamples: string;
    samplePrompt: string;
    recentOrderTag: string;
    confirmedPlacedPrefix: string;
    orderHeadingPrefix: string;
    dispatchUpdate: string;
    recipientDestination: string;
    milestonesHeading: string;
    itemsInOrder: string;
    qtyLabel: string;
    subtotal: string;
    shipping: string;
    complimentary: string;
    giftWrap: string;
    total: string;
    idleTitle: string;
    idleDescription: string;
  };
  orderTracking: {
    title: string;
    subtitle: string;
    closeAria: string;
    emailLabel: string;
    emailPlaceholder: string;
    orderNumberLabel: string;
    orderNumberPlaceholder: string;
    submitButton: string;
    quickFillRecent: string;
    quickFillSample: string;
    shippingStatusLabel: string;
    estimatedDeliveryLabel: string;
    placedPrefix: string;
    orderHeadingPrefix: string;
    recipientLabel: string;
    milestonesHeading: string;
    itemsInOrder: string;
    qtyLabel: string;
    total: string;
    idleTitle: string;
    idleDescription: string;
    emptyEmailError: string;
    invalidEmailError: string;
    emptyOrderError: string;
    notFoundError: string;
  };
  notifyModal: {
    title: string;
    closeAria: string;
    outOfStockPrefix: string;
    activePrefix: string;
    activeDescriptionPrefix: string;
    activeDescriptionMid: string;
    updateEmail: string;
    done: string;
    formPromptPrefix: string;
    formPromptSuffix: string;
    emailLabel: string;
    cancel: string;
    notifyMe: string;
  };
  quickLook: {
    closeAria: string;
    eyebrow: string;
    workshop: string;
    dimensions: string;
    edition: string;
    addToBag: string;
    notifyMe: string;
    alertSet: string;
    viewFullDetails: string;
    inStock: string;
    outOfStock: string;
  };
  scrollTop: {
    ariaLabel: string;
  };
  appNotices: {
    addedToBagPrefix: string;
    addedToBagSuffix: string;
    compareLimitPrefix: string;
    compareLimitSuffix: string;
    compareTrayAria: string;
    compareLabel: string;
    clear: string;
    selectOneMore: string;
    compareNow: string;
    viewBag: string;
  };
  categories: Record<SouvenirCategory, string>;
  statuses: Record<OrderFulfillmentStatus, string>;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    brand: {
      wordmark: 'Yunshan Curio',
      fullTitle: 'Yunshan Curio · 云山礼器',
    },
    header: {
      primaryNavAria: 'Primary navigation',
      mobileNavAria: 'Mobile navigation',
      collection: 'Collection',
      wishlist: 'Wishlist',
      regions: 'Regions',
      collectors: 'Collectors',
      shipping: 'Shipping',
      orderTracking: 'Order Tracking',
      bag: 'Bag',
      currencyAria: 'Select currency',
      languageGroupAria: 'Select language',
      switchToEnglishAria: 'Switch language to English',
      switchToChineseAria: 'Switch language to Simplified Chinese',
      openMenuAria: 'Open navigation menu',
      closeMenuAria: 'Close navigation menu',
      openBagAria: 'Open shopping bag',
      openWishlistAria: 'Open saved wishlist',
      loyaltyLabel: 'Loyalty',
      pointsUnit: 'pts',
      loyaltyAria: 'Estimated loyalty points from current cart total',
      loyaltyTitle: 'Loyalty Points Tracker',
      loyaltyEstimateLabel: 'Estimated from current bag total',
      loyaltyRateNote: 'Earn 2 pts per $1 USD equivalent on every order.',
      loyaltyRedeemNote: 'Points can be redeemed at checkout toward future keepsakes.',
      loyaltyEmptyHint: 'Add an artifact to preview points earned on your order.',
      loyaltyOpenBag: 'Open Bag & Checkout',
    },
    breadcrumb: {
      navAria: 'Breadcrumb navigation',
      home: 'Home',
      catalog: 'Catalog',
      saved: 'Saved',
      showingPrefix: 'Showing',
      showingSingular: 'artifact',
      showingPlural: 'artifacts',
    },
    promo: {
      regionAria: 'Limited time seasonal promotion',
      badge: 'Limited Time Offer',
      title: 'Autumn Kiln & Tea Season Event',
      description:
        'Complimentary paulownia gift box & double loyalty points on seasonal keepsakes before this firing batch closes.',
      endsIn: 'Ends in',
      expired: 'Seasonal promotion ended',
      days: 'd',
      hours: 'h',
      minutes: 'm',
      seconds: 's',
      daysFull: 'Days',
      hoursFull: 'Hrs',
      minutesFull: 'Min',
      secondsFull: 'Sec',
    },
    announcements: {
      regionAria: 'Store announcements',
      dismissAria: 'Dismiss announcement bar',
      messages: [
        'Complimentary tracked express shipping on orders of $120+ · Custom export crating included',
        '2026 Jingdezhen & Longquan Kiln Batch · Signed bilingual provenance card with every piece',
        'Paulownia keepsake gift wrapping available in your shopping bag for $8',
      ],
    },
    hero: {
      carouselAria: 'Featured Chinese Souvenir Collections',
      prevAria: 'Previous featured craft',
      nextAria: 'Next featured craft',
      tablistAria: 'Choose featured souvenir slide',
      inspectPiece: 'Inspect Piece',
      slides: {
        'slide-porcelain': {
          kicker: 'Jingdezhen Kiln · Batch 2026',
          headlineLine1: 'ARTISAN',
          headlineLine2: 'PORCELAIN',
          description:
            'Hand-thrown kaolin clay jars painted with cobalt mountain brushwork and wood-fired at 1,320°C for lasting tea preservation.',
          ctaLabel: 'Shop Porcelain',
        },
        'slide-celadon': {
          kicker: 'Longquan Zhejiang · Song Glaze',
          headlineLine1: 'CELADON',
          headlineLine2: 'TEA WARE',
          description:
            'Pine-ash glazed gongfu teapots and tasting cups finished in translucent plum-green jade luster for unhurried tea ceremonies.',
          ctaLabel: 'Shop Tea Ware',
        },
        'slide-lacquer': {
          kicker: 'Beijing Guild · 60 Lacquer Coats',
          headlineLine1: 'CARVED',
          headlineLine2: 'CINNABAR',
          description:
            'Three months of cured natural urushi tree lacquer hand-sculpted into blooming floral peony keepsake boxes.',
          ctaLabel: 'Shop Lacquer & Jade',
        },
        'slide-silk': {
          kicker: 'Suzhou & Hotan · Heritage Gift Editions',
          headlineLine1: 'SILK &',
          headlineLine2: 'NEPHRITE',
          description:
            'Grade 6A mulberry silk scarves paired with satin-polished Hetian jade medallions, packed in breathable paulownia cases.',
          ctaLabel: 'Shop Silk & Paper',
        },
      },
    },
    catalog: {
      eyebrow: 'Curated Souvenirs',
      heading: 'Selected Artisanal Artifacts',
      subtitlePrefix:
        'Hand-selected keepsakes from Jingdezhen, Longquan, Beijing, and Suzhou—packed with signed bilingual provenance (',
      artifactSingular: 'artifact',
      artifactPlural: 'artifacts',
      subtitleSuffix: ' shown).',
      categoryGroupAria: 'Filter souvenirs by category',
      saved: 'Saved',
      searchLabel: 'Search souvenirs',
      searchPlaceholder: 'Search craft, city, or material',
      clearSearchAria: 'Clear search query',
      sortLabel: 'Sort souvenirs',
      sortFeatured: 'Sort: Featured',
      sortPriceAsc: 'Price: Low to High',
      sortPriceDesc: 'Price: High to Low',
      priceRangeLabel: 'Price range',
      priceGroupAria: 'Filter souvenirs by price range',
      allPrices: 'All Prices',
      underPrefix: 'Under',
      overPrefix: 'Over',
      upToPrefix: 'Up to',
      maxPriceLabel: 'Max price',
      emptyTitle: 'No matching souvenirs found',
      emptyDescription:
        'Try broadening your search terms or clearing the active craft category filter.',
      resetFilters: 'Reset Filters',
      outOfStock: 'Out of Stock',
      compare: 'Compare',
      comparing: 'Comparing',
      details: 'Details',
      addToBag: 'Add to Bag',
      quickBuy: 'Quick Buy',
      quickLook: 'Quick Look',
      notifyMe: 'Notify Me',
      alertSet: 'Alert Set',
      badgeBestSeller: 'Best Seller',
      badgeNewArrival: 'New Arrival',
      badgeLowStock: 'Low Stock',
    },
    recommendations: {
      eyebrow: 'Tailored Selections',
      heading: 'Recommended for You',
      curatedSubtitle:
        'Curated workshop highlights chosen to complement classic porcelain, tea, and lacquer collections.',
      personalizedPrefix: 'Inspired by your interest in',
      personalizedSuffix: 'and complementary regional workshops.',
      viewPiece: 'Details',
      quickBuy: 'Quick Buy',
      quickLook: 'Quick Look',
      notifyMe: 'Notify Me',
      alertSet: 'Alert Set',
      outOfStock: 'Out of Stock',
    },
    craftsmanship: {
      eyebrow: 'Regional Provenance',
      heading: 'Crafted Where the Tradition Originated',
      subtitle:
        'Rather than stocking mass-produced market replicas, every keepsake is sourced directly from regional workshops known for that specific craft.',
      stories: {
        jingdezhen: {
          region: 'Jingdezhen & Longquan',
          craft: 'Porcelain & Wood-Ash Kilns',
          summary:
            'Over a millennium of kaolin clay mastery and dragon-kiln firing techniques yield translucent cobalt vessels and jade-toned celadon.',
          provenanceDetail: 'Every ceramic base bears the workshop chop mark and batch firing date.',
        },
        'suzhou-fuzhou': {
          region: 'Suzhou & Huzhou',
          craft: 'Mulberry Silk & Scholar Goods',
          summary:
            'Fine Lake Tai silk threads and hand-bound wolf-and-goat calligraphy brushes crafted by fourth-generation family ateliers.',
          provenanceDetail: 'Packed in breathable paulownia wood cases suited for long-term keeping.',
        },
        'beijing-yangzhou': {
          region: 'Beijing & Yangzhou',
          craft: 'Carved Lacquer & Nephrite Jade',
          summary:
            'Dozens of cured natural lacquer coats and slow water-wheel jade sculpting transform raw earth materials into heirloom keepsakes.',
          provenanceDetail: 'Includes bilingual English–Chinese provenance cards for gifting.',
        },
      },
      notesHeading: 'Recent Collector Notes',
      notesSubheading: 'Verified international shipments · Double-boxed protective crating',
      notes: {
        'note-1': {
          location: 'London, UK',
          purchasedItem: 'Longquan Jade-Glaze Gongfu Set',
          quote:
            'Brought home the warmth of our Hangzhou tea house visits—the glaze pooling along the rim catches morning light and arrived double-boxed with zero marks.',
        },
        'note-2': {
          location: 'San Francisco, USA',
          purchasedItem: 'Carved Cinnabar Peony Box',
          quote:
            'Purchased as an anniversary gift for my parents. The depth of the carved petals and the subtle natural lacquer scent immediately set it apart from tourist market pieces.',
        },
      },
    },
    newsletter: {
      eyebrow: 'Kiln & Atelier Dispatch',
      heading: 'Seasonal Updates & Artisan Stories',
      description:
        'Join our collector letter for seasonal kiln firings, tea ware releases, and behind-the-scenes artisan stories from regional master workshops.',
      seasonalHighlight: 'Seasonal firing dates & limited batch previews',
      storiesHighlight: 'Profiles of Jingdezhen, Longquan & Suzhou artisans',
      emailLabel: 'Email address for seasonal dispatches',
      emailPlaceholder: 'collector@example.com',
      subscribeButton: 'Subscribe',
      subscribedPrefix: 'Subscribed',
      confirmationNote:
        'Welcome—seasonal kiln updates and artisan workshop stories will arrive in your inbox.',
      changeButton: 'Change email',
      privacyNote: 'Dispatched quarterly · Unsubscribe anytime.',
      emptyEmailError: 'Please enter your email address.',
      invalidEmailError: 'Please enter a valid email address (e.g. collector@example.com).',
    },
    footer: {
      brandSummary:
        'Independent museum-grade souvenir gallery bridging regional Chinese craft workshops with international collectors.',
      shippingHeading: 'Shipping & Packaging',
      shippingDescription:
        'Complimentary tracked express delivery on orders of $120 or more; $15 flat worldwide below $120. Ceramics ship in custom double-walled export crating.',
      navigationHeading: 'Navigation',
      navCollection: 'Souvenir Collection',
      navWorkshops: 'Regional Workshops',
      navCollectors: 'Collector Notes',
      navTrackOrder: 'Track Order',
      orderLookupHeading: 'Order Status Lookup',
      orderLookupDescription:
        'Check processing, export customs, and delivery updates with your receipt reference.',
      orderNumberLabel: 'Order number',
      orderNumberPlaceholder: 'e.g. YS-2088',
      lookUpButton: 'Look Up',
      samplesPrefix: 'Samples:',
      copyright: '© 2026 Yunshan Curio. Authentic regional crafts from China.',
      guarantee: '30-day undamaged craft return guarantee · Bilingual provenance included',
      emptyOrderError: 'Please enter an order number (e.g. YS-2088).',
    },
    pdp: {
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      closeAria: 'Close product details',
      workshop: 'Workshop',
      materials: 'Materials',
      dimensions: 'Dimensions',
      reviewSingular: 'review',
      reviewPlural: 'reviews',
      selectEdition: 'Select Edition',
      included: 'Included',
      decreaseQtyAria: 'Decrease quantity',
      increaseQtyAria: 'Increase quantity',
      selectedQtyAria: 'Selected quantity',
      addToBag: 'Add to Bag',
      restockAlertSet: 'Restock Alert Set',
      notifyWhenAvailable: 'Notify Me When Available',
      provenanceGuarantee: 'Includes signed bilingual provenance card & shock-resistant packaging.',
      reviewsHeading: 'Customer Reviews',
      reviewsSubtitle: 'Verified collector feedback on craftsmanship, finish, and export packaging.',
      noReviews: 'No customer reviews yet for this piece.',
      relatedHeading: 'You might also like',
      relatedSubtitleSuffix: 'and complementary regional workshop pieces.',
      share: 'Share',
      shareAria: 'Share this artifact',
      sharedFeedback: 'Shared',
      linkCopiedFeedback: 'Link Copied',
      hoverToZoom: 'Hover to zoom',
      writeReviewTitle: 'Share Your Feedback',
      ratingLabel: 'Your Rating',
      starAriaSuffix: 'stars',
      authorLabel: 'Your Name',
      authorPlaceholder: 'e.g. Mei Lin',
      locationLabel: 'City / Region (Optional)',
      locationPlaceholder: 'e.g. Kyoto, Japan',
      commentLabel: 'Your Review',
      commentPlaceholder: 'Share impressions of the craftsmanship, glaze, or packaging...',
      submitReview: 'Submit Review',
      reviewSubmitted: 'Thank you — your review has been added.',
      authorError: 'Please enter your name (at least 2 characters).',
      commentError: 'Please write at least 5 characters of feedback.',
      verifiedCollector: 'Collector',
    },
    wishlist: {
      dialogAria: 'Saved Wishlist',
      title: 'Saved Wishlist',
      closeAria: 'Close wishlist',
      emptyTitle: 'No saved artifacts yet',
      emptyDescription:
        'Tap the heart icon on any souvenir card or detail view to keep your favorite pieces handy.',
      browseCollection: 'Browse Collection',
      outOfStock: 'Out of Stock',
      addToBag: 'Add to Bag',
      notifyMe: 'Notify Me',
      alertSet: 'Alert Set',
      remove: 'Remove',
      clearAll: 'Clear All',
      moveInStockPrefix: 'Move In-Stock to Bag',
      noInStockItems: 'No In-Stock Items to Move',
    },
    cart: {
      dialogAria: 'Shopping Bag and Checkout',
      backToBagAria: 'Back to shopping bag',
      closeAria: 'Close shopping bag',
      bagTitle: 'Collector Bag',
      checkoutTitle: 'Shipping & Payment',
      receiptTitle: 'Order Receipt',
      orderConfirmedTag: 'Order Confirmed',
      orderConfirmedHeadingPrefix: 'Order #',
      orderConfirmedHeadingSuffix: ' Confirmed — Preparing Shipment',
      receiptPreparedFor: 'A provenance receipt has been prepared for',
      deliveryDetails: 'Delivery Details',
      paymentLabel: 'Payment',
      paymentCod: 'Cash on Delivery (COD)',
      paymentCard: 'Credit / Debit Card',
      giftCardNoteLabel: 'Gift Card Note',
      itemizedReceipt: 'Itemized Receipt',
      qtyLabel: 'Qty',
      subtotal: 'Subtotal',
      giftWrap: 'Paulownia Gift Wrap',
      expressShipping: 'Express Shipping',
      complimentary: 'Complimentary',
      totalPaidDue: 'Total Paid / Due',
      emptyTitle: 'Your collector bag is empty',
      emptyDescription:
        'Explore hand-thrown Jingdezhen porcelain, Longquan celadon, and carved lacquer keepsakes.',
      browseCollection: 'Browse Collection',
      freeShippingUnlockedPrefix: 'Complimentary express international shipping unlocked (orders',
      freeShippingRemainingPrefix: 'Add',
      freeShippingRemainingMid: 'more for complimentary express shipping (free at',
      remove: 'Remove',
      giftWrapTitle: 'Paulownia Gift Wrapping & Wax Seal Card',
      giftWrapDescription: 'Hand-tied mulberry paper wrap with traditional cinnabar stamp card.',
      itemsCountSingular: 'item',
      itemsCountPlural: 'items',
      expressDelivery: 'Express delivery',
      totalLabel: 'Total:',
      fullName: 'Full Name',
      fullNamePlaceholder: 'e.g. Lin Wei',
      emailAddress: 'Email Address',
      phoneNumber: 'Phone Number',
      streetAddress: 'Street Address',
      city: 'City',
      postalCode: 'Postal / ZIP Code',
      paymentMethod: 'Payment Method',
      cardInvoiceLink: 'Card Invoice Link',
      cashOnDelivery: 'Cash on Delivery',
      optionalGiftNote: 'Optional Gift Note',
      giftNotePlaceholder: 'Handwritten message for your recipient...',
      continueExploring: 'Continue Exploring',
      total: 'Total',
      proceedToCheckout: 'Proceed to Checkout',
      placeOrder: 'Place Order',
      loyaltyEstimatedPrefix: 'Estimated Loyalty Points:',
      loyaltyRedeemNote: 'Redeemable at checkout',
    },
    compare: {
      title: 'Compare Artisanal Pieces',
      subtitlePrefix: 'Side-by-side craftsmanship, origin, and specifications',
      subtitleSuffix: 'selected',
      clearAll: 'Clear All',
      closeAria: 'Close comparison',
      emptyTitle: 'No souvenirs selected to compare',
      emptyDescription:
        'Select up to three pieces from the collection to view their materials, regional workshops, and dimensions side by side.',
      returnToCollection: 'Return to Collection',
      tableAria: 'Technical souvenir comparison',
      artifactSpec: 'Artifact & Specification',
      remove: 'Remove',
      price: 'Price',
      originRegion: 'Origin Region',
      workshopKiln: 'Workshop / Kiln',
      materialsCraft: 'Materials & Craft',
      dimensionsCapacity: 'Dimensions & Capacity',
      collectorRating: 'Collector Rating',
      noReviewsYet: 'No reviews yet',
      availableEditions: 'Available Editions',
      standard: 'Standard',
      provenanceNote: 'Provenance Note',
      defaultProvenanceNote: 'Signed bilingual provenance card',
      bilingualCardSuffix: 'Bilingual provenance card',
      availability: 'Availability',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      action: 'Action',
      addToBag: 'Add to Bag',
      notifyMe: 'Notify Me',
      alertSet: 'Alert Set',
      tipOneSelected:
        'Tip: Select one or two more souvenirs from the collection to compare specifications side by side.',
    },
    orderLookup: {
      title: 'Order Status Lookup',
      subtitle: 'Track workshop crating, export customs, and courier delivery',
      closeAria: 'Close order status lookup',
      orderNumberLabel: 'Order Number',
      placeholder: 'Enter order number (e.g. YS-2088)',
      checkStatus: 'Check Status',
      recentAndSamples: 'Your recent orders & sample shipments:',
      samplePrompt: 'Try a sample confirmed order:',
      recentOrderTag: 'Recent Order',
      confirmedPlacedPrefix: 'Confirmed Order · Placed',
      orderHeadingPrefix: 'Order',
      dispatchUpdate: 'Dispatch & Courier Update',
      recipientDestination: 'Recipient & Destination',
      milestonesHeading: 'Fulfillment Milestones',
      itemsInOrder: 'Items in This Order',
      qtyLabel: 'Qty',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      complimentary: 'Complimentary',
      giftWrap: 'Gift Wrap',
      total: 'Total',
      idleTitle: 'Enter your receipt order number above',
      idleDescription:
        'Every order placed at checkout generates a tracked YS-XXXX reference. You can also select one of the sample shipments above to preview Processing, Shipped, and Delivered milestones.',
    },
    orderTracking: {
      title: 'Order Tracking',
      subtitle: 'Verify your email and order number for shipping status and estimated delivery date',
      closeAria: 'Close order tracking modal',
      emailLabel: 'Email Address',
      emailPlaceholder: 'e.g. claire.vance@example.com',
      orderNumberLabel: 'Order Number',
      orderNumberPlaceholder: 'e.g. YS-2088',
      submitButton: 'Track Shipment',
      quickFillRecent: 'Your recent orders & verified sample shipments:',
      quickFillSample: 'Try a sample order with its matching email:',
      shippingStatusLabel: 'Estimated Shipping Status',
      estimatedDeliveryLabel: 'Estimated Delivery Date',
      placedPrefix: 'Ordered',
      orderHeadingPrefix: 'Order',
      recipientLabel: 'Destination',
      milestonesHeading: 'Shipping Milestones',
      itemsInOrder: 'Items in Shipment',
      qtyLabel: 'Qty',
      total: 'Order Total',
      idleTitle: 'Track your Yunshan Curio shipment',
      idleDescription:
        'Enter the email address used at checkout along with your YS-XXXX order number above, or choose a sample shipment to preview live status and estimated delivery dates.',
      emptyEmailError: 'Please enter the email address used for your order.',
      invalidEmailError: 'Please enter a valid email address (e.g. claire.vance@example.com).',
      emptyOrderError: 'Please enter your order number (e.g. YS-2088).',
      notFoundError:
        'No shipment matched that email and order number combination. Verify both fields and try again.',
    },
    notifyModal: {
      title: 'Restock Alert',
      closeAria: 'Close restock notification modal',
      outOfStockPrefix: 'Currently Out of Stock',
      activePrefix: 'Restock notification active for',
      activeDescriptionPrefix: 'We will send a single email as soon as',
      activeDescriptionMid: 'returns from',
      updateEmail: 'Update Email',
      done: 'Done',
      formPromptPrefix:
        'Leave your email address below and we will notify you first when the next kiln or workshop batch of',
      formPromptSuffix: 'is ready.',
      emailLabel: 'Email Address',
      cancel: 'Cancel',
      notifyMe: 'Notify Me',
    },
    quickLook: {
      closeAria: 'Close quick look preview',
      eyebrow: 'Quick Look',
      workshop: 'Workshop',
      dimensions: 'Dimensions',
      edition: 'Edition',
      addToBag: 'Quick Buy',
      notifyMe: 'Notify Me',
      alertSet: 'Alert Set',
      viewFullDetails: 'Full Details',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
    },
    scrollTop: {
      ariaLabel: 'Scroll to top',
    },
    appNotices: {
      addedToBagPrefix: 'Added',
      addedToBagSuffix: 'to bag',
      compareLimitPrefix: 'Up to',
      compareLimitSuffix: 'souvenirs can be compared side by side—remove one first.',
      compareTrayAria: 'Product comparison tray',
      compareLabel: 'Compare',
      clear: 'Clear',
      selectOneMore: 'Select 1 more',
      compareNow: 'Compare Now',
      viewBag: 'View Bag',
    },
    categories: {
      All: 'All',
      Porcelain: 'Porcelain',
      'Tea Ware': 'Tea Ware',
      'Lacquer & Jade': 'Lacquer & Jade',
      'Silk & Paper': 'Silk & Paper',
    },
    statuses: {
      Processing: 'Processing',
      Shipped: 'Shipped',
      Delivered: 'Delivered',
    },
  },
  'zh-CN': {
    brand: {
      wordmark: '云山礼器',
      fullTitle: '云山礼器 · Yunshan Curio',
    },
    header: {
      primaryNavAria: '主导航',
      mobileNavAria: '移动端导航',
      collection: '精选藏品',
      wishlist: '心愿单',
      regions: '产地工艺',
      collectors: '藏家寄语',
      shipping: '配送包装',
      orderTracking: '订单追踪',
      bag: '购物袋',
      currencyAria: '选择货币',
      languageGroupAria: '选择语言',
      switchToEnglishAria: '切换语言为英文',
      switchToChineseAria: '切换语言为简体中文',
      openMenuAria: '打开导航菜单',
      closeMenuAria: '关闭导航菜单',
      openBagAria: '打开购物袋',
      openWishlistAria: '打开心愿单',
      loyaltyLabel: '藏家积分',
      pointsUnit: '积分',
      loyaltyAria: '根据当前购物袋总额估算的积分',
      loyaltyTitle: '藏家礼赏积分',
      loyaltyEstimateLabel: '按当前购物袋总额估算',
      loyaltyRateNote: '每消费 $1 美元等值金额可累计 2 积分。',
      loyaltyRedeemNote: '积分可在结账时直接抵扣礼器订单金额。',
      loyaltyEmptyHint: '添加心仪礼器至购物袋，即可实时查看预计可获积分。',
      loyaltyOpenBag: '查看购物袋与结算',
    },
    announcements: {
      regionAria: '商城公告',
      dismissAria: '关闭公告栏',
      messages: [
        '满 $120 享全球追踪特快包邮 · 标配防震出口木箱护送',
        '2026 景德镇与龙泉窑新批礼器上新 · 每件附中英双语匠作溯源卡',
        '购物袋内可选配梧桐木锦盒与火漆礼卡包装（仅需 $8）',
      ],
    },
    hero: {
      carouselAria: '精选中国非遗礼器推荐',
      prevAria: '上一件精选工艺品',
      nextAria: '下一件精选工艺品',
      tablistAria: '选择精选轮播幻灯片',
      inspectPiece: '鉴赏器物',
      slides: {
        'slide-porcelain': {
          kicker: '景德镇窑口 · 2026 批次',
          headlineLine1: '匠心手绘',
          headlineLine2: '青花瓷器',
          description:
            '景德镇高岭土手工拉坯，天然青花料绘就山水意境，经 1,320°C 柴窑煅烧，气密盖口锁住茗茶幽香。',
          ctaLabel: '选购瓷器',
        },
        'slide-celadon': {
          kicker: '浙江龙泉 · 宋韵青釉',
          headlineLine1: '龙泉梅青',
          headlineLine2: '工夫茶具',
          description:
            '松木灰天然釉料高温烧制，呈梅子青透润玉泽，一壶两盏，伴您从容雅叙茶席时光。',
          ctaLabel: '选购茶器',
        },
        'slide-lacquer': {
          kicker: '北京雕漆工坊 · 六十道大漆',
          headlineLine1: '剔红雕漆',
          headlineLine2: '牡丹珍盒',
          description:
            '历时三月反复髹涂天然生漆与朱砂矿物颜料，待漆胎凝厚后由匠人手工雕刻盛放牡丹浮雕。',
          ctaLabel: '选购漆器玉雕',
        },
        'slide-silk': {
          kicker: '苏州与和田 · 传世雅礼',
          headlineLine1: '苏绣桑蚕',
          headlineLine2: '和田玉佩',
          description:
            '精选 6A 级 19 姆米桑蚕丝配细密苏绣，礼搭温润和田青白玉平安扣，皆配透气梧桐木礼盒。',
          ctaLabel: '选购丝绸文房',
        },
      },
    },
    catalog: {
      eyebrow: '匠心甄选礼器',
      heading: '中国传统工艺礼器馆',
      subtitlePrefix:
        '直采自景德镇、龙泉、北京及苏州传统手作工坊，均附带署名中英双语溯源卡（当前展示 ',
      artifactSingular: '件器物',
      artifactPlural: '件器物',
      subtitleSuffix: '）。',
      categoryGroupAria: '按工艺类别筛选',
      saved: '已收藏',
      searchLabel: '搜索纪念品与工艺品',
      searchPlaceholder: '搜索器物名称、产地或材质',
      clearSearchAria: '清除搜索关键词',
      sortLabel: '排序方式',
      sortFeatured: '排序：精选推荐',
      sortPriceAsc: '价格：从低到高',
      sortPriceDesc: '价格：从高到低',
      priceRangeLabel: '价格区间',
      priceGroupAria: '按价格区间筛选',
      allPrices: '全部价格',
      underPrefix: '低于',
      overPrefix: '高于',
      upToPrefix: '最高',
      maxPriceLabel: '价格上限',
      emptyTitle: '未找到匹配的礼器',
      emptyDescription: '请尝试更换搜索词或重置当前工艺品类筛选条件。',
      resetFilters: '重置筛选',
      outOfStock: '暂时缺货',
      compare: '对比',
      comparing: '对比中',
      details: '查看详情',
      addToBag: '加入购物袋',
      quickBuy: '快速加购',
      quickLook: '快速预览',
      notifyMe: '到货通知',
      alertSet: '已设提醒',
      badgeBestSeller: '热销臻品',
      badgeNewArrival: '窑口上新',
      badgeLowStock: '库存紧张',
    },
    recommendations: {
      eyebrow: '心意臻选',
      heading: '为您臻选推荐',
      curatedSubtitle: '严选地方传习工坊代表作，展现青花瓷器、工夫茶具与雕漆雅礼。',
      personalizedPrefix: '基于您近期浏览与收藏的',
      personalizedSuffix: '为您匹配同源及风格相谐之作。',
      viewPiece: '查看详情',
      quickBuy: '快速加购',
      quickLook: '快速预览',
      notifyMe: '到货通知',
      alertSet: '已设提醒',
      outOfStock: '暂时缺货',
    },
    craftsmanship: {
      eyebrow: '产地溯源',
      heading: '源自百工原乡的非遗手作',
      subtitle: '拒绝流水线旅游仿品，每件器物皆直接精选自该门类最具代表性的地方传习工坊。',
      stories: {
        jingdezhen: {
          region: '景德镇与龙泉',
          craft: '青花瓷与松灰青瓷窑口',
          summary:
            '千年高岭土制瓷功底与传统龙窑烧造技艺，造就釉质莹润的青花茶罐与梅子青玉感茶器。',
          provenanceDetail: '每件瓷器底足均落有工坊印款与烧制批次日期。',
        },
        'suzhou-fuzhou': {
          region: '苏州与湖州',
          craft: '桑蚕苏绣与文房清供',
          summary:
            '以太湖优质蚕丝织就丝巾，携手四代传承制笔世家打造兼毫书画毛笔与寿山石印章。',
          provenanceDetail: '附透气防潮梧桐木盒，宜于长期珍藏或礼赠。',
        },
        'beijing-yangzhou': {
          region: '北京与扬州',
          craft: '宫廷剔红雕漆与水磨和田玉',
          summary:
            '数十道天然生漆阴干雕刻与慢工水磨琢玉，将珍稀天然矿石木料化为传世典藏礼器。',
          provenanceDetail: '随附中英双语工艺说明卡，方便跨文化礼赠交流。',
        },
      },
      notesHeading: '藏家实收寄语',
      notesSubheading: '全球实寄验证 · 双层加厚出口防震护箱',
      notes: {
        'note-1': {
          location: '英国 · 伦敦',
          purchasedItem: '龙泉青瓷工夫茶具三件套',
          quote:
            '把杭州茶室的温润记忆带回了家——晨光下沿口聚釉如玉，双层箱包装寄达完好无损。',
        },
        'note-2': {
          location: '美国 · 旧金山',
          purchasedItem: '北京雕漆牡丹圆盒',
          quote:
            '作为结婚纪念日礼物送给父母。花瓣雕刻的深邃立体感与淡淡大漆清香，一眼便知绝非市面普通纪念品。',
        },
      },
    },
    newsletter: {
      eyebrow: '窑口与工坊季信',
      heading: '订阅时令上新与匠人故事',
      description:
        '订阅云山礼器藏家通讯，第一时间获知景德镇新窑出炉、季节限定茶器上新，以及地方手工艺人的传习故事。',
      seasonalHighlight: '四时窑口开窑预告与限量新作鉴赏',
      storiesHighlight: '景德镇、龙泉、苏州非遗工坊匠人专访',
      emailLabel: '订阅电子邮箱',
      emailPlaceholder: 'collector@example.com',
      subscribeButton: '立即订阅',
      subscribedPrefix: '已成功订阅',
      confirmationNote: '感谢订阅——时令窑口快讯与匠人手作故事将按季送达您的邮箱。',
      changeButton: '更换邮箱',
      privacyNote: '按季呈递，绝无打扰，可随时取消订阅。',
      emptyEmailError: '请输入您的电子邮箱地址。',
      invalidEmailError: '请输入有效的电子邮箱地址（例如 collector@example.com）。',
    },
    footer: {
      brandSummary: '专注博物馆级中国传统手工艺礼品画廊，连接地方传习工坊与全球东方美学藏家。',
      shippingHeading: '配送与出口包装',
      shippingDescription:
        '订单满 $120 享全球追踪特快免邮；未满 $120 统一运费 $15。瓷器采用定制双层出口级防震打包。',
      navigationHeading: '快速导航',
      navCollection: '精选礼器目录',
      navWorkshops: '地方非遗工坊',
      navCollectors: '藏家实收寄语',
      navTrackOrder: '查询订单状态',
      orderLookupHeading: '订单状态查询',
      orderLookupDescription: '输入订单回执编号，实时查看工坊装箱、海关清关与国际派送进度。',
      orderNumberLabel: '订单编号',
      orderNumberPlaceholder: '例如 YS-2088',
      lookUpButton: '查询',
      samplesPrefix: '示例单号：',
      copyright: '© 2026 云山礼器 Yunshan Curio. 源自中国原乡地道手工艺品。',
      guarantee: '30天无损退换保障 · 随附中英双语匠作溯源卡',
      emptyOrderError: '请输入订单编号（例如 YS-2088）。',
    },
    pdp: {
      inStock: '现货供应',
      outOfStock: '暂时缺货',
      closeAria: '关闭器物详情',
      workshop: '制作工坊',
      materials: '材质工艺',
      dimensions: '规格尺寸',
      reviewSingular: '条评价',
      reviewPlural: '条评价',
      selectEdition: '选择规格版本',
      included: '标准配置',
      decreaseQtyAria: '减少数量',
      increaseQtyAria: '增加数量',
      selectedQtyAria: '已选数量',
      addToBag: '加入购物袋',
      restockAlertSet: '已设置补货通知',
      notifyWhenAvailable: '到货时通知我',
      provenanceGuarantee: '随附署名中英双语溯源卡及定制防震包装。',
      reviewsHeading: '藏家评价',
      reviewsSubtitle: '来自全球已购藏家对工艺质感、釉色及跨国防护包装的真实反馈。',
      noReviews: '该器物暂无藏家评价。',
      relatedHeading: '您可能还喜欢',
      relatedSubtitleSuffix: '及同源传习工坊搭配佳作。',
      share: '分享',
      shareAria: '分享此器物',
      sharedFeedback: '已分享',
      linkCopiedFeedback: '链接已复制',
      hoverToZoom: '悬停放大细节',
      writeReviewTitle: '撰写藏品评价',
      ratingLabel: '评分',
      starAriaSuffix: '星',
      authorLabel: '您的姓名',
      authorPlaceholder: '例如：林梅',
      locationLabel: '所在城市 / 地区（选填）',
      locationPlaceholder: '例如：上海',
      commentLabel: '评价内容',
      commentPlaceholder: '分享您对工艺质感、釉色细节或防护礼盒的体验...',
      submitReview: '提交评价',
      reviewSubmitted: '感谢反馈，您的评价已成功发布。',
      authorError: '请填写您的姓名（至少 2 个字符）。',
      commentError: '请填写至少 5 个字符的评价内容。',
      verifiedCollector: '认证藏家',
    },
    wishlist: {
      dialogAria: '我的心愿单',
      title: '心愿单',
      closeAria: '关闭心愿单',
      emptyTitle: '尚未收藏任何礼器',
      emptyDescription: '点击任意商品卡片或详情页上的爱心图标，即可保存心仪之选。',
      browseCollection: '浏览藏品馆',
      outOfStock: '暂时缺货',
      addToBag: '加入购物袋',
      notifyMe: '到货通知',
      alertSet: '已设提醒',
      remove: '移除',
      clearAll: '清空',
      moveInStockPrefix: '将现货全部移入购物袋',
      noInStockItems: '暂无现货可移入购物袋',
    },
    cart: {
      dialogAria: '购物袋与结算',
      backToBagAria: '返回购物袋',
      closeAria: '关闭购物袋',
      bagTitle: '藏家购物袋',
      checkoutTitle: '收货与支付信息',
      receiptTitle: '订单确认回执',
      orderConfirmedTag: '订单已确认',
      orderConfirmedHeadingPrefix: '订单 #',
      orderConfirmedHeadingSuffix: ' 已确认 — 正在备货',
      receiptPreparedFor: '溯源电子回执已发送至',
      deliveryDetails: '收货详情',
      paymentLabel: '支付方式',
      paymentCod: '货到付款 (COD)',
      paymentCard: '银行卡 / 信用卡',
      giftCardNoteLabel: '礼卡附言',
      itemizedReceipt: '商品清单',
      qtyLabel: '数量',
      subtotal: '商品小计',
      giftWrap: '梧桐木礼盒包装',
      expressShipping: '特快国际配送',
      complimentary: '免费包邮',
      totalPaidDue: '订单总计',
      emptyTitle: '您的购物袋为空',
      emptyDescription: '探索景德镇手绘青花瓷、龙泉青瓷茶器与北京剔红雕漆珍品。',
      browseCollection: '浏览藏品',
      freeShippingUnlockedPrefix: '已解锁全球追踪特快免邮（满',
      freeShippingRemainingPrefix: '再添购',
      freeShippingRemainingMid: '即可享全球特快免邮（免邮门槛',
      remove: '移除',
      giftWrapTitle: '梧桐木礼盒包装与朱砂火漆礼卡',
      giftWrapDescription: '手工桑皮纸扎束，配传统朱砂印泥礼卡。',
      itemsCountSingular: '件商品',
      itemsCountPlural: '件商品',
      expressDelivery: '特快国际配送',
      totalLabel: '总计：',
      fullName: '收件人姓名',
      fullNamePlaceholder: '例如 林薇',
      emailAddress: '电子邮箱',
      phoneNumber: '联系电话',
      streetAddress: '详细街道地址',
      city: '城市',
      postalCode: '邮政编码',
      paymentMethod: '支付方式',
      cardInvoiceLink: '信用卡发票链接',
      cashOnDelivery: '货到付款',
      optionalGiftNote: '礼品卡附言（选填）',
      giftNotePlaceholder: '为收礼人手写一段祝福语...',
      continueExploring: '继续浏览藏品',
      total: '合计',
      proceedToCheckout: '前往结算',
      placeOrder: '确认下单',
      loyaltyEstimatedPrefix: '预计可获藏家积分：',
      loyaltyRedeemNote: '结账时可直接抵扣使用',
    },
    compare: {
      title: '器物参数对比',
      subtitlePrefix: '并排对比工艺细节、产地工坊与规格尺寸（已选',
      subtitleSuffix: '件）',
      clearAll: '全部清空',
      closeAria: '关闭参数对比',
      emptyTitle: '尚未选择对比器物',
      emptyDescription: '在藏品馆中选择最多 3 件器物，即可并排查看材质、产地工坊与尺寸规格对比。',
      returnToCollection: '返回藏品馆',
      tableAria: '手工艺品技术参数对比表',
      artifactSpec: '器物与规格参数',
      remove: '移除',
      price: '价格',
      originRegion: '原产地',
      workshopKiln: '工坊 / 窑口',
      materialsCraft: '材质与工艺',
      dimensionsCapacity: '尺寸与容量',
      collectorRating: '藏家评分',
      noReviewsYet: '暂无评价',
      availableEditions: '可选规格',
      standard: '标准版',
      provenanceNote: '溯源说明',
      defaultProvenanceNote: '附署名中英双语溯源卡',
      bilingualCardSuffix: '中英双语溯源卡',
      availability: '库存状态',
      inStock: '现货供应',
      outOfStock: '暂时缺货',
      action: '操作',
      addToBag: '加入购物袋',
      notifyMe: '到货通知',
      alertSet: '已设提醒',
      tipOneSelected: '提示：可在藏品馆中再选 1 到 2 件器物进行并排参数对比。',
    },
    orderLookup: {
      title: '订单状态查询',
      subtitle: '实时追踪工坊木箱打包、出口清关及国际快递派送动态',
      closeAria: '关闭订单查询',
      orderNumberLabel: '订单编号',
      placeholder: '输入订单编号（例如 YS-2088）',
      checkStatus: '查询状态',
      recentAndSamples: '您的近期订单与示例运单：',
      samplePrompt: '点击示例订单立即体验：',
      recentOrderTag: '近期订单',
      confirmedPlacedPrefix: '已确认订单 · 下单日期',
      orderHeadingPrefix: '订单',
      dispatchUpdate: '发运与快递动态',
      recipientDestination: '收件人与目的地',
      milestonesHeading: '履约物流节点',
      itemsInOrder: '订单内器物',
      qtyLabel: '数量',
      subtotal: '小计',
      shipping: '运费',
      complimentary: '免费包邮',
      giftWrap: '礼盒包装',
      total: '实付总计',
      idleTitle: '请在上方输入订单编号',
      idleDescription:
        '每次结账下单都会生成可追踪的 YS-XXXX 编号。您也可点击上方示例单号查看「备货处理」「已发货」与「已送达」节点状态。',
    },
    orderTracking: {
      title: '订单物流追踪',
      subtitle: '输入下单电子邮箱与订单编号，实时查看预计发货状态与送达日期',
      closeAria: '关闭订单物流追踪弹窗',
      emailLabel: '电子邮箱',
      emailPlaceholder: '例如 claire.vance@example.com',
      orderNumberLabel: '订单编号',
      orderNumberPlaceholder: '例如 YS-2088',
      submitButton: '立即追踪',
      quickFillRecent: '您的近期订单与示例物流单号：',
      quickFillSample: '快捷体验示例订单（自动填入对应邮箱与单号）：',
      shippingStatusLabel: '当前物流状态',
      estimatedDeliveryLabel: '预计送达日期',
      placedPrefix: '下单日期',
      orderHeadingPrefix: '订单',
      recipientLabel: '收件目的地',
      milestonesHeading: '物流履约节点',
      itemsInOrder: '包裹内藏品清单',
      qtyLabel: '数量',
      total: '订单总计',
      idleTitle: '追踪您的云山礼器包裹',
      idleDescription:
        '请在上方输入结账时使用的电子邮箱及 YS-XXXX 订单编号，或点击上方示例订单快速预览物流状态与预计送达日期。',
      emptyEmailError: '请输入下单时使用的电子邮箱地址。',
      invalidEmailError: '请输入有效的电子邮箱地址（例如 claire.vance@example.com）。',
      emptyOrderError: '请输入订单编号（例如 YS-2088）。',
      notFoundError: '未找到与该邮箱和订单编号匹配的物流记录，请核对后重试。',
    },
    notifyModal: {
      title: '缺货补货通知',
      closeAria: '关闭补货通知弹窗',
      outOfStockPrefix: '当前缺货',
      activePrefix: '已为您登记补货邮件通知：',
      activeDescriptionPrefix: '一旦',
      activeDescriptionMid: '的新批次从工坊送达，我们将第一时间发送提醒邮件，来源：',
      updateEmail: '更换邮箱',
      done: '完成',
      formPromptPrefix: '留下您的电子邮箱，待下一窑/新批次的',
      formPromptSuffix: '出品就绪后，我们将优先通知您。',
      emailLabel: '电子邮箱',
      cancel: '取消',
      notifyMe: '到货通知我',
    },
    quickLook: {
      closeAria: '关闭快速预览',
      eyebrow: '快速预览',
      workshop: '工坊',
      dimensions: '尺寸',
      edition: '规格版本',
      addToBag: '快速加购',
      notifyMe: '到货通知',
      alertSet: '已设提醒',
      viewFullDetails: '完整详情',
      inStock: '现货供应',
      outOfStock: '暂时缺货',
    },
    scrollTop: {
      ariaLabel: '回到顶部',
    },
    breadcrumb: {
      navAria: '面包屑导航',
      home: '首页',
      catalog: '典藏目录',
      saved: '已收藏',
      showingPrefix: '共显示',
      showingSingular: '件器物',
      showingPlural: '件器物',
    },
    promo: {
      regionAria: '限时季节礼遇活动',
      badge: '限时特惠',
      title: '秋窑茶器雅集季末礼遇',
      description: '本季窑口封窑前下单，尊享梧桐木礼盒臻装与双倍藏家积分礼赏。',
      endsIn: '距结束还剩',
      expired: '本季限时礼遇已结束',
      days: '天',
      hours: '时',
      minutes: '分',
      seconds: '秒',
      daysFull: '天',
      hoursFull: '时',
      minutesFull: '分',
      secondsFull: '秒',
    },
    appNotices: {
      addedToBagPrefix: '已将',
      addedToBagSuffix: '加入购物袋',
      compareLimitPrefix: '最多支持同时对比',
      compareLimitSuffix: '件器物，请先移除其中一件。',
      compareTrayAria: '商品对比浮层',
      compareLabel: '对比',
      clear: '清空',
      selectOneMore: '再选 1 件',
      compareNow: '立即对比',
      viewBag: '查看购物袋',
    },
    categories: {
      All: '全部',
      Porcelain: '瓷器',
      'Tea Ware': '茶具',
      'Lacquer & Jade': '漆器与玉器',
      'Silk & Paper': '丝绸与文房',
    },
    statuses: {
      Processing: '处理备货中',
      Shipped: '已发货',
      Delivered: '已送达',
    },
  },
};

export function getTranslations(language: LanguageCode = 'en'): TranslationDictionary {
  return TRANSLATIONS[language] ?? TRANSLATIONS.en;
}

export function getCategoryLabel(
  category: SouvenirCategory,
  language: LanguageCode = 'en',
): string {
  return getTranslations(language).categories[category] ?? category;
}

export function getOrderStatusLabel(
  status: OrderFulfillmentStatus,
  language: LanguageCode = 'en',
): string {
  return getTranslations(language).statuses[status] ?? status;
}

export function getSortOptionLabel(sortBy: SortOption, language: LanguageCode = 'en'): string {
  const catalog = getTranslations(language).catalog;
  switch (sortBy) {
    case 'price-asc':
      return catalog.sortPriceAsc;
    case 'price-desc':
      return catalog.sortPriceDesc;
    case 'featured':
    default:
      return catalog.sortFeatured;
  }
}

export function getPricePresetLabel(
  preset: Exclude<PriceRangePreset, 'custom'>,
  formatPriceFn: (usd: number, currency: CurrencyCode) => string,
  currency: CurrencyCode,
  language: LanguageCode = 'en',
): string {
  const t = getTranslations(language).catalog;
  switch (preset) {
    case 'under-100':
      return `${t.underPrefix} ${formatPriceFn(100, currency)}`;
    case '100-150':
      return `${formatPriceFn(100, currency)}–${formatPriceFn(150, currency)}`;
    case 'over-150':
      return `${t.overPrefix} ${formatPriceFn(150, currency)}`;
    case 'all':
    default:
      return t.allPrices;
  }
}

export function getProductTitle(
  product: { name: string; chineseTitle: string },
  language: LanguageCode = 'en',
): string {
  return language === 'zh-CN' ? product.chineseTitle : product.name;
}

export function getProductSecondaryTitle(
  product: { name: string; chineseTitle: string },
  language: LanguageCode = 'en',
): string {
  return language === 'zh-CN' ? product.name : product.chineseTitle;
}

export function getProductBadgeLabel(
  badge: ProductBadgeType,
  language: LanguageCode = 'en',
): string {
  const t = getTranslations(language).catalog;
  switch (badge) {
    case 'best-seller':
      return t.badgeBestSeller;
    case 'new-arrival':
      return t.badgeNewArrival;
    case 'low-stock':
      return t.badgeLowStock;
  }
}

