import type { ApiResponse, changePassword, resetPassword } from "@/types/verification";

export async function sendVerificationMail(email: string) {
  const res = await fetch(`/api/Auth/ForgotPassword?email=${email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    body: JSON.stringify({ email, verificationCode: code }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Invalid or expired verification code");
  }

  const data: ApiResponse<{ resetToken?: string }> = await res.json();
  return data;
}

export async function changePassword(changePassword:changePassword) {
  const res = await fetch("/api/Auth/change-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changePassword),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Error occurred while changing password");
  }

  const data: ApiResponse<{ resetToken?: string }> = await res.json();
  return data;
}

export async function resetPassword (resetPassword: resetPassword) {
  const res = await fetch("/api/Verification/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify( resetPassword ),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Invalid or expired verification code");
  }

  const data: ApiResponse<{ resetToken?: string }> = await res.json();
  return data;
}
