import { createFileRoute, Link } from "@tanstack/react-router";
import { useHref } from "@/lib/locale";
import { Shield, Home, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/$locale/privacy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
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
            <span className="text-white font-medium">سياسة الخصوصية</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">سياسة الخصوصية</h1>
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
              مقدمة
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              نحن في سليب هاي (SleepHigh) نقدّر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه
              السياسة كيفية جمع واستخدام وحماية المعلومات التي تقدمها لنا عند استخدام موقعنا
              الإلكتروني أو خدماتنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                2
              </span>
              المعلومات التي نجمعها
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>
                  <strong className="text-foreground">معلومات الحساب:</strong> الاسم، البريد
                  الإلكتروني، رقم الهاتف عند إنشاء حساب.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>
                  <strong className="text-foreground">معلومات الطلب:</strong> عنوان التوصيل، تفاصيل
                  الدفع، وتاريخ الطلبات.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>
                  <strong className="text-foreground">معلومات التصفح:</strong> نوع المتصفح، عنوان
                  IP، الصفحات التي تمت زيارتها.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>
                  <strong className="text-foreground">معلومات التواصل:</strong> الرسائل والاستفسارات
                  المرسلة عبر نموذج الاتصال.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                3
              </span>
              كيف نستخدم معلوماتك
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>معالجة وتوصيل طلباتك.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>التواصل معك بشأن طلباتك وتقديم خدمة العملاء.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>تحسين تجربة التسوق وتخصيص المحتوى.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>إرسال العروض الترويجية (بموافقتك فقط).</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                4
              </span>
              حماية المعلومات
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              نستخدم تقنيات تشفير متقدمة وإجراءات أمنية صارمة لحماية بياناتك الشخصية. لا نشارك أو
              نبيع معلوماتك لأي أطراف خارجية إلا عند الضرورة لتنفيذ الطلبات (مثل شركات التوصيل).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                5
              </span>
              حقوقك
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>الوصول إلى بياناتك الشخصية وتعديلها أو حذفها.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>إلغاء الاشتراك في الرسائل التسويقية في أي وقت.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>طلب نسخة من بياناتك المخزنة لدينا.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                6
              </span>
              تواصل معنا
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              لأي استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر{" "}
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
