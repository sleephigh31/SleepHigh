/**
 * Firebase Seed Script v3
 * Uses pure REST API — no Firebase SDK required.
 */

const PROJECT_ID = "sleephigh-e34ba";
const API_KEY = "AIzaSyDEe_o3mnscokoGOE004Azs07w1JxhClog";
const ADMIN_EMAIL = "sleephigh31@gmail.com";
const ADMIN_PASSWORD = "admin123";

const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts`;
const FS_BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── Auth helpers ───────────────────────────────────────────────────────────
async function signIn(email, password) {
  const res = await fetch(`${AUTH_URL}:signInWithPassword?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Sign-in failed");
  return { idToken: data.idToken, localId: data.localId };
}

async function signUp(email, password) {
  const res = await fetch(`${AUTH_URL}:signUp?key=${API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Sign-up failed");
  return { idToken: data.idToken, localId: data.localId };
}

// ── Firestore REST helpers ─────────────────────────────────────────────────
function toFsValue(val) {
  if (val === null || val === undefined) return { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (typeof val === "number") {
    return Number.isInteger(val) ? { integerValue: String(val) } : { doubleValue: val };
  }
  if (typeof val === "string") return { stringValue: val };
  if (Array.isArray(val)) return { arrayValue: { values: val.map(toFsValue) } };
  if (typeof val === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(val)) fields[k] = toFsValue(v);
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

function toFsDoc(obj) {
  const fields = {};
  for (const [k, v] of Object.entries(obj)) fields[k] = toFsValue(v);
  return { fields };
}

async function fsSet(col, docId, data, token) {
  const res = await fetch(`${FS_BASE}/${col}/${docId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(toFsDoc(data)),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`fsSet ${col}/${docId}: ${JSON.stringify(err)}`);
  }
  return res.json();
}

async function fsAdd(col, data, token) {
  const res = await fetch(`${FS_BASE}/${col}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(toFsDoc(data)),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`fsAdd ${col}: ${JSON.stringify(err)}`);
  }
  const result = await res.json();
  return result.name.split("/").pop();
}

// ── Data ───────────────────────────────────────────────────────────────────
const now = new Date().toISOString();

const categories = [
  {
    handle: "mattresses",
    slug: "mattresses",
    name: { ar: "المراتب", en: "Mattresses" },
    description: {
      ar: "مراتب مصرية عالية الجودة لنوم مريح وداعم",
      en: "High-quality Egyptian mattresses for comfortable supportive sleep",
    },
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    order: 1,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    handle: "pillows",
    slug: "pillows",
    name: { ar: "الوسائد", en: "Pillows" },
    description: {
      ar: "وسائد لكل وضعية نوم وكل احتياج",
      en: "Pillows for every sleeping position and need",
    },
    image: "https://images.unsplash.com/photo-1631083076715-f62f27f86a07?w=600&q=80",
    order: 2,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    handle: "toppers",
    slug: "toppers",
    name: { ar: "مراتب التطرية", en: "Toppers" },
    description: {
      ar: "أضف طبقة راحة فاخرة لمرتبتك الحالية",
      en: "Add a luxury comfort layer to your existing mattress",
    },
    image: "https://images.unsplash.com/photo-1588362951121-3ee319b018b2?w=600&q=80",
    order: 3,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    handle: "protectors",
    slug: "protectors",
    name: { ar: "أغطية الحماية", en: "Protectors" },
    description: {
      ar: "حافظ على مرتبتك من السوائل والبكتيريا",
      en: "Keep your mattress safe from liquids and bacteria",
    },
    image: "https://images.unsplash.com/photo-1631083076715-f62f27f86a07?w=600&q=80",
    order: 4,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    handle: "accessories",
    slug: "accessories",
    name: { ar: "الإكسسوارات", en: "Accessories" },
    description: {
      ar: "كل ما تحتاجه لتجهيز غرفة نوم مثالية",
      en: "Everything you need for the perfect bedroom",
    },
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80",
    order: 5,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

const products = [
  {
    slug: "cloud-comfort-mattress",
    name: { ar: "مرتبة كلاود كومفورت", en: "Cloud Comfort Mattress" },
    tagline: { ar: "نوم على السحاب كل ليلة", en: "Sleep on clouds every night" },
    description: {
      ar: "مرتبة مصنوعة من الإسفنج عالي الكثافة مع طبقة لاتكس طبيعية. مثالية لجميع أوضاع النوم وتوفر دعماً مثالياً للعمود الفقري.",
      en: "Made from high-density foam with a natural latex layer. Perfect for all sleeping positions with optimal spinal support.",
    },
    categoryId: "mattresses",
    price: 4500,
    compareAtPrice: 5500,
    costPrice: 2800,
    sku: "MAT-CC-001",
    stock: 25,
    lowStockThreshold: 5,
    featured: true,
    active: true,
    rating: 4.8,
    reviewCount: 127,
    tags: ["مرتبة", "لاتكس", "اسفنج"],
    firmness: "medium",
    brand: "SleepHigh",
    deletedAt: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        provider: "unsplash",
        altAr: "مرتبة كلاود كومفورت",
        altEn: "Cloud Comfort Mattress",
        position: 0,
        isPrimary: true,
      },
    ],
    options: [
      {
        key: "width",
        label: { ar: "العرض", en: "Width" },
        values: [
          { value: "90", label: { ar: "90 سم (فردي)", en: "90cm" } },
          { value: "120", label: { ar: "120 سم", en: "120cm" } },
          { value: "150", label: { ar: "150 سم", en: "150cm" } },
          { value: "180", label: { ar: "180 سم (ملكي)", en: "180cm" } },
        ],
      },
      {
        key: "height",
        label: { ar: "الارتفاع", en: "Height" },
        values: [
          { value: "20", label: { ar: "20 سم", en: "20cm" } },
          { value: "25", label: { ar: "25 سم", en: "25cm" } },
        ],
      },
    ],
    variants: [
      {
        id: "cc-90-20",
        sku: "MAT-CC-90-20",
        options: { width: "90", height: "20" },
        price: 3500,
        compareAtPrice: 4200,
        stock: 8,
        available: true,
      },
      {
        id: "cc-120-20",
        sku: "MAT-CC-120-20",
        options: { width: "120", height: "20" },
        price: 4500,
        compareAtPrice: 5500,
        stock: 6,
        available: true,
      },
      {
        id: "cc-150-25",
        sku: "MAT-CC-150-25",
        options: { width: "150", height: "25" },
        price: 5500,
        compareAtPrice: 6500,
        stock: 4,
        available: true,
      },
      {
        id: "cc-180-25",
        sku: "MAT-CC-180-25",
        options: { width: "180", height: "25" },
        price: 6500,
        compareAtPrice: 7500,
        stock: 2,
        available: true,
      },
    ],
    materials: {
      ar: "إسفنج عالي الكثافة 35kg/m³ + طبقة لاتكس طبيعي",
      en: "High-density foam 35kg/m³ + natural latex layer",
    },
    features: [
      { ar: "دعم أمثل للعمود الفقري", en: "Optimal spinal support" },
      { ar: "مقاوم لعث الغبار", en: "Dust mite resistant" },
      { ar: "ضمان 10 سنوات", en: "10-year warranty" },
    ],
    usage: { ar: "مناسب لجميع أوضاع النوم", en: "Suitable for all sleeping positions" },
    care: { ar: "قم بتقليب المرتبة كل 3 أشهر", en: "Rotate mattress every 3 months" },
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "memory-foam-pillow",
    name: { ar: "وسادة ميموري فوم", en: "Memory Foam Pillow" },
    tagline: { ar: "راحة تتذكر شكل رأسك", en: "Comfort that remembers your head shape" },
    description: {
      ar: "وسادة ميموري فوم تتكيف مع شكل رأسك وعنقك لتوفير دعم مثالي طوال الليل وتخفيف آلام الرقبة.",
      en: "Memory foam pillow adapts to your head and neck shape for optimal support and neck pain relief.",
    },
    categoryId: "pillows",
    price: 650,
    compareAtPrice: 850,
    costPrice: 380,
    sku: "PIL-MF-001",
    stock: 50,
    lowStockThreshold: 10,
    featured: true,
    active: true,
    rating: 4.7,
    reviewCount: 89,
    tags: ["وسادة", "ميموري فوم", "دعم عنق"],
    firmness: "medium",
    brand: "SleepHigh",
    deletedAt: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1631083076715-f62f27f86a07?w=800&q=80",
        provider: "unsplash",
        altAr: "وسادة ميموري فوم",
        altEn: "Memory Foam Pillow",
        position: 0,
        isPrimary: true,
      },
    ],
    options: [
      {
        key: "size",
        label: { ar: "الحجم", en: "Size" },
        values: [
          { value: "standard", label: { ar: "قياسي 50×70", en: "Standard 50×70" } },
          { value: "king", label: { ar: "كبير 50×90", en: "King 50×90" } },
        ],
      },
    ],
    variants: [
      {
        id: "pil-mf-std",
        sku: "PIL-MF-STD",
        options: { size: "standard" },
        price: 650,
        compareAtPrice: 850,
        stock: 30,
        available: true,
      },
      {
        id: "pil-mf-king",
        sku: "PIL-MF-KING",
        options: { size: "king" },
        price: 850,
        compareAtPrice: 1050,
        stock: 20,
        available: true,
      },
    ],
    materials: {
      ar: "رغوة ميموري عالية الجودة + غلاف قطني مضاد للبكتيريا",
      en: "High-quality memory foam + anti-bacterial cotton cover",
    },
    features: [
      { ar: "تتكيف مع شكل الرأس والعنق", en: "Adapts to head and neck shape" },
      { ar: "غلاف قابل للغسيل", en: "Washable cover" },
    ],
    usage: { ar: "اغسل الغلاف شهرياً", en: "Wash the cover monthly" },
    care: { ar: "تهوية أسبوعياً، غلاف قابل للغسيل 30°", en: "Air weekly, cover washable at 30°C" },
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "luxury-topper",
    name: { ar: "مرتبة إضافية فاخرة", en: "Luxury Mattress Topper" },
    tagline: { ar: "طبقة راحة إضافية لمرتبتك", en: "An extra comfort layer for your mattress" },
    description: {
      ar: "مرتبة إضافية فاخرة تحول مرتبتك العادية إلى تجربة نوم فندقية. مليئة بالريش الصناعي الفاخر.",
      en: "Luxury mattress topper transforms your ordinary mattress into a hotel sleeping experience.",
    },
    categoryId: "toppers",
    price: 1200,
    compareAtPrice: 1600,
    costPrice: 700,
    sku: "TOP-LX-001",
    stock: 30,
    lowStockThreshold: 5,
    featured: true,
    active: true,
    rating: 4.9,
    reviewCount: 62,
    tags: ["مرتبة اضافية", "توبر", "فاخر"],
    firmness: "soft",
    brand: "SleepHigh",
    deletedAt: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1588362951121-3ee319b018b2?w=800&q=80",
        provider: "unsplash",
        altAr: "مرتبة إضافية فاخرة",
        altEn: "Luxury Mattress Topper",
        position: 0,
        isPrimary: true,
      },
    ],
    options: [
      {
        key: "width",
        label: { ar: "العرض", en: "Width" },
        values: [
          { value: "90", label: { ar: "90 سم", en: "90cm" } },
          { value: "120", label: { ar: "120 سم", en: "120cm" } },
          { value: "150", label: { ar: "150 سم", en: "150cm" } },
          { value: "180", label: { ar: "180 سم", en: "180cm" } },
        ],
      },
    ],
    variants: [
      {
        id: "top-lx-90",
        sku: "TOP-LX-90",
        options: { width: "90" },
        price: 1000,
        compareAtPrice: 1300,
        stock: 10,
        available: true,
      },
      {
        id: "top-lx-120",
        sku: "TOP-LX-120",
        options: { width: "120" },
        price: 1200,
        compareAtPrice: 1600,
        stock: 8,
        available: true,
      },
      {
        id: "top-lx-150",
        sku: "TOP-LX-150",
        options: { width: "150" },
        price: 1500,
        compareAtPrice: 1900,
        stock: 7,
        available: true,
      },
      {
        id: "top-lx-180",
        sku: "TOP-LX-180",
        options: { width: "180" },
        price: 1800,
        compareAtPrice: 2200,
        stock: 5,
        available: true,
      },
    ],
    materials: {
      ar: "ريش صناعي 300g/m² + قماش قطني 200 خيط + أطراف مطاطية",
      en: "300g/m² synthetic down + 200-thread cotton + elastic edges",
    },
    features: [
      { ar: "تضيف طبقة ناعمة لأي مرتبة", en: "Adds a soft layer to any mattress" },
      { ar: "قابلة للغسيل", en: "Machine washable" },
    ],
    usage: {
      ar: "ضعها فوق مرتبتك وثبتها بالأطراف المطاطية",
      en: "Place over mattress and secure with elastic corners",
    },
    care: { ar: "اغسل على 40°. جفف على حرارة منخفضة.", en: "Wash at 40°C. Tumble dry low." },
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "waterproof-mattress-protector",
    name: { ar: "غطاء مرتبة مضاد للماء", en: "Waterproof Mattress Protector" },
    tagline: { ar: "حماية كاملة لمرتبتك", en: "Complete protection for your mattress" },
    description: {
      ar: "غطاء مرتبة مضاد للماء يحمي مرتبتك من السوائل والبكتيريا وعث الغبار مع السماح بالتنفس.",
      en: "Waterproof mattress protector shields your mattress from liquids, bacteria, and dust mites while remaining breathable.",
    },
    categoryId: "protectors",
    price: 350,
    compareAtPrice: 480,
    costPrice: 180,
    sku: "PRO-WP-001",
    stock: 60,
    lowStockThreshold: 15,
    featured: false,
    active: true,
    rating: 4.6,
    reviewCount: 44,
    tags: ["حماية مرتبة", "ضد الماء"],
    firmness: "soft",
    brand: "SleepHigh",
    deletedAt: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1631083076715-f62f27f86a07?w=800&q=80",
        provider: "unsplash",
        altAr: "غطاء مضاد للماء",
        altEn: "Waterproof Protector",
        position: 0,
        isPrimary: true,
      },
    ],
    options: [
      {
        key: "width",
        label: { ar: "العرض", en: "Width" },
        values: [
          { value: "90", label: { ar: "90 سم", en: "90cm" } },
          { value: "120", label: { ar: "120 سم", en: "120cm" } },
          { value: "150", label: { ar: "150 سم", en: "150cm" } },
          { value: "180", label: { ar: "180 سم", en: "180cm" } },
        ],
      },
    ],
    variants: [
      {
        id: "pro-wp-90",
        sku: "PRO-WP-90",
        options: { width: "90" },
        price: 250,
        compareAtPrice: 350,
        stock: 20,
        available: true,
      },
      {
        id: "pro-wp-120",
        sku: "PRO-WP-120",
        options: { width: "120" },
        price: 300,
        compareAtPrice: 420,
        stock: 15,
        available: true,
      },
      {
        id: "pro-wp-150",
        sku: "PRO-WP-150",
        options: { width: "150" },
        price: 350,
        compareAtPrice: 480,
        stock: 15,
        available: true,
      },
      {
        id: "pro-wp-180",
        sku: "PRO-WP-180",
        options: { width: "180" },
        price: 420,
        compareAtPrice: 560,
        stock: 10,
        available: true,
      },
    ],
    materials: {
      ar: "بوليستر + طبقة بولي يوريثان مضادة للماء + أطراف مطاطية",
      en: "Polyester + waterproof polyurethane layer + elastic edges",
    },
    features: [
      { ar: "مضادة للماء 100%", en: "100% waterproof" },
      { ar: "مقاومة للبكتيريا", en: "Bacteria resistant" },
      { ar: "قابلة للغسيل", en: "Machine washable" },
    ],
    usage: { ar: "ضعها فوق مرتبتك وتحت الشرشف", en: "Place over mattress and under the sheet" },
    care: { ar: "اغسل على 60° للتعقيم. لا تكوي.", en: "Wash at 60°C. Do not iron." },
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "organic-cotton-bedsheet",
    name: { ar: "طقم ملاءات قطن عضوي", en: "Organic Cotton Bedsheet Set" },
    tagline: { ar: "ناعم كالحرير من القطن الطبيعي", en: "Soft as silk from natural cotton" },
    description: {
      ar: "طقم ملاءات من القطن العضوي 400 خيط يمنحك إحساساً فاخراً وناعماً. يشمل ملاءة سرير، غطاء لحاف، وكيسا وسادتين.",
      en: "400-thread count organic cotton bedsheet set. Includes fitted sheet, duvet cover, and 2 pillowcases.",
    },
    categoryId: "accessories",
    price: 890,
    compareAtPrice: 1200,
    costPrice: 520,
    sku: "ACC-CS-001",
    stock: 40,
    lowStockThreshold: 8,
    featured: true,
    active: true,
    rating: 4.8,
    reviewCount: 73,
    tags: ["ملاءات", "قطن عضوي", "طقم"],
    firmness: "soft",
    brand: "SleepHigh",
    deletedAt: null,
    images: [
      {
        url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
        provider: "unsplash",
        altAr: "طقم ملاءات قطن",
        altEn: "Organic Cotton Set",
        position: 0,
        isPrimary: true,
      },
    ],
    options: [
      {
        key: "size",
        label: { ar: "المقاس", en: "Size" },
        values: [
          { value: "single", label: { ar: "فردي 90×190", en: "Single 90×190" } },
          { value: "double", label: { ar: "مزدوج 120×200", en: "Double 120×200" } },
          { value: "queen", label: { ar: "كبير 150×200", en: "Queen 150×200" } },
          { value: "king", label: { ar: "ملكي 180×200", en: "King 180×200" } },
        ],
      },
      {
        key: "upgrade",
        label: { ar: "اللون", en: "Color" },
        values: [
          { value: "white", label: { ar: "أبيض", en: "White" } },
          { value: "beige", label: { ar: "بيج", en: "Beige" } },
          { value: "gray", label: { ar: "رمادي", en: "Gray" } },
        ],
      },
    ],
    variants: [
      {
        id: "cs-qn-wh",
        sku: "ACC-QN-WH",
        options: { size: "queen", upgrade: "white" },
        price: 890,
        compareAtPrice: 1200,
        stock: 6,
        available: true,
      },
      {
        id: "cs-kg-wh",
        sku: "ACC-KG-WH",
        options: { size: "king", upgrade: "white" },
        price: 1050,
        compareAtPrice: 1400,
        stock: 5,
        available: true,
      },
      {
        id: "cs-qn-bg",
        sku: "ACC-QN-BG",
        options: { size: "queen", upgrade: "beige" },
        price: 890,
        compareAtPrice: 1200,
        stock: 7,
        available: true,
      },
      {
        id: "cs-db-wh",
        sku: "ACC-DB-WH",
        options: { size: "double", upgrade: "white" },
        price: 790,
        compareAtPrice: 1050,
        stock: 7,
        available: true,
      },
    ],
    materials: {
      ar: "قطن عضوي 100% بنسيج 400 خيط، خالٍ من المواد الكيميائية الضارة",
      en: "100% organic cotton 400-thread count, free from harmful chemicals",
    },
    features: [
      { ar: "قطن عضوي معتمد", en: "Certified organic cotton" },
      { ar: "لا يسبب الحساسية", en: "Hypoallergenic" },
      { ar: "يزداد نعومة مع الغسيل", en: "Gets softer with each wash" },
    ],
    usage: { ar: "اغسل قبل الاستخدام الأول", en: "Wash before first use" },
    care: { ar: "اغسل على 40°. لا تستخدم منعم قماش.", en: "Wash at 40°C. No fabric softener." },
    createdAt: now,
    updatedAt: now,
  },
];

const settings = {
  nameAr: "سليب هاي",
  nameEn: "SleepHigh",
  phone: "01012345678",
  email: "info@sleephigh.com",
  address: "كفر الزيات — محافظة الغربية — مصر",
  shipping: {
    fee: 150,
    freeThreshold: 5000,
    areas: ["القاهرة", "الإسكندرية", "الجيزة", "الغربية"],
  },
  payments: { codEnabled: true, onlineEnabled: false },
  social: {
    facebook: "https://facebook.com/sleephigh",
    instagram: "https://instagram.com/sleephigh",
    whatsapp: "https://wa.me/201012345678",
  },
  seo: {
    titleAr: "سليب هاي — مراتب مصرية فاخرة",
    titleEn: "SleepHigh — Egyptian Premium Mattresses",
    descriptionAr: "مراتب ووسائد عالية الجودة من مصر. توصيل سريع ودفع عند الاستلام.",
    descriptionEn:
      "High-quality mattresses and pillows from Egypt. Fast delivery and cash on delivery.",
  },
  updatedAt: now,
};

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🚀 SleepHigh Firebase Seed v3\n");
  console.log("📡 يستخدم REST API فقط — لا SDK\n");

  // Step 1: Auth
  console.log("👤 [1/4] تسجيل الدخول...");
  let token, uid;
  try {
    ({ idToken: token, localId: uid } = await signIn(ADMIN_EMAIL, ADMIN_PASSWORD));
    console.log(`   ✅ تم تسجيل الدخول: ${ADMIN_EMAIL}`);
  } catch (e) {
    console.log(`   ℹ️  ${e.message} — محاولة إنشاء حساب جديد...`);
    ({ idToken: token, localId: uid } = await signUp(ADMIN_EMAIL, ADMIN_PASSWORD));
    console.log(`   ✅ تم إنشاء الحساب: ${ADMIN_EMAIL}`);
  }
  console.log(`   🆔 UID: ${uid}\n`);

  // Step 2: Admin role
  console.log("🛡️  [2/4] إضافة دور الأدمن...");
  await fsSet(
    "adminRoles",
    uid,
    { uid, email: ADMIN_EMAIL, role: "admin", grantedAt: now, grantedBy: "seed-script" },
    token,
  );
  console.log(`   ✅ adminRoles/${uid}\n`);

  // Step 3: Settings
  console.log("⚙️  [3/4] إعدادات المتجر...");
  await fsSet("settings", "store", settings, token);
  console.log("   ✅ settings/store\n");

  // Step 4: Categories + Products
  console.log("📦 [4/4] الفئات والمنتجات...");
  for (const cat of categories) {
    await fsSet("categories", cat.handle, cat, token);
    console.log(`   📁 ${cat.name.ar}`);
  }
  for (const prod of products) {
    const id = await fsAdd("products", prod, token);
    console.log(`   📦 ${prod.name.ar} → ${id}`);
  }

  console.log("\n═══════════════════════════════════════");
  console.log("✅ تمت التهيئة بنجاح!");
  console.log("═══════════════════════════════════════");
  console.log(`🔑 البريد:    ${ADMIN_EMAIL}`);
  console.log(`🔑 كلمة المرور: ${ADMIN_PASSWORD}`);
  console.log(`🔑 UID الأدمن:  ${uid}`);
  console.log(`🌐 رابط الأدمن: http://localhost:3000/admin/login`);
  console.log(`🛒 المتجر:      http://localhost:3000/ar`);
  console.log("═══════════════════════════════════════");
  console.log(`📊 الفئات: ${categories.length} | المنتجات: ${products.length}`);
  console.log("═══════════════════════════════════════\n");

  process.exit(0);
}

main().catch((e) => {
  console.error("\n❌ خطأ:", e.message || e);
  process.exit(1);
});
