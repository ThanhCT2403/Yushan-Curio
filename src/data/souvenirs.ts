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
import ruKilnVaseImg from '../assets/images/product_ru_kiln_vase_1794927430390.jpg';
import fencaiGingerJarImg from '../assets/images/product_fencai_ginger_jar_1794927431791.jpg';
import dehuaCupsImg from '../assets/images/product_dehua_cups_1794927430821.jpg';
import yixingZishaTeapotImg from '../assets/images/product_yixing_zisha_teapot_1794927431610.jpg';
import jianzhanTeabowlImg from '../assets/images/product_jianzhan_teabowl_1794927431916.jpg';
import cobaltGaiwanImg from '../assets/images/product_cobalt_gaiwan_1794927432828.jpg';
import fuzhouLacquerTrayImg from '../assets/images/product_fuzhou_lacquer_tray_1794927435660.jpg';
import jadeCenserImg from '../assets/images/product_jade_censer_1794927433912.jpg';
import suzhouFoldingFanImg from '../assets/images/product_suzhou_folding_fan_1794927434312.jpg';
import xuanScrollKitImg from '../assets/images/product_xuan_scroll_kit_1794927434988.jpg';

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
  {
    id: 'ru-kiln-celadon-vase',
    slug: 'ru-kiln-celadon-vase',
    name: 'Ru Kiln Lotus Incense Vase',
    chineseTitle: '汝窑天青莲瓣花插',
    category: 'Porcelain',
    origin: 'Ruzhou, Henan',
    workshop: 'Songcheng Ru Glaze Kiln',
    price: 148,
    image: ruKilnVaseImg,
    imageAlt: 'Pale sky-blue Ru kiln porcelain lotus-petal bud vase with crackle glaze on travertine stone.',
    editionNote: 'Agate Glaze Batch',
    badge: 'new-arrival',
    shortDescription: 'Sky-blue agate-glazed porcelain vase sculpted with overlapping lotus petals and fine ice-crackle.',
    story:
      'Formulated with crushed natural agate stone in the glaze slip, this Ruzhou porcelain vase catches soft window light in serene sky-blue hues prized since the Northern Song court.',
    materials: 'Ruzhou stoneware-porcelain body, natural agate-mineral sky-blue glaze',
    dimensions: '15.5 cm height · 8 cm diameter',
    inStock: true,
    featuredRank: 7,
    variants: [
      {
        id: 'sky-blue-single',
        label: 'Single Flower Vase (15.5 cm)',
        note: 'Includes lined brocade presentation box',
        priceDelta: 0,
      },
      {
        id: 'sky-blue-stand',
        label: 'With Rosewood Base Stand',
        note: 'Fitted dark wood display plinth included',
        priceDelta: 22,
      },
    ],
    reviews: [
      {
        id: 'rev-ru-1',
        author: 'Evelyn Cho',
        location: 'Taipei',
        rating: 5,
        date: 'October 20, 2026',
        variantLabel: 'With Rosewood Base Stand',
        comment:
          'Quiet sky-blue tone and delicate lotus relief. Already holds dried tea blossoms beside my gaiwan set.',
      },
    ],
  },
  {
    id: 'fencai-peony-ginger-jar',
    slug: 'fencai-peony-ginger-jar',
    name: 'Famille Rose Peony Ginger Jar',
    chineseTitle: '景德镇粉彩牡丹将军罐',
    category: 'Porcelain',
    origin: 'Jingdezhen, Jiangxi',
    workshop: 'Changnan Overglaze Atelier',
    price: 164,
    image: fencaiGingerJarImg,
    imageAlt: 'Jingdezhen famille rose painted porcelain lidded ginger jar featuring blush-pink peonies on travertine.',
    editionNote: 'Overglaze Enamel',
    shortDescription: 'Hand-enameled famille rose porcelain jar depicting layered blush peonies and gilded rim bands.',
    story:
      'Double-fired in Jingdezhen using traditional fencai glass-white powder enamels so each petal grades smoothly from pale rose to soft cream.',
    materials: 'Fine Jingdezhen porcelain, mineral fencai overglaze enamel, subtle gold trim',
    dimensions: '18 cm height · 13 cm diameter · 900 ml capacity',
    inStock: true,
    featuredRank: 8,
    variants: [
      {
        id: 'peony-classic',
        label: 'Classic Enamel Jar (18 cm)',
        note: 'Fitted porcelain cap with silk storage bag',
        priceDelta: 0,
      },
      {
        id: 'peony-collector-box',
        label: 'Paulownia Display Crate Edition',
        note: 'Custom export wood box & provenance scroll',
        priceDelta: 28,
      },
    ],
    reviews: [
      {
        id: 'rev-fencai-1',
        author: 'Margaret Reid',
        location: 'Toronto, Canada',
        rating: 5,
        date: 'October 9, 2026',
        variantLabel: 'Paulownia Display Crate Edition',
        comment:
          'You can feel the slight raised enamel texture across the peony petals—true painterly brushwork.',
      },
    ],
  },
  {
    id: 'dehua-blanc-guanyin-cup',
    slug: 'dehua-blanc-guanyin-cup',
    name: 'Dehua Blanc de Chine Tasting Pair',
    chineseTitle: '德化白瓷映月对杯',
    category: 'Porcelain',
    origin: 'Dehua, Fujian',
    workshop: 'Daiyun Ivory Kiln',
    price: 88,
    image: dehuaCupsImg,
    imageAlt: 'Pair of translucent warm ivory Dehua Blanc de Chine white porcelain tea cups on limestone.',
    badge: 'best-seller',
    shortDescription: 'Paper-thin warm ivory porcelain tasting cups prized for illuminating golden oolong infusions.',
    story:
      'Dehua "sheep-fat jade" white clay vitrifies to a velvety ivory translucency without brightener tints, softening tea astringency while displaying clear liquor color.',
    materials: 'Low-iron Dehua kaolin clay, high-fired pure clear glaze',
    dimensions: 'Pair of 90 ml cups · 6.8 cm rim diameter',
    inStock: true,
    featuredRank: 9,
    variants: [
      {
        id: 'ivory-pair',
        label: 'Tasting Pair (2 Cups)',
        note: 'Packed in cushioned linen box',
        priceDelta: 0,
      },
      {
        id: 'ivory-quartet',
        label: 'Host Quartet (4 Cups)',
        note: 'Complete 4-cup tasting presentation',
        priceDelta: 46,
      },
    ],
    reviews: [
      {
        id: 'rev-dehua-1',
        author: 'Oliver Grant',
        location: 'Bristol, UK',
        rating: 5,
        date: 'October 2, 2026',
        variantLabel: 'Tasting Pair (2 Cups)',
        comment:
          'Warm ivory glow when filled with high-mountain oolong. Lip thickness is remarkably fine.',
      },
    ],
  },
  {
    id: 'yixing-zisha-shuiping-pot',
    slug: 'yixing-zisha-shuiping-pot',
    name: 'Yixing Zisha Clay Shuiping Teapot',
    chineseTitle: '宜兴紫砂水平手拉壶',
    category: 'Tea Ware',
    origin: 'Yixing, Jiangsu',
    workshop: 'Dingshu Zisha Studio',
    price: 172,
    image: yixingZishaTeapotImg,
    imageAlt: 'Handcrafted reddish-brown Yixing Zisha unglazed clay teapot on a bamboo tea tray.',
    editionNote: 'Huanglongshan Ore',
    badge: 'best-seller',
    shortDescription: 'Breathable unglazed zhuni mineral clay gongfu teapot with balanced three-point spout geometry.',
    story:
      'Constructed from weathered Huanglongshan clay without interior glaze, this classic Shuiping pot seasons gracefully with aged pu-erh or roasted Wuyi rock teas.',
    materials: 'Aged Yixing zhuni zisha clay, built-in 9-hole clay ball filter',
    dimensions: '160 ml capacity · 11.5 cm spout-to-handle',
    inStock: true,
    featuredRank: 10,
    variants: [
      {
        id: 'shuiping-160ml',
        label: '160 ml Solo / Duo Pot',
        note: 'Includes artist seal certificate & cord',
        priceDelta: 0,
      },
      {
        id: 'shuiping-tray-set',
        label: 'Pot + Bamboo Serving Tray',
        note: 'Includes compact slatted bamboo tea boat',
        priceDelta: 34,
      },
    ],
    reviews: [
      {
        id: 'rev-yixing-1',
        author: 'Raymond Ng',
        location: 'Hong Kong',
        rating: 5,
        date: 'October 24, 2026',
        variantLabel: '160 ml Solo / Duo Pot',
        comment:
          'Lid suction stops water cleanly when covering the air hole, and the clay already shows a warm patina.',
      },
    ],
  },
  {
    id: 'jianzhan-hare-fur-chawan',
    slug: 'jianzhan-hare-fur-chawan',
    name: 'Jianzhan Tenmoku Tea Bowl',
    chineseTitle: '建盏兔毫油滴茶盏',
    category: 'Tea Ware',
    origin: 'Jianyang, Fujian',
    workshop: 'Shuiji Iron Glaze Kiln',
    price: 96,
    image: jianzhanTeabowlImg,
    imageAlt: 'Dark iron-glazed Chinese Jianzhan tenmoku tea bowl with silvery hare-fur glaze streaks on travertine.',
    editionNote: '1,310°C Reduction Fire',
    shortDescription: 'Heavy-walled iron stoneware chawan crystallized with shimmering silver hare-fur mineral streaks.',
    story:
      'Fired in reducing atmosphere above 1,300°C, high-iron local clay naturally separates into delicate crystalline hare-fur striations—no two bowls emerge alike.',
    materials: 'Jianyang iron-rich stoneware clay, wood-ash & red-clay mineral glaze',
    dimensions: '11.5 cm diameter · 6.2 cm height · 150 ml',
    inStock: true,
    featuredRank: 11,
    variants: [
      {
        id: 'hare-fur-standard',
        label: 'Classic Chawan (150 ml)',
        note: 'Includes brocade pouch & firing record',
        priceDelta: 0,
      },
      {
        id: 'hare-fur-box',
        label: 'Collector Wood Box Edition',
        note: 'Fitted paulownia box with silk lining',
        priceDelta: 20,
      },
    ],
    reviews: [
      {
        id: 'rev-jianzhan-1',
        author: 'Haruto Watanabe',
        location: 'Osaka, Japan',
        rating: 5,
        date: 'October 15, 2026',
        variantLabel: 'Collector Wood Box Edition',
        comment:
          'Deep metallic luster under warm evening lighting. Noticeably softens mineral mouthfeel in dark teas.',
      },
    ],
  },
  {
    id: 'jingdezhen-blue-gaiwan',
    slug: 'jingdezhen-blue-gaiwan',
    name: 'Cobalt Willow Porcelain Gaiwan',
    chineseTitle: '青花垂柳三才盖碗',
    category: 'Tea Ware',
    origin: 'Jingdezhen, Jiangxi',
    workshop: 'Yaoli Old Kiln Studio',
    price: 108,
    image: cobaltGaiwanImg,
    imageAlt: 'Three-piece Jingdezhen blue-and-white cobalt painted porcelain gaiwan lidded tea bowl on limestone.',
    badge: 'new-arrival',
    shortDescription: 'Traditional three-piece flared-rim gaiwan painted with weeping willow branches for gongfu steeping.',
    story:
      'Balanced with a wide anti-scald flared lip so fingers stay cool while pouring green, white, and fragrant floral oolong infusions.',
    materials: 'High-fired Jingdezhen kaolin porcelain, natural cobalt brushwork',
    dimensions: '135 ml vessel · 10 cm saucer diameter',
    inStock: true,
    featuredRank: 12,
    variants: [
      {
        id: 'gaiwan-3pc',
        label: 'Complete 3-Piece Gaiwan',
        note: 'Bowl, lid, and matching saucer',
        priceDelta: 0,
      },
      {
        id: 'gaiwan-pouch',
        label: 'Travel Felt Case Edition',
        note: 'Includes structured linen-felt travel case',
        priceDelta: 18,
      },
    ],
    reviews: [
      {
        id: 'rev-gaiwan-1',
        author: 'Sora Takahashi',
        location: 'Yokohama, Japan',
        rating: 5,
        date: 'October 5, 2026',
        variantLabel: 'Complete 3-Piece Gaiwan',
        comment:
          'Generous flared rim makes one-handed gongfu pours effortless even with boiling-hot water.',
      },
    ],
  },
  {
    id: 'fuzhou-bodiless-lacquer-tray',
    slug: 'fuzhou-bodiless-lacquer-tray',
    name: 'Fuzhou Bodiless Lacquer Tea Tray',
    chineseTitle: '福州脱胎漆器云纹茶盘',
    category: 'Lacquer & Jade',
    origin: 'Fuzhou, Fujian',
    workshop: 'Sanshan Heritage Lacquer',
    price: 158,
    image: fuzhouLacquerTrayImg,
    imageAlt: 'Oblong dark oxblood-and-black Fuzhou bodiless Chinese lacquerware serving tray with gold cloud inlay.',
    editionNote: 'Tuotai Craft',
    shortDescription: 'Featherlight silk-core bodiless lacquer serving tray inlaid with fine gold auspicious clouds.',
    story:
      'Shaped over ramie cloth and dozens of cured tree-lacquer coats before removing the inner mold, Fuzhou bodiless lacquer feels remarkably light yet impervious to warm tea.',
    materials: 'Ramie linen core, natural urushi lacquer, gold-leaf cloud linework',
    dimensions: '32 cm length · 20 cm width · 2.5 cm depth',
    inStock: true,
    featuredRank: 13,
    variants: [
      {
        id: 'oxblood-32cm',
        label: 'Gongfu Serving Tray (32 cm)',
        note: 'Holds teapot plus 3–4 tasting cups',
        priceDelta: 0,
      },
      {
        id: 'oxblood-padded',
        label: 'Collector Velvet Sleeve Edition',
        note: 'Includes protective flannel dust bag',
        priceDelta: 16,
      },
    ],
    reviews: [
      {
        id: 'rev-fuzhou-1',
        author: 'Catherine Brooks',
        location: 'Boston, USA',
        rating: 5,
        date: 'October 12, 2026',
        variantLabel: 'Gongfu Serving Tray (32 cm)',
        comment:
          'Shockingly light in the hand with a mirror-smooth oxblood undertone under daylight.',
      },
    ],
  },
  {
    id: 'xiuyan-jade-incense-burner',
    slug: 'xiuyan-jade-incense-burner',
    name: 'Yangzhou Carved Jade Censer',
    chineseTitle: '扬州玉雕双耳三足熏炉',
    category: 'Lacquer & Jade',
    origin: 'Yangzhou, Jiangsu',
    workshop: 'Guangling Jade Carving Studio',
    price: 195,
    image: jadeCenserImg,
    imageAlt: 'Carved pale celadon-green nephrite jade tripod incense censer with sculpted ring handles on travertine.',
    editionNote: 'Heirloom Carving',
    badge: 'low-stock',
    shortDescription: 'Sculpted pale-green nephrite tripod censer featuring loose ring-ears carved from a single stone.',
    story:
      'Hollowed and detailed with traditional water-lathe abrasive wheels in Yangzhou so both hanging rings move freely while remaining unbroken from the vessel body.',
    materials: 'Natural green nephrite jade, carved rosewood stand & brass ash dish',
    dimensions: '11 cm height · 9.5 cm handle-to-handle',
    inStock: true,
    featuredRank: 14,
    variants: [
      {
        id: 'censer-classic',
        label: 'Jade Censer + Brass Insert',
        note: 'Suitable for cone or coil incense',
        priceDelta: 0,
      },
      {
        id: 'censer-agarwood',
        label: 'With Sample Agarwood Coils',
        note: 'Includes tin of 12 natural incense coils',
        priceDelta: 24,
      },
    ],
    reviews: [
      {
        id: 'rev-censer-1',
        author: 'Julian Vance',
        location: 'London, UK',
        rating: 5,
        date: 'October 8, 2026',
        variantLabel: 'Jade Censer + Brass Insert',
        comment:
          'Remarkable that the movable rings are carved out of the same jade block—a quiet centerpiece on my study shelf.',
      },
    ],
  },
  {
    id: 'suzhou-sandalwood-folding-fan',
    slug: 'suzhou-sandalwood-folding-fan',
    name: 'Suzhou Sandalwood & Silk Folding Fan',
    chineseTitle: '苏州檀香绢面折扇',
    category: 'Silk & Paper',
    origin: 'Suzhou, Jiangsu',
    workshop: 'Lingfeng Fan Guild',
    price: 112,
    image: suzhouFoldingFanImg,
    imageAlt: 'Opened Suzhou carved sandalwood folding fan with cream painted ink mountain silk leaf beside linen pouch.',
    badge: 'best-seller',
    shortDescription: 'Pierced fragrant sandalwood ribs paired with hand-painted silk leaf depicting misty peaks.',
    story:
      'Each wooden guard stick is fret-carved by hand in Suzhou so a faint warm sandalwood aroma releases softly whenever the silk fan is opened.',
    materials: 'Aged Indian sandalwood ribs, mulberry silk leaf, woven linen sleeve',
    dimensions: '22 cm closed · 38 cm open span',
    inStock: true,
    featuredRank: 15,
    variants: [
      {
        id: 'fan-mountain',
        label: 'Misty Mountain Ink Leaf',
        note: 'Includes tailored linen travel sleeve',
        priceDelta: 0,
      },
      {
        id: 'fan-stand',
        label: 'With Rosewood Display Easel',
        note: 'Includes sleeve & folding display stand',
        priceDelta: 16,
      },
    ],
    reviews: [
      {
        id: 'rev-fan-1',
        author: 'Isabelle Moreau',
        location: 'Paris, France',
        rating: 5,
        date: 'October 17, 2026',
        variantLabel: 'Misty Mountain Ink Leaf',
        comment:
          'Delicate fretwork on the sandalwood ribs and a genuine woody scent that greets you as soon as you open the box.',
      },
    ],
  },
  {
    id: 'xuan-rice-paper-scroll-kit',
    slug: 'xuan-rice-paper-scroll-kit',
    name: 'Jingxian Xuan Paper Scroll Folio',
    chineseTitle: '泾县手工宣纸手卷礼盒',
    category: 'Silk & Paper',
    origin: 'Xuancheng, Anhui',
    workshop: 'Qingtan Paper Mill',
    price: 84,
    image: xuanScrollKitImg,
    imageAlt: 'Rolled ivory handmade Anhui Xuan rice paper calligraphy handscroll tied with silk ribbon beside paulownia box.',
    editionNote: '100% Bark & Straw',
    shortDescription: 'Archival mulberry-bark and aged-straw Xuan handscroll mounted on silk brocade inside cedar box.',
    story:
      'Formed sheet by sheet on bamboo screens in Jingxian using lime-retted sandalwood bark and mountain spring water, offering crisp ink absorption that lasts centuries.',
    materials: 'Hand-scooped raw-edge Xuan paper, silk brocade backing, paulownia case',
    dimensions: '34 cm height × 180 cm scroll length',
    inStock: true,
    featuredRank: 16,
    variants: [
      {
        id: 'scroll-raw',
        label: 'Half-Sized Shuxuan (Brush & Ink)',
        note: 'Balanced ink feathering for calligraphy',
        priceDelta: 0,
      },
      {
        id: 'scroll-twin',
        label: 'Collector Twin Scroll Set',
        note: 'Two mounted scrolls inside gift box',
        priceDelta: 36,
      },
    ],
    reviews: [
      {
        id: 'rev-xuan-1',
        author: 'Daniel Park',
        location: 'Seoul, South Korea',
        rating: 5,
        date: 'October 1, 2026',
        variantLabel: 'Half-Sized Shuxuan (Brush & Ink)',
        comment:
          'Takes sumi ink cleanly without bleeding out of control, and the paulownia chest protects it from humidity.',
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
