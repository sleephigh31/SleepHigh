import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Eye, Users } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { adminListOrders } from "@/lib/services/firebase/orderService";
import { formatPrice } from "@/lib/format";
import { useLocale } from "@/lib/locale";

export const Route = createFileRoute("/admin/customers/")({
  component: AdminCustomersPage,
});

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

function AdminCustomersPage() {
  const locale = useLocale();
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [usersSnap, ordersRes] = await Promise.all([
          getDocs(collection(db, "users")).catch(() => null),
          adminListOrders({ limit_: 500 }).catch(() => ({ orders: [] })),
        ]);

        if (!usersSnap || usersSnap.empty) {
          setCustomers([]);
          setLoading(false);
          return;
        }

        const ordersList = ordersRes?.orders || [];

        // Map orders by customer ID or email/phone
        const orderStatsMap: Record<string, { count: number; total: number }> = {};
        ordersList.forEach((o) => {
          const custId = o.customer?.email || o.address?.email;
          if (custId) {
            if (!orderStatsMap[custId]) {
              orderStatsMap[custId] = { count: 0, total: 0 };
            }
            orderStatsMap[custId].count += 1;
            orderStatsMap[custId].total += o.total || 0;
          }
        });

        const list: CustomerRecord[] = usersSnap.docs.map((d) => {
          const data = d.data() as Record<string, any>;
          const email = data["email"] || "";
          const stats = orderStatsMap[d.id] || orderStatsMap[email] || { count: 0, total: 0 };

          return {
            id: d.id,
            name: data["displayName"] || data["name"] || "عميل بدون اسم",
            email: email,
            phone: data["phone"] || "—",
            ordersCount: stats.count,
            totalSpent: stats.total,
            createdAt: data["createdAt"]?.toDate?.()?.toISOString() || new Date().toISOString(),
          };
        });

        setCustomers(list);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return [c.name, c.email, c.phone].join(" ").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 text-foreground dir-rtl">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">قائمة العملاء ({filtered.length})</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            عرض وحساب بيانات العملاء ومتابعة إجمالي المشتريات
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="بحث باسم العميل، البريد، أو الهاتف..."
          className="w-full rounded-xl border border-input bg-background pr-9 pl-4 py-2 text-xs"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">جاري تحميل العملاء...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground space-y-2">
          <Users className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="font-bold">لا يوجد عملاء مسجلون حالياً</p>
          <p className="text-xs">
            سيتم إدراج بيانات العملاء فور تسجيلهم أو إنشائهم حسابتهم في المتجر.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <table className="w-full text-right text-xs text-foreground border-collapse">
            <thead className="bg-muted/50 text-muted-foreground font-bold border-b border-border">
              <tr>
                <th className="py-3.5 px-4">العميل</th>
                <th className="py-3.5 px-4">الهاتف</th>
                <th className="py-3.5 px-4">البريد الإلكتروني</th>
                <th className="py-3.5 px-4">عدد الطلبات</th>
                <th className="py-3.5 px-4">إجمالي الإنفاق</th>
                <th className="py-3.5 px-4">تاريخ التسجيل</th>
                <th className="py-3.5 px-4 text-left">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-accent/40 transition-colors">
                  <td className="py-3 px-4 font-bold flex items-center space-x-2 space-x-reverse">
                    <div className="h-8 w-8 rounded-full bg-brand/15 text-brand flex items-center justify-center font-bold">
                      {c.name.charAt(0)}
                    </div>
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono">{c.phone}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{c.email}</td>
                  <td className="py-3 px-4 font-bold">{c.ordersCount} طلبات</td>
                  <td className="py-3 px-4 font-bold text-brand">
                    {formatPrice(c.totalSpent, locale)}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(c.createdAt).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="py-3 px-4 text-left">
                    <Link
                      to={`/admin/customers/$id`}
                      params={{ id: c.id }}
                      className="inline-flex items-center space-x-1 space-x-reverse rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent min-h-[36px]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>الملف</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
