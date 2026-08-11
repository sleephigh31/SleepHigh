import { createFileRoute, Link } from "@tanstack/react-router";
import { useLocalized, useDir, useHref } from "@/lib/locale";
import { useStore, FREE_SHIPPING_THRESHOLD } from "@/lib/store";
import { QuantitySelector } from "@/components/shop/QuantitySelector";
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/$locale/cart")({
  component: CartPage,
});

function CartPage() {
  const { cartLines, subtotal, shipping, total, updateQuantity, removeLine } = useStore();
  const L = useLocalized();
  const dir = useDir();
  const href = useHref();

  return (
    <div className={cn("container-page py-12 space-y-8", dir === "rtl" ? "dir-rtl" : "dir-ltr")}>
      <h1 className="fluid-h2 font-bold text-foreground">سلة المشتريات</h1>

      {cartLines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 border border-border bg-card rounded-3xl shadow-sm">
          <div className="h-24 w-24 rounded-full bg-brand/10 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-brand" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">سلة مشترياتك فارغة</h2>
            <p className="text-muted-foreground">أضف بعض المنتجات الرائعة واستمتع بنوم مريح.</p>
          </div>
          <Link
            to={href("/collections")}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-brand-foreground hover:bg-brand-hover transition-colors"
          >
            <span>تسوق الآن</span>
            {dir === "rtl" ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
              {/* Header */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-4 p-6 border-b border-border text-sm font-bold text-muted-foreground bg-muted/20">
                <div className="sm:col-span-6">المنتج</div>
                <div className="sm:col-span-3 text-center">الكمية</div>
                <div className="sm:col-span-3 text-end">الإجمالي</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {cartLines.map((line) => (
                  <div key={line.id} className="grid sm:grid-cols-12 gap-4 p-6 items-center">
                    <div className="sm:col-span-6 flex gap-4">
                      <div className="h-24 w-24 shrink-0 rounded-2xl border border-border overflow-hidden bg-muted">
                        <img
                          src={line.product.images[0]?.src}
                          alt={
                            L(line.product.images[0]?.alt ?? { ar: "", en: "" }) ||
                            L(line.product.name)
                          }
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center space-y-1">
                        <Link
                          to={href(`/products/${line.product.slug}`)}
                          className="font-bold text-base hover:text-brand transition-colors"
                        >
                          {L(line.product.name)}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {Object.entries(line.variant.options)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" | ")}
                        </p>
                        <div className="text-sm font-bold text-foreground mt-2 sm:hidden">
                          {line.unitPrice.toLocaleString("ar-EG")} ج.م
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-3 flex items-center justify-between sm:justify-center">
                      <div className="w-28">
                        <QuantitySelector
                          value={line.quantity}
                          onChange={(q) => updateQuantity(line.id, q)}
                          max={line.variant.stock}
                          size="sm"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-3 flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0">
                      <span className="font-bold text-brand hidden sm:block">
                        {line.lineTotal.toLocaleString("ar-EG")} ج.م
                      </span>
                      <button
                        onClick={() => removeLine(line.id)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-colors sm:ms-4"
                        title="حذف المنتج"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-brand/5 border border-brand/20">
              <div className="flex items-center gap-3 text-sm font-medium text-brand">
                <Truck className="h-5 w-5" />
                <span>
                  {subtotal >= FREE_SHIPPING_THRESHOLD
                    ? "تهانينا! لقد حصلت على شحن مجاني"
                    : `أضف بـ ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("ar-EG")} ج.م للحصول على شحن مجاني`}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6 sticky top-24">
              <h2 className="text-xl font-bold border-b border-border pb-4">ملخص الطلب</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-bold">{subtotal.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="font-bold">
                    {shipping === 0 ? "مجاني" : `${shipping.toLocaleString("ar-EG")} ج.م`}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-end">
                <span className="font-bold">الإجمالي</span>
                <span className="text-2xl font-black text-brand">
                  {total.toLocaleString("ar-EG")} ج.م
                </span>
              </div>

              <div className="space-y-3 pt-4">
                <Link
                  to={href("/checkout")}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 font-bold text-brand-foreground hover:bg-brand-hover transition-colors shadow-md"
                >
                  <span>متابعة لعملية الدفع</span>
                  {dir === "rtl" ? (
                    <ArrowLeft className="h-5 w-5" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </Link>
                <Link
                  to={href("/collections")}
                  className="flex w-full items-center justify-center py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  الاستمرار في التسوق
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
                <ShieldCheck className="h-4 w-4" />
                <span>دفع آمن ومحمي 100%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
