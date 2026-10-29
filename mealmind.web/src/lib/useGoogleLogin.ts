import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FirebaseError } from "firebase/app";
import type { User } from "firebase/auth";
import { useAuth } from "@/lib/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "@/lib/firebase";
import { useTranslations } from "next-intl";

const POPUP_FALLBACK_CODES = [
  "auth/popup-blocked",
  "auth/operation-not-supported-in-this-environment",
  "auth/web-storage-unsupported",
];

function isMobile() {
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

export function useGoogleLogin() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const t = useTranslations("auth");
  const handledRedirect = useRef(false);

  async function completeLogin(user: User) {
    try {
      const idToken = await user.getIdToken();
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

  // Finishes a signInWithRedirect flow after returning from Google.
  useEffect(() => {
    if (handledRedirect.current) return;
    handledRedirect.current = true;
    getRedirectResult(auth)
      .then((result) => {
        if (result) return completeLogin(result.user);
      })
      .catch((err) => {
        console.error("Google redirect sign-in failed", err);
        setError(t("signInFailed"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signIn() {
    setError("");
    try {
      if (isMobile()) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      const result = await signInWithPopup(auth, googleProvider);
      await completeLogin(result.user);
    } catch (err) {
      if (
        err instanceof FirebaseError &&
        POPUP_FALLBACK_CODES.includes(err.code)
      ) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      console.error("Google sign-in failed", err);
      setError(t("signInFailed"));
    }
  }

  return { signIn, error };
}
