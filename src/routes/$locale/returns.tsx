import { createFileRoute, Link } from "@tanstack/react-router";
import { useHref, useT } from "@/lib/locale";
import { RotateCcw, Home, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/$locale/returns")({
  component: ReturnPolicyPage,
});

function ReturnPolicyPage() {
  const href = useHref();
  const t = useT();

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
               <span>{t("common.home")}</span>
            </Link>
            <ChevronDown className="h-3 w-3 rotate-90" />
             <span className="text-white font-medium">{t("returns.title")}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">سياسة الإرجاع والاستبدال</h1>
          </div>
          <p className="text-white/60 text-sm">آخر تحديث: أغسطس 2026</p>
        </div>
      </section>

      {/* Content */}
      <article className="max-w-[900px] mx-auto px-5 md:px-8 py-10 md:py-16">
        <div className="prose-policy space-y-10">
          {/* Highlight Box */}
          <div className="bg-brand-soft border border-brand/15 rounded-2xl p-6 md:p-8">
             <p className="text-brand font-bold text-base mb-2">{t("returns.highlightTitle")}</p>
             <p className="text-foreground/80 text-sm leading-relaxed">
               {t("returns.highlightText")}
             </p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                1
              </span>
              شروط الإرجاع
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>
                   يمكنك إرجاع المنتج خلال <strong className="text-foreground">{t("returns.s1Item1Days")}</strong> من
                   تاريخ الاستلام.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                 <span>{t("returns.s1Item2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                 <span>{t("returns.s1Item3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                 <span>{t("returns.s1Item4")}</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                2
              </span>
              شروط الاستبدال
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                 <span>{t("returns.s2Item1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                <span>
                   يتم الاستبدال خلال <strong className="text-foreground">{t("returns.s2Item2End")}</strong> من تاريخ
                   الاستلام.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                 <span>{t("returns.s2Item3")}</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                3
              </span>
              حالات عدم قبول الإرجاع
            </h2>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                 <span>{t("returns.s3Item1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                 <span>{t("returns.s3Item2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand mt-2 shrink-0" />
                 <span>{t("returns.s3Item3")}</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                4
              </span>
              إجراءات الإرجاع
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="bg-surface-secondary rounded-2xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand font-black text-lg flex items-center justify-center mx-auto mb-3">
                  1
                </div>
                 <p className="text-sm font-bold text-foreground mb-1">{t("returns.step1Title")}</p>
                 <p className="text-xs text-muted-foreground">
                   {t("returns.step1Text")}
                 </p>
              </div>
              <div className="bg-surface-secondary rounded-2xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand font-black text-lg flex items-center justify-center mx-auto mb-3">
                  2
                </div>
                 <p className="text-sm font-bold text-foreground mb-1">{t("returns.step2Title")}</p>
                 <p className="text-xs text-muted-foreground">
                   {t("returns.step2Text")}
                 </p>
              </div>
              <div className="bg-surface-secondary rounded-2xl p-5 text-center">
                <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand font-black text-lg flex items-center justify-center mx-auto mb-3">
                  3
                </div>
                 <p className="text-sm font-bold text-foreground mb-1">{t("returns.step3Title")}</p>
                 <p className="text-xs text-muted-foreground">
                   {t("returns.step3Text")}
                 </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                5
              </span>
              الضمان
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
               جميع مراتب سليب هاي مشمولة بضمان يصل إلى{" "}
               <strong className="text-foreground">{t("returns.s5Years")}</strong>{" "}
               {t("returns.s5TextStart")}
               {t("returns.s5TextEnd")}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand text-sm font-black flex items-center justify-center">
                6
              </span>
              تواصل معنا
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
               {t("returns.s6Text")}{" "}
               <Link to={href("/contact")} className="text-brand font-bold hover:underline">
                 {t("policy.contactLink")}
               </Link>{" "}
               {t("returns.s6TextEnd")} 01207864015
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
