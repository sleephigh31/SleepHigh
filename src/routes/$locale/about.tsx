import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, ShieldCheck, Factory, HeartHandshake, ChevronLeft } from "lucide-react";
import { useHref } from "@/lib/locale";

export const Route = createFileRoute("/$locale/about")({
  component: AboutPage,
});

function AboutPage() {
  const href = useHref();

  return (
    <div className="container-page py-12 space-y-16 dir-rtl text-foreground">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-[#990011] text-white p-8 md:p-16 space-y-6 shadow-xl">
        <span className="inline-block rounded-full bg-red-500/20 px-3.5 py-1 text-xs font-bold text-red-300 border border-red-500/30">
          قصة ريادة وسعادة النوم الفاخر
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl">
          سليب هاي — جودة مصرية بمواصفات عالمية في عالم المراتب والمفروشات
        </h1>
        <p className="text-xs md:text-base text-gray-300 max-w-3xl leading-relaxed">
          نحن في سليب هاي نؤمن بأن اليوم الجيد يبدأ بنوم عميق ومريح. منذ انطلاقتنا، كرّسنا خبراتنا
          وتطويرنا المستمر لتقديم أفضل المراتب والوسائد المصنّعة بأجود الخامات المصرية والعالمية.
        </p>
      </div>

      {/* BRAND VALUES GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-[#C8102E]">
            <Factory className="h-6 w-6" />
          </div>
          <h3 className="font-black text-base text-gray-900">مصانع متطورة</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            خطوط إنتاج آلية تعتمد أحدث تقنيات تشكيل السوست والفوم لضمان أعلى معايير الجودة والمتانة.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-[#C8102E]">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="font-black text-base text-gray-900">ضمان 10 سنوات</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            ثقتنا في منتجاتنا تمنحك ضماناً مصنعياً حقيقياً ضد أي هبوط أو عيوب تصنيع طويلة المدى.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-[#C8102E]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-black text-base text-gray-900">قطن مصري 100%</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            نستخدم أقمشة قطنية مصرية فائقة النعومة والتهوية ومضادة للبكتيريا لراحة بشرتك.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-[#C8102E]">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <h3 className="font-black text-base text-gray-900">خدمة العملاء</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            فريق متخصص لمساعدتك في اختيار المرتبة الأنسب لوزنك وطبيعة نومك مع التوصيل والمعاينة.
          </p>
        </div>
      </div>

      {/* BOTTOM CALL TO ACTION */}
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <h3 className="text-xl md:text-2xl font-black text-gray-900">
            هل أنت جاهز لتجربة النوم الفندقي الفاخر؟
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            تصفح تشكيلتنا الكاملة الآن أو تواصل مع أحد خبراء النوم لدينا.
          </p>
        </div>
        <Link
          to={href("/collections/mattresses")}
          className="inline-flex items-center space-x-2 space-x-reverse rounded-xl bg-[#C8102E] px-6 py-3.5 text-xs md:text-sm font-black text-white hover:bg-red-700 transition-colors shadow-md shrink-0"
        >
          <span>تصفح المراتب الآن</span>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
