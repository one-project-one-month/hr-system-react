import type { ApiResponse } from "@/types/verification";

export async function sendVerificationMail(email: string) {
  const res = await fetch("/api/Verification/send-verification-mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to send verification email");
  }

  const data: ApiResponse<unknown> = await res.json();
  return data;
}

export async function verifyCode(email: string, code: string) {
  const res = await fetch("/api/Verification/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Invalid or expired verification code");
  }

  const data: ApiResponse<{ resetToken?: string }> = await res.json();
  return data;
}
