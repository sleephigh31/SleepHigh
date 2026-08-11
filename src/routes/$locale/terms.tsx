import { createFileRoute, Link } from "@tanstack/react-router";
import { useHref } from "@/lib/locale";
import { FileText, Home, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/$locale/terms")({
  component: TermsOfUsePage,
});

function TermsOfUsePage() {
  const href = useHref();

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-[#1c1b1b] via-[#2a1f1e] to-[#1c1b1b]">
        <div className="absolute top-0 left-0 w-80 h-80 bg-brand/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="relative max-w-[900px] mx-auto px-5 md:px-8 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/50 text-sm mb-6">
            <Link
              to={href("/")}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Home className="h-3.5 w-3.5" />
              <span>الرئيسية</span>
            </Link>
            <ChevronDown className="h-3 w-3 rotate-90" />
            <span className="text-white font-medium">اتفاقية الاستخدام</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">اتفاقية الاستخدام</h1>
          </div>
          <p className="text-white/60 text-sm">آخر تحديث: أغسطس 2026</p>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-[900px] mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="prose-policy space-y-10">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                1
              </span>
              القبول بالشروط
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              باستخدامك لموقع سليب هاي (SleepHigh)، فإنك توافق على الالتزام بهذه الشروط والأحكام.
              إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع. نحتفظ بالحق في تعديل
              هذه الشروط في أي وقت.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                2
              </span>
              حساب المستخدم
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>يجب أن تكون المعلومات المقدمة عند إنشاء الحساب صحيحة ودقيقة.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>أنت مسؤول عن الحفاظ على سرية بيانات حسابك.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>يحق لنا تعليق أو إلغاء أي حساب يخالف شروط الاستخدام.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                3
              </span>
              الطلبات والدفع
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>
                  جميع الأسعار المعروضة بالجنيه المصري وتشمل ضريبة القيمة المضافة حيثما ينطبق.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>نحتفظ بالحق في تعديل الأسعار دون إشعار مسبق.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>يتم تأكيد الطلب بعد التحقق من توفر المنتج وصحة بيانات الدفع.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>نقبل الدفع عند الاستلام، فودافون كاش، والبطاقات الائتمانية.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                4
              </span>
              التوصيل
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              نوفر خدمة التوصيل لجميع محافظات مصر. مواعيد التوصيل تقديرية وقد تختلف حسب الموقع
              الجغرافي. لا نتحمل مسؤولية التأخير الناتج عن ظروف خارجة عن إرادتنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                5
              </span>
              الملكية الفكرية
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              جميع المحتويات الموجودة على هذا الموقع بما في ذلك النصوص، الصور، الشعارات، والتصميمات
              هي ملكية حصرية لـ سليب هاي ومحمية بموجب قوانين حقوق الملكية الفكرية. يُحظر نسخ أو
              إعادة إنتاج أي محتوى بدون إذن كتابي مسبق.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                6
              </span>
              تحديد المسؤولية
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              نسعى لتقديم معلومات دقيقة عن منتجاتنا، لكن لا نضمن خلو الموقع من الأخطاء. قد تختلف
              الألوان المعروضة على الشاشة عن الألوان الفعلية. مسؤوليتنا محدودة بقيمة المنتج المشترى.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                7
              </span>
              تواصل معنا
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              لأي استفسارات حول شروط الاستخدام، يمكنك التواصل معنا عبر{" "}
              <Link to={href("/contact")} className="text-brand font-bold hover:underline">
                صفحة الاتصال
              </Link>{" "}
              أو البريد الإلكتروني: info@sleephigh-eg.com
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
