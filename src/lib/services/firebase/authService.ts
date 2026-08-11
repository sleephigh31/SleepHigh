/**
 * Firebase Auth service for customer authentication.
 * Never stores passwords. Uses Firebase Auth exclusively.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { User, UserRole, Address } from "@/lib/types";

const ADMIN_EMAIL = "sleephigh31@gmail.com";

function firebaseUserToUser(fbUser: FirebaseUser, role?: UserRole): User {
  return {
    id: fbUser.uid,
    name: fbUser.displayName ?? "",
    email: fbUser.email ?? "",
    photoURL: fbUser.photoURL ?? undefined,
    role: role ?? "customer",
  };
}

import { notifyNewUserRegistration } from "./notificationService";

/** Register a new customer. Never stores the password in Firestore. */
export async function registerCustomer(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, input.email.trim(), input.password);
    await updateProfile(cred.user, { displayName: input.name.trim() });

    // Create user document in Firestore (no password stored)
    await setDoc(doc(db, "users", cred.user.uid), {
      uid: cred.user.uid,
      email: cred.user.email,
      displayName: input.name.trim(),
      phone: input.phone.trim(),
      role: "customer",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Notify Admin of new registration
    await notifyNewUserRegistration(cred.user.uid, input.name.trim(), input.email.trim());

    return {
      ok: true,
      user: { ...firebaseUserToUser(cred.user), phone: input.phone.trim() },
    };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    if (code === "auth/email-already-in-use") {
      return { ok: false, error: "exists" };
    }
    if (code === "auth/weak-password") {
      return { ok: false, error: "weak_password" };
    }
    console.error("[authService] registerCustomer error:", err);
    return { ok: false, error: "unknown" };
  }
}

/** Sign in a customer. Returns error codes, never throws. */
export async function signInCustomer(
  email: string,
  password: string,
): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    const role = await getUserRole(cred.user.uid);
    const userDoc = await getUserDoc(cred.user.uid);
    return {
      ok: true,
      user: {
        ...firebaseUserToUser(cred.user, role),
        phone: userDoc?.phone,
        defaultAddress: userDoc?.defaultAddress,
      },
    };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    if (
      code === "auth/user-not-found" ||
      code === "auth/wrong-password" ||
      code === "auth/invalid-credential"
    ) {
      return { ok: false, error: "credentials" };
    }
    console.error("[authService] signInCustomer error:", err);
    return { ok: false, error: "unknown" };
  }
}

/** Sign in or sign up with Google account. */
export async function signInWithGoogle(): Promise<
  { ok: true; user: User } | { ok: false; error: string }
> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);

    const userRef = doc(db, "users", cred.user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: cred.user.uid,
        email: cred.user.email ?? "",
        displayName: cred.user.displayName ?? "",
        photoURL: cred.user.photoURL ?? "",
        role: "customer",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else if (cred.user.photoURL || cred.user.displayName) {
      await updateDoc(userRef, {
        ...(cred.user.displayName ? { displayName: cred.user.displayName } : {}),
        ...(cred.user.photoURL ? { photoURL: cred.user.photoURL } : {}),
        updatedAt: serverTimestamp(),
      });
    }

    const role = await getUserRole(cred.user.uid);
    const userDoc = await getUserDoc(cred.user.uid);

    return {
      ok: true,
      user: {
        ...firebaseUserToUser(cred.user, role),
        phone: userDoc?.phone,
        defaultAddress: userDoc?.defaultAddress,
      },
    };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    if (code === "auth/popup-closed-by-user") {
      return { ok: false, error: "popup_closed" };
    }
    if (code === "auth/cancelled-popup-request") {
      return { ok: false, error: "cancelled" };
    }
    if (code === "auth/popup-blocked") {
      return { ok: false, error: "popup_blocked" };
    }
    console.error("[authService] signInWithGoogle error:", err);
    return { ok: false, error: "unknown" };
  }
}

/** Sign out the current user. */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/** Send a password reset email. */
export async function resetPassword(email: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { ok: true };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    if (code === "auth/user-not-found") {
      return { ok: false, error: "not_found" };
    }
    return { ok: false, error: "unknown" };
  }
}

/** Get the Firestore user document for a given UID. */
export async function getUserDoc(uid: string) {
  try {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data() as {
      uid: string;
      email: string;
      displayName: string;
      phone?: string;
      defaultAddress?: Address;
      role: UserRole;
    };
  } catch {
    return null;
  }
}

/** Get the role for a given UID from Firestore. */
export async function getUserRole(uid: string): Promise<UserRole> {
  const userDoc = await getUserDoc(uid);
  return (userDoc?.role as UserRole) ?? "customer";
}

/** Listen to auth state changes — returns an unsubscribe function. */
export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null);
      return;
    }
    const userDoc = await getUserDoc(fbUser.uid);
    callback({
      ...firebaseUserToUser(fbUser, userDoc?.role),
      phone: userDoc?.phone,
      defaultAddress: userDoc?.defaultAddress,
    });
  });
}

/** Update the current user's profile (display name, phone). */
export async function updateUserProfile(
  uid: string,
  input: Partial<{ name: string; phone: string; photoURL: string; defaultAddress: Address }>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (auth.currentUser && input.name) {
      await updateProfile(auth.currentUser, {
        displayName: input.name,
        photoURL: input.photoURL ?? auth.currentUser.photoURL,
      });
    }
    await updateDoc(doc(db, "users", uid), {
      ...(input.name ? { displayName: input.name } : {}),
      ...(input.phone ? { phone: input.phone } : {}),
      ...(input.photoURL ? { photoURL: input.photoURL } : {}),
      ...(input.defaultAddress ? { defaultAddress: input.defaultAddress } : {}),
      updatedAt: serverTimestamp(),
    });
    return { ok: true };
  } catch (err) {
    console.error("[authService] updateUserProfile error:", err);
    return { ok: false, error: "unknown" };
  }
}

/** Check if an email is the designated admin email. */
export function isAdminEmail(email: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
}
