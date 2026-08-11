import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { MapPin, Save, CheckCircle, AlertCircle } from "lucide-react";
import { AccountLayout } from "@/components/account/AccountLayout";
import type { Address } from "@/lib/types";

export const Route = createFileRoute("/$locale/account/addresses")({
  component: AddressesPage,
});

function AddressesPage() {
  const { user, updateProfile } = useStore();

  const [address, setAddress] = useState<Omit<Address, "fullName" | "phone" | "email">>({
    governorate: user?.defaultAddress?.governorate ?? "",
    city: user?.defaultAddress?.city ?? "",
    street: user?.defaultAddress?.street ?? "",
    notes: user?.defaultAddress?.notes ?? "",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.governorate || !address.city || !address.street) {
      setError("يرجى إكمال الحقول المطلوبة: المحافظة، المدينة، الشارع.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const fullAddress: Address = {
        fullName: user?.name ?? "",
        phone: user?.phone ?? "",
        email: user?.email ?? "",
        ...address,
      };
      await updateProfile({ defaultAddress: fullAddress });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("حدث خطأ أثناء الحفظ. يرجى المحاولة مجدداً.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountLayout activeTab="addresses">
      <div className="space-y-6">
        <h2 className="text-xl font-bold border-b border-border pb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-brand" />
          عناويني
        </h2>

        <p className="text-sm text-muted-foreground">
          احفظ عنوانك الافتراضي ليتم ملء بيانات الشحن تلقائياً عند إتمام الشراء.
        </p>

        {success && (
          <div className="flex items-center gap-3 rounded-xl bg-green-500/10 border border-green-500/30 p-4 text-green-700 dark:text-green-400 text-sm font-bold">
            <CheckCircle className="h-5 w-5 shrink-0" />
            تم حفظ العنوان بنجاح!
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/30 p-4 text-destructive text-sm font-bold">
            <AlertCircle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">
                المحافظة <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={address.governorate}
                onChange={(e) => setAddress({ ...address, governorate: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 transition"
                placeholder="القاهرة"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-foreground">
                المدينة / المنطقة <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 transition"
                placeholder="مدينة نصر"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">
              الشارع ورقم المبنى <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              required
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 transition"
              placeholder="12 شارع النزهة، الدور 3 شقة 5"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-foreground">ملاحظات إضافية (اختياري)</label>
            <textarea
              value={address.notes ?? ""}
              onChange={(e) => setAddress({ ...address, notes: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/40 transition"
              placeholder="علامة مميزة أو موعد مفضل للتوصيل..."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-bold text-brand-foreground hover:bg-brand-hover transition-colors disabled:opacity-60 text-sm"
            >
              <Save className="h-4 w-4" />
              {saving ? "جاري الحفظ..." : "حفظ العنوان"}
            </button>
          </div>
        </form>

        {user?.defaultAddress && (
          <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-2">
            <p className="text-sm font-bold text-muted-foreground mb-3">العنوان المحفوظ حالياً</p>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-brand mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-sm font-bold">
                  {user.defaultAddress.governorate} — {user.defaultAddress.city}
                </p>
                <p className="text-sm text-muted-foreground">{user.defaultAddress.street}</p>
                {user.defaultAddress.notes && (
                  <p className="text-xs text-muted-foreground">{user.defaultAddress.notes}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
