import { createFileRoute, Link } from "@tanstack/react-router";
import { useLocalized, useDir, useHref } from "@/lib/locale";
import type { Order } from "@/lib/types";
import { CheckCircle2, ChevronRight, ChevronLeft, Package, Clock, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/$locale/checkout/confirmation")({
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const L = useLocalized();
  const dir = useDir();
  const href = useHref();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) {
        setOrder(JSON.parse(raw) as Order);
        sessionStorage.removeItem("lastOrder");
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  return (
    <div
      className={cn(
        "container-page py-16 space-y-12 max-w-4xl",
        dir === "rtl" ? "dir-rtl" : "dir-ltr",
      )}
    >
      <div className="text-center space-y-6">
        <div className="mx-auto h-24 w-24 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-foreground">شكراً لطلبك!</h1>
          <p className="text-lg text-muted-foreground">تم استلام طلبك بنجاح وجاري تجهيزه.</p>
        </div>
      </div>

      {order && (
        <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <p className="text-sm font-bold text-muted-foreground">رقم الطلب</p>
              <p className="text-xl font-black font-mono mt-1 text-foreground">#{order.number}</p>
            </div>
            <div className="text-end">
              <p className="text-sm font-bold text-muted-foreground">تاريخ الطلب</p>
              <p className="text-base font-bold mt-1 text-foreground">
                {new Date(order.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Package className="h-5 w-5 text-brand" />
                <span>المنتجات المطلوبة ({order.lines.length})</span>
              </h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 hide-scrollbar">
                {order.lines.map((line, idx) => (
                  <div key={idx} className="flex gap-4">
                    <img
                      src={line.image}
                      alt={L(line.name)}
                      className="h-16 w-16 rounded-xl object-cover border border-border bg-muted"
                    />
                    <div>
                      <h4 className="text-sm font-bold">{L(line.name)}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Object.values(line.options).join(" - ")} x {line.quantity}
                      </p>
                      <p className="text-sm font-bold text-brand mt-1">
                        {(line.unitPrice * line.quantity).toLocaleString("ar-EG")} ج.م
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 md:border-s border-border md:ps-8">
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-brand" />
                  <span>طريقة الدفع</span>
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "بطاقة ائتمانية"}
                  {order.paymentMethod === "cod" && (
                    <span className="block mt-1 text-xs">
                      سيتم تحصيل المبلغ نقداً عند تسليم الطلب.
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-brand" />
                  <span>ملخص التكلفة</span>
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>المجموع الفرعي</span>
                    <span className="font-bold text-foreground">
                      {order.subtotal.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>الشحن</span>
                    <span className="font-bold text-foreground">
                      {order.shipping === 0
                        ? "مجاني"
                        : `${order.shipping.toLocaleString("ar-EG")} ج.م`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between items-end mt-2">
                    <span className="font-bold text-base text-foreground">الإجمالي</span>
                    <span className="text-xl font-black text-brand">
                      {order.total.toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {order?.userId && (
          <Link
            to={href("/account/orders")}
            className="w-full sm:w-auto text-center rounded-xl border border-border bg-card px-8 py-3 font-bold text-foreground hover:bg-muted transition-colors"
          >
            متابعة حالة الطلب
          </Link>
        )}
        <Link
          to={href("/")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3 font-bold text-brand-foreground hover:bg-brand-hover transition-colors shadow-md"
        >
          <span>العودة للرئيسية</span>
          {dir === "rtl" ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Link>
      </div>
    </div>
  );
}
