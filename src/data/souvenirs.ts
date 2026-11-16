import type { HeroSlide, SouvenirCategory, SouvenirProduct } from '../types/store';

import heroPorcelainDarkImg from '../assets/images/hero_slide_porcelain_dark_1794754199381.jpg';
import heroCeladonAmberImg from '../assets/images/hero_slide_celadon_amber_1794754200373.jpg';
import heroLacquerCharcoalImg from '../assets/images/hero_slide_lacquer_charcoal_1794754200775.jpg';
import heroSilkCreamImg from '../assets/images/hero_slide_silk_cream_clean_1794754218989.jpg';

import jingdezhenPorcelainImg from '../assets/images/product_jingdezhen_porcelain_1794753161276.jpg';
import celadonTeaSetImg from '../assets/images/product_celadon_tea_set_1794753161904.jpg';
import cinnabarLacquerBoxImg from '../assets/images/product_cinnabar_lacquer_box_1794753162423.jpg';
import suzhouSilkScarfImg from '../assets/images/product_suzhou_silk_scarf_1794753163018.jpg';
import hetianJadePendantImg from '../assets/images/product_hetian_jade_pendant_1794753163257.jpg';
import calligraphySealSetImg from '../assets/images/product_calligraphy_seal_set_1794753164214.jpg';

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-porcelain',
    theme: 'espresso',
    isDark: true,
    kicker: 'Jingdezhen Kiln · Batch 2026',
    headlineLine1: 'ARTISAN',
    headlineLine2: 'PORCELAIN',
    description:
      'Hand-thrown kaolin clay jars painted with cobalt mountain brushwork and wood-fired at 1,320°C for lasting tea preservation.',
    ctaLabel: 'Shop Porcelain',
    ctaCategory: 'Porcelain',
    featuredProductId: 'jingdezhen-mountain-caddy',
    image: heroPorcelainDarkImg,
    imageAlt:
      'Hand-painted Jingdezhen blue-and-white porcelain tea caddy jar illuminated against a dark espresso studio backdrop.',
  },
  {
    id: 'slide-celadon',
    theme: 'amber',
    isDark: true,
    kicker: 'Longquan Zhejiang · Song Glaze',
    headlineLine1: 'CELADON',
    headlineLine2: 'TEA WARE',
    description:
      'Pine-ash glazed gongfu teapots and tasting cups finished in translucent plum-green jade luster for unhurried tea ceremonies.',
    ctaLabel: 'Shop Tea Ware',
    ctaCategory: 'Tea Ware',
    featuredProductId: 'longquan-celadon-gongfu',
    image: heroCeladonAmberImg,
    imageAlt:
      'Longquan pale jade-green celadon teapot and tasting cups on weathered wood against a warm amber backdrop.',
  },
  {
    id: 'slide-lacquer',
    theme: 'charcoal',
    isDark: true,
    kicker: 'Beijing Guild · 60 Lacquer Coats',
    headlineLine1: 'CARVED',
    headlineLine2: 'CINNABAR',
    description:
      'Three months of cured natural urushi tree lacquer hand-sculpted into blooming floral peony keepsake boxes.',
    ctaLabel: 'Shop Lacquer & Jade',
    ctaCategory: 'Lacquer & Jade',
    featuredProductId: 'beijing-cinnabar-box',
    image: heroLacquerCharcoalImg,
    imageAlt:
      'Beijing carved red cinnabar lacquerware peony box spotlighted on a deep charcoal studio surface.',
  },
  {
    id: 'slide-silk',
    theme: 'cream',
    isDark: false,
    kicker: 'Suzhou & Hotan · Heritage Gift Editions',
    headlineLine1: 'SILK &',
    headlineLine2: 'NEPHRITE',
    description:
      'Grade 6A mulberry silk scarves paired with satin-polished Hetian jade medallions, packed in breathable paulownia cases.',
    ctaLabel: 'Shop Silk & Paper',
    ctaCategory: 'Silk & Paper',
    featuredProductId: 'suzhou-silk-crane-scarf',
    image: heroSilkCreamImg,
    imageAlt:
      'Folded ivory Suzhou embroidered silk scarf with a pale Hetian nephrite jade medallion on warm cream stone.',
  },
];

export const CATEGORIES: SouvenirCategory[] = [
  'All',
  'Porcelain',
  'Tea Ware',
  'Lacquer & Jade',
  'Silk & Paper',
];

export const CATEGORY_THUMBNAILS: Record<SouvenirCategory, string> = {
  All: heroSilkCreamImg,
  Porcelain: jingdezhenPorcelainImg,
  'Tea Ware': celadonTeaSetImg,
  'Lacquer & Jade': cinnabarLacquerBoxImg,
  'Silk & Paper': suzhouSilkScarfImg,
};

export const SOUVENIR_PRODUCTS: SouvenirProduct[] = [
  {
    id: 'jingdezhen-mountain-caddy',
    slug: 'jingdezhen-mountain-caddy',
    name: 'Qinghua Mountain Tea Caddy',
    chineseTitle: '景德镇青花山水茶叶罐',
    category: 'Porcelain',
    origin: 'Jingdezhen, Jiangxi',
    workshop: 'Yaoli Old Kiln Studio',
    price: 118,
    image: jingdezhenPorcelainImg,
    imageAlt: 'Hand-painted Jingdezhen blue-and-white cobalt porcelain tea caddy jar with lid on travertine stone.',
    editionNote: 'Signed Kiln Batch',
    badge: 'best-seller',
    shortDescription: 'Hand-thrown kaolin clay jar painted with cobalt landscape brushwork and an airtight fitted lid.',
    story:
      'Thrown on a traditional potter’s wheel in Jingdezhen and fired at 1,320°C, this porcelain tea caddy preserves delicate loose-leaf oolong and white teas while honoring classical Song-inspired mountain ink composition.',
    materials: 'High-fired Jingdezhen kaolin porcelain, natural cobalt mineral pigment',
    dimensions: '14.5 cm height · 11 cm diameter · 650 ml capacity',
    inStock: true,
    featuredRank: 1,
    variants: [
      {
        id: 'cobalt-standard',
        label: 'Classic Tea Caddy (650 ml)',
        note: 'Includes lined brocade storage pouch',
        priceDelta: 0,
      },
      {
        id: 'cobalt-gift-box',
        label: 'Collector Paulownia Box Edition',
        note: 'Includes numbered kiln certificate & tea scoop',
        priceDelta: 24,
      },
    ],
    reviews: [
      {
        id: 'rev-caddy-1',
        author: 'Eleanor Wright',
        location: 'Edinburgh, UK',
        rating: 5,
        date: 'October 14, 2026',
        variantLabel: 'Collector Paulownia Box Edition',
        comment:
          'The cobalt mountain brushwork feels genuinely painted by hand rather than stamped. The fitted porcelain lid seals cleanly enough to keep my roasted Tieguanyin aromatic.',
      },
      {
        id: 'rev-caddy-2',
        author: 'Kenji Takahashi',
        location: 'Kyoto, Japan',
        rating: 5,
        date: 'September 28, 2026',
        variantLabel: 'Classic Tea Caddy (650 ml)',
        comment:
          'Translucent kaolin body with crisp glaze depth around the shoulder. The paulownia presentation and bilingual kiln card made it effortless to gift.',
      },
      {
        id: 'rev-caddy-3',
        author: 'Nadia Al-Mansoor',
        location: 'Chicago, USA',
        rating: 4,
        date: 'August 19, 2026',
        variantLabel: 'Classic Tea Caddy (650 ml)',
        comment:
          'Arrived double-boxed with zero scuffing. Slightly smaller in footprint than I expected on the tea tray, yet comfortably holds a full 150 g tin of oolong.',
      },
    ],
  },
  {
    id: 'longquan-celadon-gongfu',
    slug: 'longquan-celadon-gongfu',
    name: 'Longquan Jade-Glaze Gongfu Set',
    chineseTitle: '龙泉青瓷工夫茶具三件套',
    category: 'Tea Ware',
    origin: 'Longquan, Zhejiang',
    workshop: 'Dayao Celadon Kiln',
    price: 146,
    image: celadonTeaSetImg,
    imageAlt: 'Longquan pale jade-green celadon glazed teapot and two tasting cups on a limestone plinth.',
    editionNote: 'Artisan Reserve',
    badge: 'new-arrival',
    shortDescription: 'Wood-ash glazed gongfu teapot paired with two matching tasting cups in translucent plum-green celadon.',
    story:
      'Crafted using iron-rich mountain clay and multi-layer plant-ash glaze, Longquan celadon achieves a warm jade luster prized by tea masters since the Southern Song dynasty.',
    materials: 'Longquan stoneware clay, natural pine-ash celadon glaze, braided cotton lid cord',
    dimensions: 'Teapot 180 ml · Two cups 45 ml each',
    inStock: true,
    featuredRank: 2,
    variants: [
      {
        id: 'plum-green-3pc',
        label: 'Teapot + 2 Tasting Cups',
        note: 'Balanced for 1–2 guests',
        priceDelta: 0,
      },
      {
        id: 'plum-green-5pc',
        label: 'Teapot + 4 Tasting Cups',
        note: 'Complete ceremonial host set',
        priceDelta: 38,
      },
    ],
    reviews: [
      {
        id: 'rev-celadon-1',
        author: 'Claire Vance',
        location: 'London, UK',
        rating: 5,
        date: 'October 22, 2026',
        variantLabel: 'Teapot + 2 Tasting Cups',
        comment:
          'Warm plum-green glaze pools softly along the rim in morning sunlight. The spout cuts off cleanly with no dripping during gongfu pours.',
      },
      {
        id: 'rev-celadon-2',
        author: 'Daniel Park',
        location: 'Seoul, South Korea',
        rating: 5,
        date: 'October 3, 2026',
        variantLabel: 'Teapot + 4 Tasting Cups',
        comment:
          'Upgraded to the 4-cup host edition for weekend tea gatherings. The clay wall retains warmth without making the handle uncomfortable to hold.',
      },
      {
        id: 'rev-celadon-3',
        author: 'Sophie Laurent',
        location: 'Lyon, France',
        rating: 4,
        date: 'September 11, 2026',
        variantLabel: 'Teapot + 2 Tasting Cups',
        comment:
          'Authentic Song-style glaze tone and lovely braided lid cord. Note that 180 ml is tailored for concentrated gongfu infusions rather than mug brewing.',
      },
    ],
  },
  {
    id: 'beijing-cinnabar-box',
    slug: 'beijing-cinnabar-box',
    name: 'Carved Cinnabar Peony Box',
    chineseTitle: '北京雕漆牡丹圆盒',
    category: 'Lacquer & Jade',
    origin: 'Beijing',
    workshop: 'Yanjing Lacquer Guild',
    price: 185,
    image: cinnabarLacquerBoxImg,
    imageAlt: 'Round Beijing carved red cinnabar lacquerware keepsake box with floral peony relief.',
    editionNote: 'Limited Run',
    badge: 'low-stock',
    shortDescription: 'Over sixty hand-brushed layers of natural tree-sap lacquer carved in deep floral peony relief.',
    story:
      'Each keepsake box requires three months of patient lacquer layering and drying in humidity-controlled chambers before master carvers sculpt the blooming peony relief by hand.',
    materials: 'Natural urushi tree lacquer, mineral cinnabar pigment, black silk-lined interior',
    dimensions: '12 cm diameter · 6.5 cm height',
    inStock: true,
    featuredRank: 3,
    variants: [
      {
        id: 'peony-12cm',
        label: 'Medium Round (12 cm)',
        note: 'Ideal for rings, watches, or tea seals',
        priceDelta: 0,
      },
      {
        id: 'peony-16cm',
        label: 'Gallery Round (16 cm)',
        note: 'Deeper double-tier carving with velvet tray',
        priceDelta: 55,
      },
    ],
    reviews: [
      {
        id: 'rev-cinnabar-1',
        author: 'David Chen',
        location: 'San Francisco, USA',
        rating: 5,
        date: 'October 18, 2026',
        variantLabel: 'Gallery Round (16 cm)',
        comment:
          'Purchased as an anniversary gift for my parents. The depth of the carved peony petals and subtle natural lacquer scent set it far apart from tourist market pieces.',
      },
      {
        id: 'rev-cinnabar-2',
        author: 'Miriam Hoffman',
        location: 'Zurich, Switzerland',
        rating: 5,
        date: 'September 29, 2026',
        variantLabel: 'Medium Round (12 cm)',
        comment:
          'Substantial weight and crisp undercutting across every leaf and scroll. Holds two heirloom watches neatly inside the black silk lining.',
      },
      {
        id: 'rev-cinnabar-3',
        author: 'Arthur Morales',
        location: 'Melbourne, Australia',
        rating: 5,
        date: 'August 25, 2026',
        variantLabel: 'Medium Round (12 cm)',
        comment:
          'Deep vermilion red shifts beautifully depending on room light. The lid seats smoothly with zero rattle.',
      },
    ],
  },
  {
    id: 'suzhou-silk-crane-scarf',
    slug: 'suzhou-silk-crane-scarf',
    name: 'Suzhou Embroidered Silk Scarf',
    chineseTitle: '苏绣桑蚕丝竹鹤围巾',
    category: 'Silk & Paper',
    origin: 'Suzhou, Jiangsu',
    workshop: 'Gusu Silk Atelier',
    price: 132,
    image: suzhouSilkScarfImg,
    imageAlt: 'Folded ivory Suzhou mulberry silk scarf with hand-embroidered ink bamboo and cranes next to a wooden gift box.',
    badge: 'best-seller',
    shortDescription: '19-momme Grade 6A mulberry silk finished with delicate hand-stitched bamboo and crane motifs.',
    story:
      'Woven from long-strand Lake Tai mulberry silk and accented by Suzhou needleworkers using split silk threads finer than a human hair, presented in a hinged cedarwood keepsake case.',
    materials: '100% Grade 6A mulberry silk, hand-rolled hem, paulownia presentation box',
    dimensions: '180 cm × 52 cm',
    inStock: true,
    featuredRank: 4,
    variants: [
      {
        id: 'ivory-crane',
        label: 'Warm Ivory · Ink Crane',
        note: 'Presented in hinged wood box',
        priceDelta: 0,
      },
      {
        id: 'mist-lotus',
        label: 'Warm Ivory · Mist Bamboo',
        note: 'Presented in hinged wood box',
        priceDelta: 0,
      },
    ],
    reviews: [
      {
        id: 'rev-silk-1',
        author: 'Beatrice Wong',
        location: 'Vancouver, Canada',
        rating: 5,
        date: 'October 19, 2026',
        variantLabel: 'Warm Ivory · Ink Crane',
        comment:
          '19-momme silk drapes with quiet luster and zero stiffness. Looking closely at the cranes, you can trace the fine split-silk stitches along the wingtips.',
      },
      {
        id: 'rev-silk-2',
        author: 'Elena Rostova',
        location: 'Vienna, Austria',
        rating: 4,
        date: 'September 16, 2026',
        variantLabel: 'Warm Ivory · Mist Bamboo',
        comment:
          'The cedarwood keepsake box smells subtle and dry-clean care instructions are clear. Ivory tone pairs easily with camel and charcoal coats.',
      },
      {
        id: 'rev-silk-3',
        author: 'Rachel Kim',
        location: 'New York, USA',
        rating: 5,
        date: 'August 30, 2026',
        variantLabel: 'Warm Ivory · Ink Crane',
        comment:
          'Hand-rolled hems are neat and even along the entire 180 cm length. Gifted to my mother and she keeps it stored in the paulownia case.',
      },
    ],
  },
  {
    id: 'hetian-jade-medallion',
    slug: 'hetian-jade-medallion',
    name: 'Hetian Nephrite Cloud Medallion',
    chineseTitle: '和田玉祥云平安扣吊坠',
    category: 'Lacquer & Jade',
    origin: 'Hotan & Yangzhou',
    workshop: 'Guangling Jade Carving Studio',
    price: 220,
    image: hetianJadePendantImg,
    imageAlt: 'Translucent pale Hetian nephrite jade carved medallion pendant on a hand-knotted brown silk cord.',
    editionNote: 'Verified Stone',
    shortDescription: 'Hand-carved auspicious cloud bi-disc pendant in satin-polished pale nephrite on adjustable silk cord.',
    story:
      'Carved in Yangzhou using traditional water-grit wheels, the concentric bi-disc silhouette symbolizes harmony and safe passage, accompanied by an independent mineral authenticity card.',
    materials: 'Natural Hetian nephrite jade, hand-braided mulberry silk cord',
    dimensions: '38 mm diameter · Adjustable 44–68 cm cord',
    inStock: false,
    featuredRank: 5,
    variants: [
      {
        id: 'espresso-cord',
        label: 'Espresso Silk Cord',
        note: 'Includes mineral verification card',
        priceDelta: 0,
      },
      {
        id: 'cinnabar-cord',
        label: 'Cinnabar Red Silk Cord',
        note: 'Includes mineral verification card',
        priceDelta: 8,
      },
    ],
    reviews: [
      {
        id: 'rev-jade-1',
        author: 'Lucas Meyer',
        location: 'Munich, Germany',
        rating: 5,
        date: 'October 25, 2026',
        variantLabel: 'Espresso Silk Cord',
        comment:
          'Mutton-fat pale translucence warms gently against the skin, and the cloud carving along the outer rim is silky smooth with zero sharp edges.',
      },
      {
        id: 'rev-jade-2',
        author: 'Grace Lin',
        location: 'Seattle, USA',
        rating: 5,
        date: 'October 6, 2026',
        variantLabel: 'Cinnabar Red Silk Cord',
        comment:
          'The adjustable braided silk knot slides cleanly without fraying, and the mineral verification card gave us real confidence when gifting.',
      },
      {
        id: 'rev-jade-3',
        author: 'Thomas Reid',
        location: 'Sydney, Australia',
        rating: 4,
        date: 'September 4, 2026',
        variantLabel: 'Espresso Silk Cord',
        comment:
          'Understated sheen rather than glassy shine—exactly what true satin-polished nephrite should look like.',
      },
    ],
  },
  {
    id: 'shoushan-calligraphy-seal',
    slug: 'shoushan-calligraphy-seal',
    name: 'Scholar’s Shoushan Seal & Brush Set',
    chineseTitle: '寿山石印章文房礼盒',
    category: 'Silk & Paper',
    origin: 'Fuzhou & Huzhou',
    workshop: 'Moyang Scholar Studio',
    price: 94,
    image: calligraphySealSetImg,
    imageAlt: 'Carved amber Shoushan stone seal, blue-and-white porcelain cinnabar ink paste dish, and bamboo brush.',
    badge: 'new-arrival',
    shortDescription: 'Hand-carved amber Shoushan stone chop paired with porcelain cinnabar ink paste and a Huzhou writing brush.',
    story:
      'Curated for collectors of stationery and ink painting, this desk set unites Fuzhou soapstone carving with traditional oil-based vermilion seal paste in a cobalt porcelain dish.',
    materials: 'Natural Shoushan stone, Jingdezhen ink dish, rosewood brush with goat-wolf hair',
    dimensions: 'Seal 7.2 cm tall · Ink dish 7.5 cm diameter · Brush 22 cm',
    inStock: true,
    featuredRank: 6,
    variants: [
      {
        id: 'pine-pavilion-blank',
        label: 'Blank Base Seal (Ready to Engrave)',
        note: 'Complete 4-piece desk presentation',
        priceDelta: 0,
      },
      {
        id: 'pine-pavilion-auspicious',
        label: 'Pre-Carved "Peace & Harmony" Seal',
        note: 'Traditional seal-script bottom engraving',
        priceDelta: 18,
      },
    ],
    reviews: [
      {
        id: 'rev-seal-1',
        author: 'Julian Brooks',
        location: 'Boston, USA',
        rating: 5,
        date: 'October 11, 2026',
        variantLabel: 'Pre-Carved "Peace & Harmony" Seal',
        comment:
          'Honey-amber Shoushan stone catches desk lamp light cleanly, and the cobalt ink dish keeps the vermilion paste moist for crisp red seal impressions.',
      },
      {
        id: 'rev-seal-2',
        author: 'Mei-Ling Tan',
        location: 'Singapore',
        rating: 5,
        date: 'September 21, 2026',
        variantLabel: 'Blank Base Seal (Ready to Engrave)',
        comment:
          'Bought the blank base for a calligrapher friend to carve his studio chop. The goat-wolf hair brush holds a sharp tip right after rinsing.',
      },
      {
        id: 'rev-seal-3',
        author: 'Henrik Lindqvist',
        location: 'Stockholm, Sweden',
        rating: 4,
        date: 'August 14, 2026',
        variantLabel: 'Pre-Carved "Peace & Harmony" Seal',
        comment:
          'Lovely desktop presentation with balanced weight on the seal. Took a little practice to press evenly on textured cotton paper, then stamped cleanly.',
      },
    ],
  },
];

export interface RegionalCraftStory {
  id: string;
  region: string;
  craft: string;
  summary: string;
  provenanceDetail: string;
}

export const REGIONAL_CRAFT_STORIES: RegionalCraftStory[] = [
  {
    id: 'jingdezhen',
    region: 'Jingdezhen & Longquan',
    craft: 'Porcelain & Wood-Ash Kilns',
    summary:
      'Over a millennium of kaolin clay mastery and dragon-kiln firing techniques yield translucent cobalt vessels and jade-toned celadon.',
    provenanceDetail: 'Every ceramic base bears the workshop chop mark and batch firing date.',
  },
  {
    id: 'suzhou-fuzhou',
    region: 'Suzhou & Huzhou',
    craft: 'Mulberry Silk & Scholar Goods',
    summary:
      'Fine Lake Tai silk threads and hand-bound wolf-and-goat calligraphy brushes crafted by fourth-generation family ateliers.',
    provenanceDetail: 'Packed in breathable paulownia wood cases suited for long-term keeping.',
  },
  {
    id: 'beijing-yangzhou',
    region: 'Beijing & Yangzhou',
    craft: 'Carved Lacquer & Nephrite Jade',
    summary:
      'Dozens of cured natural lacquer coats and slow water-wheel jade sculpting transform raw earth materials into heirloom keepsakes.',
    provenanceDetail: 'Includes bilingual English–Chinese provenance cards for gifting.',
  },
];

export interface CollectorNote {
  id: string;
  reviewer: string;
  location: string;
  purchasedItem: string;
  quote: string;
}

export const COLLECTOR_NOTES: CollectorNote[] = [
  {
    id: 'note-1',
    reviewer: 'Claire Vance',
    location: 'London, UK',
    purchasedItem: 'Longquan Jade-Glaze Gongfu Set',
    quote:
      'Brought home the warmth of our Hangzhou tea house visits—the glaze pooling along the rim catches morning light and arrived double-boxed with zero marks.',
  },
  {
    id: 'note-2',
    reviewer: 'David Chen',
    location: 'San Francisco, USA',
    purchasedItem: 'Carved Cinnabar Peony Box',
    quote:
      'Purchased as an anniversary gift for my parents. The depth of the carved petals and the subtle natural lacquer scent immediately set it apart from tourist market pieces.',
  },
];
