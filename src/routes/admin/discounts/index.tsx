import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Tag, Trash2, Edit2, Loader2, AlertCircle } from "lucide-react";
import {
  adminListCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "@/lib/services/firebase/couponService";
import { formatPrice } from "@/lib/format";
import { useLocale } from "@/lib/locale";
import type { Coupon } from "@/lib/types";
import { useToast } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/discounts/")({
  component: AdminDiscountsPage,
});

function AdminDiscountsPage() {
  const locale = useLocale();
  const toast = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [type, setType] = useState<Coupon["type"]>("percentage");
  const [value, setValue] = useState(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number | undefined>(undefined);
  const [usageLimit, setUsageLimit] = useState<number | undefined>(undefined);
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const data = await adminListCoupons();
      setCoupons(data);
    } catch {
      toast.error("فشل تحميل الكوبونات");
    } finally {
      setLoading(false);
    }
  }

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode("");
    setType("percentage");
    setValue(10);
    setMinOrderAmount(undefined);
    setUsageLimit(undefined);
    setActive(true);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setType(coupon.type);
    setValue(coupon.value);
    setMinOrderAmount(coupon.minOrderAmount);
    setUsageLimit(coupon.usageLimit);
    setActive(coupon.active);
    setFormError(null);
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setFormError("كود الكوبون مطلوب");
      return;
    }
    if (value <= 0) {
      setFormError("قيمة الخصم يجب أن تكون أكبر من صفر");
      return;
    }
    if (type === "percentage" && value > 100) {
      setFormError("نسبة الخصم لا يمكن أن تتجاوز 100%");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (editingCoupon) {
        // Edit existing coupon
        const res = await updateCoupon(editingCoupon.id, {
          code: cleanCode,
          type,
          value,
          minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
          usageLimit: usageLimit ? Number(usageLimit) : undefined,
          active,
        });

        if (res.ok) {
          toast.success("تم تحديث الكوبون بنجاح");
          setShowModal(false);
          await load();
        } else {
          setFormError(res.error || "فشل تحديث الكوبون");
        }
      } else {
        // Create new coupon
        const res = await createCoupon({
          code: cleanCode,
          type,
          value,
          minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
          usageLimit: usageLimit ? Number(usageLimit) : undefined,
          active,
        });

        if (res.ok) {
          toast.success("تم إنشاء الكوبون بنجاح");
          setShowModal(false);
          await load();
        } else {
          setFormError(res.error || "فشل إنشاء الكوبون");
        }
      }
    } catch {
      setFormError("حدث خطأ غير متوقع أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    const res = await updateCoupon(id, { active: !current });
    if (res.ok) {
      setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, active: !current } : c)));
      toast.success(!current ? "تم تفعيل الكوبون" : "تم تعطيل الكوبون");
    } else {
      toast.error("فشل تغيير حالة الكوبون");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف الكوبون؟")) {
      const res = await deleteCoupon(id);
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
        toast.success("تم حذف الكوبون بنجاح");
      } else {
        toast.error("فشل حذف الكوبون");
      }
    }
  };

  return (
    <div className="space-y-6 text-foreground dir-rtl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            إدارة الكوبونات والخصومات ({coupons.length})
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            إنشاء وتعديل أكواد التخفيض، نسبة الخصم، والحد الأدنى للطلبات
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-1.5 space-x-reverse rounded-xl bg-brand px-4 py-2.5 text-xs font-bold text-brand-foreground hover:bg-brand-hover transition-colors shadow-xs min-h-[44px]"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة كوبون جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-brand" />
          <span>جاري تحميل الكوبونات...</span>
        </div>
      ) : coupons.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground space-y-3">
          <Tag className="mx-auto h-8 w-8 text-muted-foreground/40" />
          <p>لا توجد كوبونات خصم حالية.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إنشاء أول كوبون</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-base text-brand bg-brand/10 border border-brand/20 px-3 py-1 rounded-xl">
                  {c.code}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    c.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.active ? "مفعل" : "معطل"}
                </span>
              </div>

              <div className="text-xs space-y-1 text-muted-foreground">
                <p className="font-bold text-foreground text-sm">
                  قيمة الخصم:{" "}
                  {c.type === "percentage" ? `${c.value}%` : formatPrice(c.value, locale)}
                </p>
                {c.minOrderAmount && (
                  <p>الحد الأدنى للطلب: {formatPrice(c.minOrderAmount, locale)}</p>
                )}
                {c.usageLimit && (
                  <p>الحد الأقصى للاستخدام: {c.usageLimit} مرات</p>
                )}
                <p>عدد مرات الاستخدام: {c.usageCount} مرات</p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <button
                  type="button"
                  onClick={() => handleToggleActive(c.id, c.active)}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground min-h-[36px]"
                >
                  {c.active ? "تعطيل" : "تفعيل"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(c)}
                    className="rounded-lg border border-border bg-card p-2 text-foreground hover:bg-accent hover:border-brand/40 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
                    title="تعديل الكوبون"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="rounded-lg bg-destructive/10 p-2 text-destructive hover:bg-destructive/20 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors"
                    title="حذف الكوبون"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => !saving && setShowModal(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-foreground">
            <h3 className="text-base font-bold">
              {editingCoupon ? `تعديل الكوبون (${editingCoupon.code})` : "إنشاء كوبون جديد"}
            </h3>

            {formError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-bold text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">كود الكوبون *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="WELCOME10"
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 dir-ltr font-mono font-bold"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold block mb-1">نوع الخصم</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Coupon["type"])}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت ({locale === "ar" ? "ج.م" : "EGP"})</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">القيمة *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={type === "percentage" ? 100 : undefined}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold block mb-1">الحد الأدنى للطلب (اختياري)</label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderAmount ?? ""}
                    onChange={(e) =>
                      setMinOrderAmount(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="1000"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">الحد الأقصى للاستخدام (اختياري)</label>
                  <input
                    type="number"
                    min={1}
                    value={usageLimit ?? ""}
                    onChange={(e) =>
                      setUsageLimit(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="100"
                    className="w-full rounded-xl border border-input bg-background px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="coupon-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-input text-brand h-4 w-4"
                />
                <label htmlFor="coupon-active" className="font-semibold text-xs cursor-pointer">
                  تفعيل الكوبون فوراً
                </label>
              </div>

              <div className="flex justify-end space-x-2 space-x-reverse pt-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-input bg-background px-4 py-2 font-semibold min-h-[44px]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 font-bold text-brand-foreground hover:bg-brand-hover min-h-[44px] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{saving ? "جاري الحفظ..." : editingCoupon ? "تحديث الكوبون" : "حفظ الكوبون"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
