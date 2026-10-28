import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import { useTranslations } from "next-intl";

export function useGoogleLogin() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");

  async function signIn() {
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
      console.error("Google sign-in failed", err);
      if (err instanceof ApiError && err.status === 403) {
        setError(t("notApproved"));
      } else {
        setError(t("signInFailed"));
      }
    }
  }

  return { signIn, error };
}
