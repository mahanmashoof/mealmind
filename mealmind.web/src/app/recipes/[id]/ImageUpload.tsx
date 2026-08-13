"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ImageUpload({ recipeId }: { recipeId: number }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/recipes/${recipeId}/image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type — browser sets multipart boundary itself
        body: formData,
      });

      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setError("Couldn't upload image.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="text-xs">
      <label className="text-basil cursor-pointer hover:underline">
        {uploading ? "Uploading..." : "Upload photo"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-600 mt-1">{error}</p>}
    </div>
  );
}
