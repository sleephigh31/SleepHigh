/**
 * Coupon / Discount service — Firestore-backed.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
  deleteField,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Coupon } from "@/lib/types";

export const COUPONS_COL = "coupons";

function docToCoupon(id: string, data: any): Coupon {
  return {
    id,
    code: (data.code as string) ?? "",
    type: (data.type as Coupon["type"]) ?? "percentage",
    value: (data.value as number) ?? 0,
    productIds: data.productIds as string[] | undefined,
    categoryIds: data.categoryIds as string[] | undefined,
    startDate: data.startDate as string | undefined,
    endDate: data.endDate as string | undefined,
    usageLimit: data.usageLimit as number | undefined,
    usageCount: (data.usageCount as number) ?? 0,
    minOrderAmount: data.minOrderAmount as number | undefined,
    active: data.active !== false,
    createdAt:
      (data.createdAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ??
      (data.createdAt as string) ??
      new Date().toISOString(),
    updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.()?.toISOString() ?? undefined,
  };
}

/** Validate a coupon code against order subtotal. */
export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<{ ok: true; coupon: Coupon; discountAmount: number } | { ok: false; error: string }> {
  try {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { ok: false, error: "يرجى إدخال كود الكوبون" };
    }

    const q = query(
      collection(db, COUPONS_COL),
      where("code", "==", cleanCode),
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      return { ok: false, error: "كوبون غير صالح" };
    }

    const coupon = docToCoupon(snap.docs[0]!.id, snap.docs[0]!.data() as Record<string, unknown>);
    const now = new Date().toISOString();

    if (!coupon.active) {
      return { ok: false, error: "الكوبون غير مفعّل" };
    }
    if (coupon.startDate && coupon.startDate > now) {
      return { ok: false, error: "الكوبون غير مفعل بعد" };
    }
    if (coupon.endDate && coupon.endDate < now) {
      return { ok: false, error: "الكوبون منتهي الصلاحية" };
    }
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { ok: false, error: "تم الوصول للحد الأقصى لاستخدام الكوبون" };
    }
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return {
        ok: false,
        error: `الحد الأدنى للطلب لاستخدام الكوبون هو ${coupon.minOrderAmount} ج.م`,
      };
    }

    let discountAmount = 0;
    if (coupon.type === "percentage") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, subtotal);
    }

    return { ok: true, coupon, discountAmount };
  } catch (err) {
    console.error("[couponService] validateCoupon error:", err);
    return { ok: false, error: "حدث خطأ أثناء التحقق من الكوبون" };
  }
}

/** Admin: list all coupons. */
export async function adminListCoupons(): Promise<Coupon[]> {
  try {
    const snap = await getDocs(collection(db, COUPONS_COL));
    return snap.docs.map((d) => docToCoupon(d.id, d.data() as Record<string, unknown>));
  } catch (err) {
    console.error("[couponService] adminListCoupons error:", err);
    return [];
  }
}

/** Admin: create a coupon. */
export async function createCoupon(
  input: Omit<Coupon, "id" | "usageCount" | "createdAt" | "updatedAt">,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const data: any = {
      code: input.code.trim().toUpperCase(),
      type: input.type || "percentage",
      value: Number(input.value) || 0,
      active: input.active !== false,
      usageCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (input.minOrderAmount !== undefined && input.minOrderAmount !== null && !isNaN(Number(input.minOrderAmount)) && Number(input.minOrderAmount) > 0) {
      data["minOrderAmount"] = Number(input.minOrderAmount);
    }
    if (input.usageLimit !== undefined && input.usageLimit !== null && !isNaN(Number(input.usageLimit)) && Number(input.usageLimit) > 0) {
      data["usageLimit"] = Number(input.usageLimit);
    }
    if (input.startDate) data["startDate"] = input.startDate;
    if (input.endDate) data["endDate"] = input.endDate;
    if (input.productIds && input.productIds.length > 0) data["productIds"] = input.productIds;
    if (input.categoryIds && input.categoryIds.length > 0) data["categoryIds"] = input.categoryIds;

    const ref = await addDoc(collection(db, COUPONS_COL), data);
    return { ok: true, id: ref.id };
  } catch (err) {
    console.error("[couponService] createCoupon error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "firestore_error" };
  }
}

/** Admin: update a coupon. */
export async function updateCoupon(
  id: string,
  input: Partial<Coupon>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const updates: any = { updatedAt: serverTimestamp() };
    if (input.code !== undefined) updates["code"] = input.code.trim().toUpperCase();
    if (input.type !== undefined) updates["type"] = input.type;
    if (input.value !== undefined) updates["value"] = Number(input.value) || 0;
    if (input.active !== undefined) updates["active"] = input.active;
    
    if (input.minOrderAmount !== undefined) {
      if (input.minOrderAmount === null || input.minOrderAmount <= 0) {
        updates["minOrderAmount"] = deleteField();
      } else {
        updates["minOrderAmount"] = Number(input.minOrderAmount);
      }
    }
    if (input.usageLimit !== undefined) {
      if (input.usageLimit === null || input.usageLimit <= 0) {
        updates["usageLimit"] = deleteField();
      } else {
        updates["usageLimit"] = Number(input.usageLimit);
      }
    }
    if (input.startDate !== undefined) {
      updates["startDate"] = input.startDate || deleteField();
    }
    if (input.endDate !== undefined) {
      updates["endDate"] = input.endDate || deleteField();
    }

    await updateDoc(doc(db, COUPONS_COL, id), updates);
    return { ok: true };
  } catch (err) {
    console.error("[couponService] updateCoupon error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "firestore_error" };
  }
}

/** Admin: delete a coupon. */
export async function deleteCoupon(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await deleteDoc(doc(db, COUPONS_COL, id));
    return { ok: true };
  } catch (err) {
    console.error("[couponService] deleteCoupon error:", err);
    return { ok: false, error: err instanceof Error ? err.message : "firestore_error" };
  }
}

/** Increment coupon usage count on successful order. */
export async function incrementCouponUsage(couponId: string): Promise<void> {
  try {
    await updateDoc(doc(db, COUPONS_COL, couponId), {
      usageCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn("[couponService] incrementCouponUsage warning:", err);
  }
}
