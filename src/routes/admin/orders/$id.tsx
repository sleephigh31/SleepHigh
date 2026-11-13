import { useEffect, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowRight, User, MapPin, CreditCard, ShoppingBag, Save, Clock, AlertCircle } from "lucide-react";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { getOrder, updateOrderStatus, subscribeToOrder } from "@/lib/services/firebase/orderService";
import { auth } from "@/lib/firebase";
import { formatPrice } from "@/lib/format";
import { useLocale } from "@/lib/locale";
import type { Order, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/admin/orders/$id")({
  component: AdminOrderDetailPage,
});

function AdminOrderDetailPage() {
  const locale = useLocale();
  const { id } = useParams({ from: "/admin/orders/$id" });
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Subscribe in real-time so all updates in Firestore immediately reflect
    const unsub = subscribeToOrder(
      id,
      (data) => {
        if (data) {
          setOrder(data);
          setSelectedStatus(data.status);
          setNote(data.notes || "");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Order subscribe error:", err);
        // Fallback to one-time getDoc
        getOrder(id).then((fallback) => {
          if (fallback) {
            setOrder(fallback);
            setSelectedStatus(fallback.status);
            setNote(fallback.notes || "");
          }
          setLoading(false);
        });
      },
    );

    return () => unsub();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    setUpdating(true);
    setErrorMsg(null);
    setSuccessMsg(false);

    const adminId = auth.currentUser?.uid || "admin";
    const res = await updateOrderStatus(
      order.id,
      selectedStatus,
      adminId,
      note.trim() || undefined,
    );

    if (res.ok) {
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
    } else {
      setErrorMsg(res.error || "فشل تحديث حالة الطلب");
      setTimeout(() => setErrorMsg(null), 5000);
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-muted-foreground dir-rtl">
        جاري تحميل تفاصيل الطلب...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center text-xs text-muted-foreground dir-rtl">
        الطلب غير موجود.
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground dir-rtl">
      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <Link
            to="/admin/orders"
            className="rounded-lg border border-input p-2 hover:bg-accent text-muted-foreground hover:text-foreground"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <h1 className="text-xl font-bold text-foreground">الطلب {order.number}</h1>
              <span className="rounded-full bg-brand/15 px-3 py-0.5 text-xs font-bold text-brand">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              تاريخ الطلب: {new Date(order.createdAt).toLocaleString("ar-EG")}
            </p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-success/30 bg-success/10 p-3 text-xs font-bold text-success flex items-center gap-2">
          <span>تم تحديث حالة الطلب بنجاح.</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-bold text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main 2 columns */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items Table */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center space-x-2 space-x-reverse">
              <ShoppingBag className="h-4 w-4 text-brand" />
              <span>المنتجات المطلوبة ({order.lines.length})</span>
            </h3>

            <div className="divide-y divide-border">
              {order.lines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {line.image ? (
                      <img
                        src={line.image}
                        alt={line.name.ar}
                        className="h-14 w-14 rounded-xl object-cover border border-border bg-muted shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-muted border border-border flex items-center justify-center text-xs font-bold">
                        SH
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{line.name.ar}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {Object.entries(line.options)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" | ")}
                      </p>
                      <span className="text-[11px] text-muted-foreground font-semibold">
                        الكمية: {line.quantity} × {formatPrice(line.unitPrice, locale)}
                      </span>
                    </div>
                  </div>

                  <div className="font-bold text-xs text-foreground">
                    {formatPrice(line.quantity * line.unitPrice, locale)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="border-t border-border pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>المجموع الفرعي</span>
                <span>{formatPrice(order.subtotal, locale)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>مصاريف الشحن</span>
                <span>{formatPrice(order.shipping, locale)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>الخصم ({order.couponCode || "كوبون"})</span>
                  <span>-{formatPrice(order.discount, locale)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-foreground border-t border-border pt-2">
                <span>الإجمالي الكلي</span>
                <span className="text-brand">{formatPrice(order.total, locale)}</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
            <OrderTimeline history={order.statusHistory || []} />
          </div>
        </div>

        {/* Sidebar 1 column: Customer details & Status Change */}
        <div className="space-y-6">
          {/* Status Change Control */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center space-x-2 space-x-reverse">
              <Clock className="h-4 w-4 text-brand" />
              <span>تحديث حالة الطلب</span>
            </h3>

            <div>
              <label className="text-xs font-bold text-foreground">الحالة الجديدة</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs"
              >
                <option value="pending">جديد (Pending)</option>
                <option value="confirmed">تم التأكيد (Confirmed)</option>
                <option value="processing">قيد التجهيز (Processing)</option>
                <option value="shipped">تم الشحن (Shipped)</option>
                <option value="delivered">تم التسليم (Delivered)</option>
                <option value="cancelled">ملغي (Cancelled)</option>
                <option value="returned">مرتجع (Returned)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground">ملاحظة التغيير (اختياري)</label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="أضف ملاحظة توضيحية للعميل أو السجل..."
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs"
              />
              {order.notes && (
                <div className="mt-2 rounded-xl bg-accent/40 border border-border p-2.5 text-[11px] space-y-0.5">
                  <span className="font-bold text-muted-foreground block">
                    آخر ملاحظة مسجلة:
                  </span>
                  <p className="text-foreground leading-relaxed">{order.notes}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={updating}
              className="w-full rounded-xl bg-brand py-2.5 text-xs font-bold text-brand-foreground hover:bg-brand-hover transition-colors shadow-xs disabled:opacity-50"
            >
              {updating ? "جاري التحديث..." : "تأكيد تحديث الحالة"}
            </button>
          </div>

          {/* Customer Profile */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4 text-xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center space-x-2 space-x-reverse">
              <User className="h-4 w-4 text-brand" />
              <span>بيانات العميل</span>
            </h3>

            <div>
              <span className="text-muted-foreground block text-[11px]">الاسم الكامل</span>
              <span className="font-bold text-foreground">
                {order.customer?.name || order.address.fullName}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px]">رقم الهاتف</span>
              <span className="font-mono font-bold text-foreground">
                {order.customer?.phone || order.address.phone}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px]">البريد الإلكتروني</span>
              <span className="font-mono text-foreground">
                {order.customer?.email || order.address.email || "—"}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center space-x-2 space-x-reverse">
              <MapPin className="h-4 w-4 text-brand" />
              <span>عنوان التوصيل</span>
            </h3>

            <p className="font-bold text-foreground">
              {order.address.governorate} — {order.address.city}
            </p>
            <p className="text-muted-foreground leading-relaxed">{order.address.street}</p>

            {order.address.notes && (
              <div className="rounded-lg bg-accent/50 p-2.5 text-[11px] text-muted-foreground">
                ملاحظات التسليم: {order.address.notes}
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-2 flex items-center space-x-2 space-x-reverse">
              <CreditCard className="h-4 w-4 text-brand" />
              <span>طريقة الدفع</span>
            </h3>

            <div className="flex justify-between">
              <span className="text-muted-foreground">وسيلة الدفع</span>
              <span className="font-bold text-foreground">
                {order.paymentMethod === "cod" ? "الدفع عند الاستلام" : "بطاقة ائتمان"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">حالة الدفع</span>
              <span className="font-bold text-foreground">{order.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
