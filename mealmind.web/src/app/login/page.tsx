"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { buttonPrimary } from "@/lib/styles";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  async function handleGoogleLogin() {
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await apiFetch<{ token: string }>("/auth/google-login", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      login(res.token);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(t("notApproved"));
      } else {
        setError(t("signInFailed"));
      }
    }
  }

  return (
    <main className="px-4 py-6 flex items-center justify-center">
      <div className="bg-surface border border-stone rounded-lg p-6 w-full max-w-sm flex flex-col gap-3 text-center">
        <h1 className="font-display uppercase text-xl mb-2">
          {t("loginTitle")}
        </h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button onClick={handleGoogleLogin} className={buttonPrimary}>
          {t("signInWithGoogle")}
        </button>
      </div>
    </main>
  );
}
