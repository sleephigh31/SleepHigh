import type { Locale } from "./types";

export const LOCALES: Locale[] = ["ar", "en"];
export const DEFAULT_LOCALE: Locale = "ar";

export function isLocale(value: string | undefined): value is Locale {
  return value === "ar" || value === "en";
}

export function dirFor(locale: Locale) {
  return locale === "ar" ? "rtl" : "ltr";
}

const dict = {
  // brand
  "brand.name": { ar: "سليب هاي", en: "SleepHigh" },
  "brand.tagline": { ar: "نوم مصري فاخر", en: "Egyptian premium sleep" },

  // announcement
  "announce.freeShipping": {
    ar: "التوصيل المجاني لكل أهالي كفر الزيات",
    en: "Free delivery across Kafr El Zayat",
  },
  "announce.cod": { ar: "الدفع عند الاستلام متاح", en: "Cash on delivery available" },
  "announce.warranty": { ar: "ضمان يصل إلى ٥ سنوات", en: "Up to 5 years warranty" },

  // nav
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.mattresses": { ar: "المراتب", en: "Mattresses" },
  "nav.pillows": { ar: "الوسائد", en: "Pillows" },
  "nav.collections": { ar: "كل المنتجات", en: "Shop all" },
  "nav.about": { ar: "من نحن", en: "About us" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact" },
  "nav.menu": { ar: "القائمة", en: "Menu" },
  "nav.close": { ar: "إغلاق", en: "Close" },
  "nav.language": { ar: "اللغة", en: "Language" },

  // header actions
  "header.search": { ar: "ابحث عن منتج", en: "Search products" },
  "header.searchShort": { ar: "بحث", en: "Search" },
  "header.account": { ar: "حسابي", en: "Account" },
  "header.wishlist": { ar: "المفضلة", en: "Wishlist" },
  "header.cart": { ar: "السلة", en: "Cart" },

  // hero
  "hero.title": { ar: "نوم أفضل يبدأ من هنا", en: "Better sleep starts here" },
  "hero.subtitle": {
    ar: "اكتشف منتجات نوم مصممة لتمنحك الراحة والدعم كل ليلة، بخامات مختارة وتصنيع مصري بمعايير عالية.",
    en: "Discover sleep essentials engineered for comfort and support every night, with carefully selected materials and high-standard Egyptian craftsmanship.",
  },
  "hero.ctaPrimary": { ar: "تسوق الآن", en: "Shop now" },
  "hero.ctaSecondary": { ar: "اكتشف المراتب", en: "Explore mattresses" },

  // sections
  "section.categories": { ar: "تسوق حسب الفئة", en: "Shop by category" },
  "section.categoriesSub": {
    ar: "مجموعات مصممة لتناسب كل احتياج نوم",
    en: "Collections built around every sleep need",
  },
  "section.popular": { ar: "الأكثر مبيعًا", en: "Best sellers" },
  "section.popularSub": {
    ar: "اختيارات عملائنا الأكثر طلبًا",
    en: "Our customers' most requested picks",
  },
  "section.mattresses": { ar: "المراتب", en: "Mattresses" },
  "section.mattressesSub": {
    ar: "دعم متوازن ونوم أعمق مع تشكيلة المراتب",
    en: "Balanced support and deeper sleep",
  },
  "section.pillows": { ar: "الوسائد", en: "Pillows" },
  "section.pillowsSub": {
    ar: "ارتفاعات وخامات مختلفة لكل وضعية نوم",
    en: "Different lofts and fills for every sleep position",
  },
  "section.toppers": { ar: "التطرية وواقي المرتبة", en: "Toppers & protectors" },
  "section.toppersSub": {
    ar: "طبقة راحة إضافية وحماية تدوم",
    en: "An extra comfort layer and lasting protection",
  },
  "section.benefits": { ar: "لماذا سليب هاي", en: "Why SleepHigh" },
  "section.testimonials": { ar: "آراء عملائنا", en: "What our customers say" },
  "section.related": { ar: "منتجات مشابهة", en: "You may also like" },
  "section.viewAll": { ar: "عرض الكل", en: "View all" },

  // benefits
  "benefit.delivery": { ar: "توصيل آمن", en: "Safe delivery" },
  "benefit.deliveryText": {
    ar: "تغليف محكم وتوصيل حتى باب منزلك.",
    en: "Protective packaging delivered to your door.",
  },
  "benefit.quality": { ar: "منتجات عالية الجودة", en: "High quality products" },
  "benefit.qualityText": {
    ar: "خامات مختارة واختبارات دقيقة لكل دفعة إنتاج.",
    en: "Selected materials and tested production batches.",
  },
  "benefit.support": { ar: "دعم العملاء", en: "Customer support" },
  "benefit.supportText": {
    ar: "فريق يساعدك في اختيار المقاس المناسب.",
    en: "A team that helps you pick the right size.",
  },
  "benefit.payment": { ar: "دفع آمن", en: "Secure payment" },
  "benefit.paymentText": {
    ar: "الدفع عند الاستلام أو إلكترونيًا قريبًا.",
    en: "Cash on delivery, with online payment coming soon.",
  },
  "benefit.returns": { ar: "سياسة استرجاع واضحة", en: "Clear return policy" },
  "benefit.returnsText": {
    ar: "١٤ يومًا للاستبدال أو الإرجاع بشروط بسيطة.",
    en: "14 days to exchange or return with simple terms.",
  },

  // promo
  "promo.eyebrow": { ar: "مجموعة الراحة", en: "Comfort collection" },
  "promo.title": { ar: "طبقة راحة تُغيّر ليلتك", en: "A comfort layer that changes your night" },
  "promo.text": {
    ar: "أضف مرتبة تطرية أو وسادة مناسبة لوضعية نومك واحصل على إحساس جديد تمامًا.",
    en: "Add a topper or the right pillow for your sleep position and feel the difference.",
  },
  "promo.cta": { ar: "تسوق المجموعة", en: "Shop the collection" },

  // newsletter
  "newsletter.title": { ar: "كن أول من يعرف", en: "Be the first to know" },
  "newsletter.text": {
    ar: "احصل على أحدث العروض والمنتجات الجديدة.",
    en: "Get our latest offers and new arrivals.",
  },
  "newsletter.placeholder": { ar: "البريد الإلكتروني", en: "Email address" },
  "newsletter.cta": { ar: "اشترك", en: "Subscribe" },
  "newsletter.success": { ar: "تم الاشتراك بنجاح.", en: "Subscribed successfully." },
  "newsletter.error": {
    ar: "من فضلك أدخل بريدًا إلكترونيًا صحيحًا.",
    en: "Please enter a valid email address.",
  },

  // product card / product page
  "product.addToCart": { ar: "أضف إلى السلة", en: "Add to cart" },
  "product.buyNow": { ar: "اشتر الآن", en: "Buy now" },
  "product.quickView": { ar: "نظرة سريعة", en: "Quick view" },
  "product.addToWishlist": { ar: "أضف للمفضلة", en: "Add to wishlist" },
  "product.removeFromWishlist": { ar: "إزالة من المفضلة", en: "Remove from wishlist" },
  "product.viewFull": { ar: "عرض المنتج كاملًا", en: "View full product" },
  "product.from": { ar: "من", en: "From" },
  "product.inStock": { ar: "متوفر", en: "In stock" },
  "product.lowStock": { ar: "كمية محدودة", en: "Low stock" },
  "product.outOfStock": { ar: "غير متوفر", en: "Out of stock" },
  "product.sku": { ar: "كود المنتج", en: "SKU" },
  "product.quantity": { ar: "الكمية", en: "Quantity" },
  "product.increase": { ar: "زيادة الكمية", en: "Increase quantity" },
  "product.decrease": { ar: "تقليل الكمية", en: "Decrease quantity" },
  "product.sizeGuide": { ar: "دليل المقاسات", en: "Size guide" },
  "product.deliveryInfo": {
    ar: "التوصيل من ٢ إلى ٥ أيام عمل داخل جمهورية مصر العربية.",
    en: "Delivery within 2–5 working days across Egypt.",
  },
  "product.reviews": { ar: "تقييم", en: "reviews" },
  "product.save": { ar: "وفّر", en: "Save" },
  "product.discount": { ar: "خصم", en: "Off" },
  "product.addedToCart": { ar: "تمت الإضافة إلى السلة", en: "Added to cart" },
  "product.addedToWishlist": { ar: "تمت الإضافة إلى المفضلة", en: "Added to wishlist" },
  "product.removedFromWishlist": { ar: "تم الحذف من المفضلة", en: "Removed from wishlist" },
  "product.selectOptions": { ar: "اختر المقاس المناسب", en: "Choose your options" },
  "product.gallery": { ar: "صور المنتج", en: "Product gallery" },
  "product.zoom": { ar: "تكبير الصورة", en: "Zoom image" },

  // tabs
  "tab.description": { ar: "وصف المنتج", en: "Description" },
  "tab.materials": { ar: "الخامات", en: "Materials" },
  "tab.features": { ar: "المميزات", en: "Features" },
  "tab.sizes": { ar: "المقاسات", en: "Sizes" },
  "tab.usage": { ar: "طريقة الاستخدام", en: "How to use" },
  "tab.care": { ar: "العناية بالمنتج", en: "Care" },
  "tab.delivery": { ar: "التوصيل", en: "Delivery" },
  "tab.returns": { ar: "الاستبدال والإرجاع", en: "Returns & exchange" },

  // options
  "option.length": { ar: "الطول", en: "Length" },
  "option.width": { ar: "العرض", en: "Width" },
  "option.height": { ar: "الارتفاع", en: "Height" },
  "option.upgrade": { ar: "نوع المنتج", en: "Product type" },
  "option.size": { ar: "المقاس", en: "Size" },

  // size guide
  "sizeGuide.title": { ar: "دليل المقاسات", en: "Size guide" },
  "sizeGuide.intro": {
    ar: "المقاسات بالسنتيمتر. يمكن تصنيع مقاسات خاصة عند الطلب.",
    en: "All measurements in centimetres. Custom sizes available on request.",
  },
  "sizeGuide.name": { ar: "اسم المقاس", en: "Size name" },
  "sizeGuide.length": { ar: "الطول", en: "Length" },
  "sizeGuide.width": { ar: "العرض", en: "Width" },
  "sizeGuide.height": { ar: "الارتفاع", en: "Height" },
  "sizeGuide.usage": { ar: "الاستخدام", en: "Best for" },

  // collections
  "collection.all": { ar: "كل المنتجات", en: "All products" },
  "collection.filters": { ar: "الفلاتر", en: "Filters" },
  "collection.sort": { ar: "ترتيب", en: "Sort" },
  "collection.sortFeatured": { ar: "المميزة", en: "Featured" },
  "collection.sortPriceAsc": { ar: "السعر: من الأقل للأعلى", en: "Price: low to high" },
  "collection.sortPriceDesc": { ar: "السعر: من الأعلى للأقل", en: "Price: high to low" },
  "collection.sortNewest": { ar: "الأحدث", en: "Newest" },
  "collection.sortRating": { ar: "الأعلى تقييمًا", en: "Top rated" },
  "collection.count": { ar: "منتج", en: "products" },
  "collection.loadMore": { ar: "عرض المزيد", en: "Load more" },
  "collection.clearFilters": { ar: "إزالة الفلاتر", en: "Clear filters" },
  "collection.applyFilters": { ar: "تطبيق", en: "Apply" },
  "collection.price": { ar: "السعر", en: "Price" },
  "collection.availability": { ar: "التوفر", en: "Availability" },
  "collection.inStockOnly": { ar: "المتوفر فقط", en: "In stock only" },
  "collection.material": { ar: "الخامة", en: "Material" },
  "collection.firmness": { ar: "درجة الصلابة", en: "Firmness" },
  "collection.empty": {
    ar: "لا توجد منتجات مطابقة لاختياراتك",
    en: "No products match your selection",
  },
  "collection.emptyHint": {
    ar: "جرب تغيير الفلاتر أو استعرض كل المنتجات.",
    en: "Try changing the filters or browse all products.",
  },

  "firmness.soft": { ar: "لينة", en: "Soft" },
  "firmness.medium": { ar: "متوسطة", en: "Medium" },
  "firmness.medium-firm": { ar: "متوسطة إلى صلبة", en: "Medium firm" },
  "firmness.firm": { ar: "صلبة", en: "Firm" },

  // search
  "search.title": { ar: "البحث", en: "Search" },
  "search.placeholder": {
    ar: "ابحث عن مرتبة، وسادة، مقاس...",
    en: "Search mattresses, pillows, sizes…",
  },
  "search.results": { ar: "نتائج البحث", en: "Search results" },
  "search.resultsFor": { ar: "نتائج البحث عن", en: "Results for" },
  "search.empty": { ar: "لم نجد نتائج مطابقة لبحثك", en: "We couldn't find any matches" },
  "search.emptyHint": {
    ar: "جرب كلمة أخرى أو تصفح الأقسام الشهيرة.",
    en: "Try another keyword or browse popular searches.",
  },
  "search.popular": { ar: "الأكثر بحثًا", en: "Popular searches" },
  "search.viewAllResults": { ar: "عرض كل النتائج", en: "View all results" },

  // cart
  "cart.title": { ar: "سلة التسوق", en: "Shopping cart" },
  "cart.empty": { ar: "سلة التسوق فارغة", en: "Your cart is empty" },
  "cart.emptyHint": {
    ar: "أضف منتجاتك المفضلة وابدأ رحلة نوم أفضل.",
    en: "Add your favourite products and start sleeping better.",
  },
  "cart.startShopping": { ar: "ابدأ التسوق", en: "Start shopping" },
  "cart.subtotal": { ar: "المجموع الفرعي", en: "Subtotal" },
  "cart.shipping": { ar: "التوصيل", en: "Shipping" },
  "cart.total": { ar: "الإجمالي", en: "Total" },
  "cart.checkout": { ar: "إتمام الطلب", en: "Checkout" },
  "cart.viewCart": { ar: "عرض السلة", en: "View cart" },
  "cart.remove": { ar: "حذف", en: "Remove" },
  "cart.moveToWishlist": { ar: "نقل إلى المفضلة", en: "Move to wishlist" },
  "cart.freeShipping": { ar: "مجاني", en: "Free" },
  "cart.itemsCount": { ar: "عنصر", en: "items" },
  "cart.continueShopping": { ar: "متابعة التسوق", en: "Continue shopping" },

  // wishlist
  "wishlist.title": { ar: "المفضلة", en: "Wishlist" },
  "wishlist.empty": { ar: "قائمة المفضلة فارغة", en: "Your wishlist is empty" },
  "wishlist.emptyHint": {
    ar: "احفظ المنتجات التي تفكر بها للرجوع إليها لاحقًا.",
    en: "Save products you are considering and come back later.",
  },
  "wishlist.moveToCart": { ar: "أضف إلى السلة", en: "Add to cart" },

  // checkout
  "checkout.title": { ar: "إتمام الطلب", en: "Checkout" },
  "checkout.step1": { ar: "بيانات العميل", en: "Customer information" },
  "checkout.step2": { ar: "عنوان التوصيل", en: "Delivery address" },
  "checkout.step3": { ar: "طريقة الشحن", en: "Shipping method" },
  "checkout.step4": { ar: "طريقة الدفع", en: "Payment method" },
  "checkout.step5": { ar: "مراجعة الطلب", en: "Order review" },
  "checkout.fullName": { ar: "الاسم بالكامل", en: "Full name" },
  "checkout.phone": { ar: "رقم الهاتف", en: "Phone number" },
  "checkout.email": { ar: "البريد الإلكتروني", en: "Email address" },
  "checkout.governorate": { ar: "المحافظة", en: "Governorate" },
  "checkout.city": { ar: "المدينة", en: "City" },
  "checkout.street": { ar: "العنوان بالتفصيل", en: "Detailed address" },
  "checkout.notes": { ar: "ملاحظات الطلب", en: "Order notes" },
  "checkout.optional": { ar: "اختياري", en: "optional" },
  "checkout.shippingStandard": { ar: "التوصيل القياسي", en: "Standard delivery" },
  "checkout.shippingStandardText": { ar: "٢ إلى ٥ أيام عمل", en: "2–5 working days" },
  "checkout.shippingExpress": { ar: "التوصيل السريع", en: "Express delivery" },
  "checkout.shippingExpressText": { ar: "٢٤ إلى ٤٨ ساعة", en: "24–48 hours" },
  "checkout.cod": { ar: "الدفع عند الاستلام", en: "Cash on delivery" },
  "checkout.codText": {
    ar: "ادفع نقدًا عند تسليم الطلب.",
    en: "Pay in cash when your order arrives.",
  },
  "checkout.card": { ar: "الدفع الإلكتروني", en: "Online payment" },
  "checkout.cardText": { ar: "سيتم إتاحته قريبًا.", en: "Coming soon." },
  "checkout.next": { ar: "التالي", en: "Next" },
  "checkout.back": { ar: "رجوع", en: "Back" },
  "checkout.placeOrder": { ar: "تأكيد الطلب", en: "Place order" },
  "checkout.orderSummary": { ar: "ملخص الطلب", en: "Order summary" },
  "checkout.emptyCart": {
    ar: "لا يمكن إتمام الطلب وسلة التسوق فارغة.",
    en: "You can't check out with an empty cart.",
  },
  "checkout.failed": {
    ar: "تعذر إتمام الطلب، حاول مرة أخرى.",
    en: "We couldn't place your order. Please try again.",
  },

  // confirmation
  "confirm.title": { ar: "تم استلام طلبك بنجاح", en: "Your order has been received" },
  "confirm.text": {
    ar: "سنتواصل معك لتأكيد التفاصيل قبل التوصيل.",
    en: "We'll contact you to confirm the details before delivery.",
  },
  "confirm.orderNumber": { ar: "رقم الطلب", en: "Order number" },
  "confirm.products": { ar: "المنتجات", en: "Products" },
  "confirm.deliveryAddress": { ar: "عنوان التوصيل", en: "Delivery address" },
  "confirm.paymentMethod": { ar: "طريقة الدفع", en: "Payment method" },
  "confirm.backToStore": { ar: "العودة إلى المتجر", en: "Back to store" },
  "confirm.notFound": { ar: "لم نجد هذا الطلب", en: "Order not found" },

  // account
  "account.title": { ar: "حسابي", en: "My account" },
  "account.login": { ar: "تسجيل الدخول", en: "Log in" },
  "account.register": { ar: "إنشاء حساب", en: "Create account" },
  "account.logout": { ar: "تسجيل الخروج", en: "Log out" },
  "account.orders": { ar: "طلباتي", en: "Orders" },
  "account.profile": { ar: "بياناتي", en: "Profile" },
  "account.addresses": { ar: "العناوين", en: "Addresses" },
  "account.password": { ar: "كلمة المرور", en: "Password" },
  "account.remember": { ar: "تذكرني", en: "Remember me" },
  "account.forgot": { ar: "نسيت كلمة المرور؟", en: "Forgot password?" },
  "account.noAccount": { ar: "ليس لديك حساب؟", en: "Don't have an account?" },
  "account.hasAccount": { ar: "لديك حساب بالفعل؟", en: "Already have an account?" },
  "account.welcome": { ar: "مرحبًا", en: "Welcome" },
  "account.noOrders": { ar: "لا توجد طلبات بعد", en: "No orders yet" },
  "account.noOrdersHint": {
    ar: "طلباتك ستظهر هنا بعد أول عملية شراء.",
    en: "Your orders will appear here after your first purchase.",
  },
  "account.save": { ar: "حفظ التغييرات", en: "Save changes" },
  "account.saved": { ar: "تم حفظ البيانات", en: "Changes saved" },
  "account.loginRequired": {
    ar: "سجّل الدخول لعرض هذه الصفحة.",
    en: "Log in to view this page.",
  },
  "account.demoNote": {
    ar: "هذه نسخة تجريبية: الحسابات تُحفظ على جهازك فقط.",
    en: "Demo mode: accounts are stored on your device only.",
  },

  // forms
  "form.required": { ar: "هذا الحقل مطلوب", en: "This field is required" },
  "form.invalidEmail": { ar: "بريد إلكتروني غير صحيح", en: "Invalid email address" },
  "form.invalidPhone": { ar: "رقم هاتف غير صحيح", en: "Invalid phone number" },
  "form.shortPassword": {
    ar: "كلمة المرور يجب أن تكون ٦ أحرف على الأقل",
    en: "Password must be at least 6 characters",
  },
  "form.submit": { ar: "إرسال", en: "Submit" },
  "form.sending": { ar: "جارٍ الإرسال...", en: "Sending…" },

  // pages
  "page.about": { ar: "من نحن", en: "About us" },
  "page.contact": { ar: "تواصل معنا", en: "Contact us" },
  "page.faq": { ar: "الأسئلة الشائعة", en: "FAQ" },
  "page.terms": { ar: "الشروط والأحكام", en: "Terms & conditions" },
  "page.returns": { ar: "سياسة الإرجاع", en: "Return policy" },
  "page.shipping": { ar: "سياسة التوصيل", en: "Shipping policy" },

  // footer
  "footer.company": { ar: "عن الشركة", en: "Company" },
  "footer.products": { ar: "المنتجات", en: "Products" },
  "footer.support": { ar: "خدمة العملاء", en: "Customer service" },
  "footer.contact": { ar: "تواصل معنا", en: "Get in touch" },
  "footer.address": {
    ar: "كفر الزيات، محافظة الغربية، مصر",
    en: "Kafr El Zayat, Gharbia, Egypt",
  },
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  "footer.social": { ar: "تابعنا", en: "Follow us" },

  // generic
  "common.currency": { ar: "ج.م", en: "EGP" },
  "common.loading": { ar: "جارٍ التحميل...", en: "Loading…" },
  "common.error": { ar: "حدث خطأ غير متوقع", en: "Something went wrong" },
  "common.retry": { ar: "إعادة المحاولة", en: "Try again" },
  "common.home": { ar: "الرئيسية", en: "Home" },
  "common.breadcrumb": { ar: "مسار التنقل", en: "Breadcrumb" },
  "common.next": { ar: "التالي", en: "Next" },
  "common.previous": { ar: "السابق", en: "Previous" },
  "common.page": { ar: "صفحة", en: "Page" },
  "common.notFound": { ar: "الصفحة غير موجودة", en: "Page not found" },
  "common.notFoundHint": {
    ar: "الرابط الذي تحاول الوصول إليه غير متاح.",
    en: "The page you are looking for is not available.",
  },
  "common.offline": {
    ar: "تعذر الاتصال بالشبكة، تحقق من الإنترنت.",
    en: "Network error, please check your connection.",
  },
} as const;

export type TranslationKey = keyof typeof dict;

export function t(locale: Locale, key: TranslationKey): string {
  return dict[key][locale];
}

export function translator(locale: Locale) {
  return (key: TranslationKey) => t(locale, key);
}
