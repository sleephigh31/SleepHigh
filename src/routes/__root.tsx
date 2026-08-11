import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { usePWA } from "@/components/common/PWAInstallPrompt";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SpeedInsights } from "@vercel/speed-insights/react";

export function NotFoundComponent() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background px-4 dir-rtl font-sans"
      dir="rtl"
    >
      <div className="max-w-md text-center space-y-3">
        <p className="text-8xl font-black text-brand">404</p>
        <h1 className="text-2xl font-bold text-foreground">الصفحة غير موجودة</h1>
        <p className="text-sm text-muted-foreground">هذه الصفحة غير موجودة أو تم نقلها.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-brand px-6 py-2.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background px-4 dir-rtl font-sans"
      dir="rtl"
    >
      <div className="max-w-md text-center space-y-3">
        <p className="text-6xl">⚠️</p>
        <h1 className="text-xl font-bold text-foreground">حدث خطأ غير متوقع</h1>
        <p className="text-sm text-muted-foreground">
          شيء ما خطأ في تحميل هذه الصفحة. تأكد من اتصالك بالإنترنت أو حاول مرة أخرى.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-brand-foreground transition-colors hover:bg-brand-hover"
          >
            حاول مرة أخرى
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "سليب هاي مصر - Mrtb & Pillows | SleepHigh Egyptian Bedding" },
      {
        name: "description",
        content:
          "سليب هاي - العلامة التجارية المصرية الأولى المتخصصة في المراتب الطبية والسوست والوسائد الفاخرة بجودة فندقية.",
      },
      { name: "author", content: "SleepHigh Egypt" },
      { name: "theme-color", content: "#C8102E" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "سليب هاي" },
      { property: "og:title", content: "سليب هاي مصر - SleepHigh Egyptian Bedding" },
      {
        property: "og:description",
        content:
          "تسوق أفضل المراتب الطبية والوسائد ومستلزمات النوم الفاخرة مع ضمان حقيقي وتوصيل لجميع المحافظات.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "سليب هاي مصر" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@SleepHighEG" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/icons/icon-192.svg" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <SpeedInsights />
    </QueryClientProvider>
  );
}
