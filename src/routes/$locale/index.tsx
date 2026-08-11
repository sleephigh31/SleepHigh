import { useEffect, useState, useRef, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, ChevronLeft, ChevronRight, ShoppingBag, CheckCircle } from "lucide-react";
import { featuredProducts } from "@/lib/services/firebase/productService";
import { listCategories } from "@/lib/services/firebase/categoryService";
import { getHomepageSections } from "@/lib/services/firebase/homepageService";
import { submitSiteMessage } from "@/lib/services/firebase/messageService";
import confetti from "canvas-confetti";
import { useHref } from "@/lib/locale";
import type { Category, Product, HomepageSection, HeroSlide } from "@/lib/types";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/$locale/")({
  component: StorefrontHomePage,
});

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=60&w=400&auto=format&fit=crop";

const TESTIMONIALS = [
  {
    id: "1",
    name: "سارة",
    city: "القاهرة",
    rating: 5,
    body: "المرتبة اللي اشتريتها من سليب هاي غيّرت تجربة نومي تمامًا. مريحة جدًا، وبصحى كل يوم حاسة بالانتعاش. الجودة ممتازة.",
  },
  {
    id: "2",
    name: "أحمد",
    city: "الإسكندرية",
    rating: 5,
    body: "أفضل استثمار عملته لراحتي. الوسائد الطبية ممتازة جداً وتدعم الرقبة بشكل مثالي، وخدمة العملاء كانت راقية.",
  },
  {
    id: "3",
    name: "محمود",
    city: "الجيزة",
    rating: 5,
    body: "جودة المراتب تفوق التوقعات، السعر مقابل الجودة ممتاز. التوصيل كان سريع جداً ومندوب التوصيل كان متعاون.",
  },
  {
    id: "4",
    name: "منى",
    city: "المنصورة",
    rating: 5,
    body: "الخامات المستخدمة فخمة جداً، بحس إني نايمة في فندق 5 نجوم. شكراً سليب هاي على الجودة الرائعة.",
  },
];

const BENEFITS = [
  {
    icon: "verified",
    title: "جودة لا تتنازل",
    desc: "نحن ملتزمون بتقديم منتجات عالية الجودة، مصنوعة بعناية للتفاصيل والدقة. التزامنا بالتفوق يضمن أن كل عنصر مصنوع ليتجاوز توقعاتك مما يوفر لك راحة لا مثيل لها.",
  },
  {
    icon: "handshake",
    title: "حرفية يدوية",
    desc: "تم صنع كل منتجاتنا بحب من قبل حرفيين ماهرين يضعون خبرتهم وشغفهم في كل تفصيلة. هذا الحس الحرفي يضمن مستوى من الحرفية والتميز يميز منتجاتنا مما يرتقي بتجربتك.",
  },
  {
    icon: "price_check",
    title: "رفاهية بأسعار معقولة",
    desc: "نحن نعتقد أن الرفاهية لا يجب أن تأتي بسعر مرتفع. لهذا السبب نقدم منتجاتنا الاستثنائية بأسعار معقولة، مما يجعل الجودة والراحة متاحة للجميع.",
  },
  {
    icon: "local_shipping",
    title: "تكنولوجيا حديثة",
    desc: "نستغل قوة الآلات عالية التقنية لتعزيز عمليات تصنيعنا من خلال دمج التقنيات المتقدمة، نضمن الدقة والكفاءة والاستمرارية في إنتاج منتجاتنا.",
  },
];

/* ── Hero Slider ───────────────────────────────────────────────── */
function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const href = useHref();

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative h-[600px] md:h-[700px] w-full bg-[#e5e2e1] overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={slide.id || idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img
            src={slide.image || FALLBACK_IMAGE}
            alt={slide.headingAr}
            width={1440}
            height={700}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={idx === 0 ? "high" : "low"}
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-linear ${
              idx === current ? "scale-105" : "scale-100"
            }`}
          />
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4 max-w-4xl mx-auto mt-8 md:mt-0">
            <h1
              className={`text-4xl md:text-5xl lg:text-[56px] font-bold mb-6 leading-tight transition-all duration-700 transform ${
                idx === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {slide.headingAr}
            </h1>
            <p
              className={`text-base md:text-lg lg:text-xl mb-10 text-white/90 max-w-2xl transition-all duration-700 delay-100 transform ${
                idx === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              {slide.descriptionAr}
            </p>
            {slide.buttonTextAr && slide.buttonLink && (
              <Link
                to={href(slide.buttonLink)}
                className={`inline-block bg-white text-black px-8 py-3.5 rounded-full hover:bg-[#b90015] hover:text-white transition-colors duration-300 font-bold tracking-wide shadow-lg transform delay-200 ${
                  idx === current ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {slide.buttonTextAr}
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`transition-all duration-300 rounded-full h-2.5 ${
                idx === current ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`شريحة ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Testimonial Slider ────────────────────────────────────────── */
function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const go = useCallback(
    (nextIndex: number, dir: "left" | "right") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActive(nextIndex);
        setAnimating(false);
      }, 350);
    },
    [animating],
  );

  const next = () => go((active + 1) % TESTIMONIALS.length, "left");
  const prev = () => go((active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length, "right");

  const t = TESTIMONIALS[active];

  /* slide-in/slide-out keyframes via inline style trick */
  const slideClass = animating
    ? direction === "left"
      ? "opacity-0 translate-x-8"
      : "opacity-0 -translate-x-8"
    : "opacity-100 translate-x-0";

  return (
    <div className="relative bg-[#fcf9f8] p-8 md:p-16 rounded-[2rem] shadow-sm border border-[#e7bdb8]/20 overflow-visible mx-auto max-w-4xl">
      {/* Stars */}
      <div className="flex justify-center text-[#f1c100] mb-8 gap-1">
        {Array.from({ length: t?.rating || 5 }).map((_, i) => (
          <Star key={i} className="h-6 w-6 fill-current" />
        ))}
      </div>

      {/* Animated content */}
      <div
        className={`transition-all duration-350 ease-in-out ${slideClass} min-h-[140px] flex flex-col items-center justify-center`}
        style={{ transitionDuration: "350ms" }}
      >
        <p className="text-lg md:text-2xl leading-relaxed font-medium mb-8 text-[#1c1b1b] text-center max-w-3xl">
          "{t?.body}"
        </p>
        <div className="flex flex-col items-center gap-1.5">
          <span className="font-bold text-[#1c1b1b] text-lg">{t?.name}</span>
          <span className="text-sm text-[#926f6b] font-medium">{t?.city}</span>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2.5 mt-10">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > active ? "left" : "right")}
            className={`transition-all duration-300 rounded-full ${
              i === active
                ? "w-8 h-2.5 bg-[#b90015]"
                : "w-2.5 h-2.5 bg-[#e7bdb8] hover:bg-[#926f6b]"
            }`}
            aria-label={`آراء العميل ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrow buttons — desktop */}
      <button
        onClick={prev}
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-6 w-14 h-14 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] items-center justify-center text-[#5d3f3c] hover:text-[#b90015] hover:scale-110 transition-all border border-transparent hover:border-[#e7bdb8]/40 z-10"
        aria-label="السابق"
      >
        <ChevronRight className="h-6 w-6 ml-1" />
      </button>
      <button
        onClick={next}
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-6 w-14 h-14 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] items-center justify-center text-[#5d3f3c] hover:text-[#b90015] hover:scale-110 transition-all border border-transparent hover:border-[#e7bdb8]/40 z-10"
        aria-label="التالي"
      >
        <ChevronLeft className="h-6 w-6 mr-1" />
      </button>

      {/* Mobile nav buttons */}
      <div className="flex justify-center gap-6 mt-8 md:hidden">
        <button
          onClick={prev}
          className="flex w-12 h-12 bg-white rounded-full shadow-md items-center justify-center text-[#5d3f3c] hover:text-[#b90015] hover:bg-[#fcf9f8] transition-all"
          aria-label="السابق"
        >
          <ChevronRight className="h-6 w-6 ml-1" />
        </button>
        <button
          onClick={next}
          className="flex w-12 h-12 bg-white rounded-full shadow-md items-center justify-center text-[#5d3f3c] hover:text-[#b90015] hover:bg-[#fcf9f8] transition-all"
          aria-label="التالي"
        >
          <ChevronLeft className="h-6 w-6 mr-1" />
        </button>
      </div>
    </div>
  );
}

/* ── Product Card ──────────────────────────────────────────────── */
function ProductCard({
  product,
  href,
  addToCart,
  aspectClass = "aspect-square",
  objectFit = "contain",
}: {
  product: Product;
  href: (path: string) => string;
  addToCart: (id: string, variantId: string, qty: number) => void;
  aspectClass?: string | undefined;
  objectFit?: "contain" | "cover" | undefined;
}) {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-gray-100 flex flex-col relative h-full">
      <Link
        to={href(`/products/${product.slug}`)}
        className={`block relative ${aspectClass} overflow-hidden bg-[#f9f9f9] p-6 shrink-0 flex items-center justify-center`}
      >
        <img
          src={product.images[0]?.src || FALLBACK_IMAGE}
          alt={product.name.ar}
          width={600}
          height={600}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-${objectFit} group-hover:scale-110 transition-transform duration-700 ease-out mix-blend-multiply`}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      <div className="p-5 text-right flex flex-col flex-1 bg-white relative">
        <Link to={href(`/products/${product.slug}`)} className="block flex-1 mb-2">
          <h3 className="font-bold text-lg text-[#1c1b1b] line-clamp-2 leading-snug group-hover:text-[#b90015] transition-colors">
            {product.name.ar}
          </h3>
        </Link>
        <div className="flex justify-end text-[#f1c100] mb-3 gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <button
            onClick={() => addToCart(product.id, product.variants?.[0]?.id || "", 1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f6f3f2] text-[#5d3f3c] hover:bg-[#b90015] hover:text-white transition-colors"
            aria-label="أضف إلى السلة"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
          <p className="text-[#b90015] font-black text-lg">{product.price.toLocaleString()} ج.م</p>
        </div>
      </div>
    </div>
  );
}

/* ── Product Carousel (mobile-first) ──────────────────────────── */
function ProductCarousel({
  products,
  href,
  addToCart,
  aspectClass,
  objectFit,
}: {
  products: Product[];
  href: (path: string) => string;
  addToCart: (id: string, variantId: string, qty: number) => void;
  aspectClass?: string;
  objectFit?: "contain" | "cover";
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  return (
    <div>
      {/* Mobile: horizontal scroll carousel with smooth snapping */}
      <div className="md:hidden relative -mx-5 px-5">
        <div
          ref={trackRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 pt-2 scrollbar-hide"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="snap-center shrink-0 w-[80vw] max-w-[300px] transform transition-transform duration-300"
            >
              <ProductCard
                product={product}
                href={href}
                addToCart={addToCart}
                aspectClass={aspectClass}
                objectFit={objectFit}
              />
            </div>
          ))}
          {/* Spacer for last item to snap correctly */}
          <div className="snap-center shrink-0 w-[5vw]" />
        </div>
      </div>

      {/* Desktop: 4-column grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={href}
            addToCart={addToCart}
            aspectClass={aspectClass}
            objectFit={objectFit}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Newsletter Section ────────────────────────────────────────── */
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    const res = await submitSiteMessage({
      name: "مشترك النشرة البريدية",
      phone: "غير متوفر",
      email: email,
      subject: "طلب اشتراك في النشرة البريدية",
      message: `يرغب ${email} في الاشتراك في النشرة البريدية لتلقي العروض.`,
    });

    if (res.ok) {
      setStatus("success");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#b90015", "#ffffff", "#f1c100", "#1c1b1b"],
      });
    } else {
      setStatus("error");
    }
  };

  return (
    <section className="max-w-[1280px] mx-auto px-5 md:px-[64px] py-16 md:py-24">
      <div className="bg-[#1c1b1b] text-white p-10 md:p-16 rounded-[2rem] flex flex-col md:flex-row items-center justify-between shadow-xl gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="text-center md:text-right md:w-1/2 relative z-10">
          <h3 className="text-3xl md:text-[40px] font-bold mb-4">كن أول من يعرف</h3>
          <p className="text-gray-300 text-base md:text-lg">
            احصل على الوصول المبكر وخصم على قائمة الرغبات وأكثر من ذلك. خصوصيتك هي سياستنا.
          </p>
        </div>
        <div className="w-full md:w-1/2 relative z-10">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center space-y-4 bg-white/10 p-8 rounded-2xl border border-white/20 animate-in fade-in zoom-in duration-500">
              <CheckCircle className="h-16 w-16 text-green-400" />
              <h4 className="text-2xl font-bold text-white text-center">شكرًا لاشتراكك!</h4>
              <p className="text-gray-200 text-center text-lg">
                سيتم إرسال كل العروض الحصرية والأخبار مباشرة إلى بريدك الإلكتروني.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-grow px-6 py-4 rounded-full text-right focus:outline-none text-black bg-white placeholder:text-gray-400 font-medium disabled:opacity-70"
                placeholder="اكتب عنوان بريدك الإلكتروني"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-[#b90015] text-white px-10 py-4 rounded-full hover:bg-white hover:text-[#b90015] transition-colors duration-300 font-bold whitespace-nowrap shadow-lg disabled:opacity-70"
              >
                {status === "loading" ? "جاري الاشتراك..." : "اشترك"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-400 mt-3 text-sm text-center md:text-right">
              حدث خطأ، يرجى المحاولة مرة أخرى.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
function StorefrontHomePage() {
  const href = useHref();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageSection[]>([]);
  const { addToCart, user, requestLogin } = useStore();

  const handleAddToCart = (id: string, variantId: string, qty: number) => {
    if (!user) {
      requestLogin();
      return;
    }
    addToCart(id, variantId, qty);
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [prods, cats, sections] = await Promise.all([
          featuredProducts(12),
          listCategories(),
          getHomepageSections(),
        ]);
        if (cancelled) return;
        setProducts(prods);
        setCategories(cats);
        setHomepageData(sections);
      } catch (err) {
        console.error("Failed to load storefront home data", err);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const mattresses = products.filter((p) => p.category === "mattresses").slice(0, 4);
  const pillows = products.filter((p) => p.category === "pillows").slice(0, 4);
  const displayMattresses = mattresses.length > 0 ? mattresses : products.slice(0, 4);
  const displayPillows = pillows.length > 0 ? pillows : products.slice(0, 4);

  const heroSection = homepageData.find((s) => s.id === "hero" && s.active);
  const slides = (heroSection?.content?.["slides"] as HeroSlide[]) || [];

  return (
    <>
      <div
        dir="rtl"
        className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-sans selection:bg-[#ffdad6]"
      >
        {/* ── HERO ─────────────────────────────────────────────── */}
        {heroSection && slides.length > 0 && <HeroSlider slides={slides} />}

        {/* ── CATEGORIES ───────────────────────────────────────── */}
        <section className="max-w-[1280px] mx-auto px-5 md:px-[64px] py-16 md:py-24">
          <h2 className="text-center text-3xl md:text-[36px] font-bold mb-14 text-[#1c1b1b]">
            اكتشف منتجاتنا
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((cat, i) => (
              <Link
                key={cat.handle || i}
                to={href(`/collections/${cat.handle}`)}
                className="group block text-center"
              >
                <div className="overflow-hidden mb-6 rounded-2xl bg-[#f6f3f2] aspect-[4/3] shadow-sm group-hover:shadow-lg transition-all duration-500">
                  <img
                    src={cat.image || FALLBACK_IMAGE}
                    alt={cat.name.ar}
                    width={600}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-[#b90015] transition-colors text-[#1c1b1b]">
                  {cat.name.ar}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* ── MATTRESSES ───────────────────────────────────────── */}
        <section className="bg-[#f6f3f2] py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-5 md:px-[64px]">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-[36px] font-bold mb-4 text-[#1c1b1b]">المراتب</h2>
              <p className="text-[#5d3f3c] max-w-2xl mx-auto text-base md:text-lg">
                استكشف مجموعتنا المتنوعة من المراتب المصممة لتناسب احتياجاتك الخاصة لتجربة نوم مريحة
                ومجددة
              </p>
            </div>
            <ProductCarousel
              products={displayMattresses}
              href={href}
              addToCart={handleAddToCart}
              aspectClass="aspect-square"
              objectFit="contain"
            />
          </div>
        </section>

        {/* ── PILLOWS ──────────────────────────────────────────── */}
        <section className="py-20 md:py-28">
          <div className="max-w-[1280px] mx-auto px-5 md:px-[64px]">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-[36px] font-bold mb-4 text-[#1c1b1b]">الوسائد</h2>
              <p className="text-[#5d3f3c] max-w-2xl mx-auto text-base md:text-lg">
                استكشف مجموعتنا المتنوعة من الوسائد المصممة لدعم تفضيلاتك الفريدة في النوم وتعزيز
                راحتك
              </p>
            </div>
            <ProductCarousel
              products={displayPillows}
              href={href}
              addToCart={handleAddToCart}
              aspectClass="aspect-[4/3]"
              objectFit="cover"
            />
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────── */}
        <section className="bg-white py-20 md:py-28 border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-5">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-[36px] font-bold mb-4 text-[#1c1b1b]">
                آراء العملاء
              </h2>
              <p className="text-[#5d3f3c] max-w-2xl mx-auto text-base md:text-lg">
                اكتشف سبب اختيار عملائنا لـ سليب هاي. استمع إلى قصصهم عن الراحة المحسنة والنوم
                الأفضل
              </p>
            </div>
            <TestimonialSlider />
          </div>
        </section>

        {/* ── BENEFITS ─────────────────────────────────────────── */}
        <section className="py-20 max-w-[1280px] mx-auto px-5 md:px-[64px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="px-2">
                <div className="flex justify-center mb-6 text-[#b90015] bg-[#f6f3f2] w-20 h-20 mx-auto rounded-full items-center shadow-sm">
                  <Star className="h-10 w-10 stroke-[1.5]" />
                </div>
                <h4 className="font-bold mb-3 text-[#1c1b1b] text-base md:text-lg">
                  {benefit.title}
                </h4>
                <p className="text-sm text-[#5d3f3c] leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── NEWSLETTER ───────────────────────────────────────── */}
        <NewsletterSection />
      </div>
    </>
  );
}
