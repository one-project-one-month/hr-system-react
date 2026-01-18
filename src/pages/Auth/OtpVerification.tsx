import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { verifyCode, sendVerificationMail } from "@/services/verificationService";
const BOXES = 6;

export default function OtpVerification() {
  const [otp, setOtp] = useState<string[]>(Array(BOXES).fill(""));
  const [seconds, setSeconds] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email as string | undefined;
  console.log (email)
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!seconds) return;
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const code = otp.join("");
  const canContinue = code.length === BOXES && !submitting;

  function handleChange(i: number, v: string) {
    const val = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < BOXES - 1) inputsRef.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < BOXES - 1)
      inputsRef.current[i + 1]?.focus();
    if (e.key === "Enter" && canContinue) void handleVerify();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, BOXES);
    if (!digits) return;
    const next = digits.split("");
    while (next.length < BOXES) next.push("");
    setOtp(next);
    const focusIndex = Math.min(digits.length, BOXES - 1);
    inputsRef.current[focusIndex]?.focus();
  }

  async function handleVerify() {
    if (!canContinue) return;
    try {
      const resetToken = await verifyCode(email ?? "", code)
      const token = resetToken?.data?.resetToken;
      setSubmitting(true);
      setError("");
      await new Promise((r) => setTimeout(r, 500));
      navigate("/reset-password", { state: { email, resetToken: token } });
    } catch (err) {
      console.error(err);
      setError("The OTP you entered is incorrect. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleResend() {
    setSeconds(60);
    setOtp(Array(BOXES).fill(""));
    inputsRef.current[0]?.focus();
    console.log ('resending to here',email)

    sendVerificationMail(email);
    setError("");
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0 rounded-2xl bg-[#CED7D3] backdrop-blur">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl text-black fw-semibold mb-0">
          OTP verification
        </CardTitle>
        <CardDescription className="text-[#62748E]">
          We sent an OTP{" "}
          {email ? (
            <>
              to <span className="font-medium text-[#62748E]">{email}</span>
            </>
          ) : (
            ""
          )}
          . Check your email.
        </CardDescription>
      </CardHeader>

      <CardContent className="py-4 space-y-6">
        {/* OTP boxes */}
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((val, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="h-11 w-10 sm:h-12 sm:w-12 rounded-md text-center text-lg font-medium
                 bg-[#929996] text-[#FAFBFB] border border-transparent
                 focus-visible:ring-0 focus-visible:border-transparent focus-visible:outline-none"
            />
          ))}
        </div>
        {error && (
          <p
            className={`text-sm text-red-600 text-center ${error ? "opacity-100" : "opacity-0"
              }`}
          >
            {error || "placeholder"}
          </p>
        )}

        {/* Resend */}
        <div className="text-center text-sm">
          <span className="text-[#62748E]">Didn’t receive OTP code? </span>
          <button
            type="button"
            disabled={seconds > 0}
            onClick={handleResend}
            className="underline disabled:no-underline disabled:opacity-50 text-[#8602B0] cursor-pointer"
          >
            Resend Code {seconds > 0 && `(${seconds}s)`}
          </button>
        </div>

        {/* Continue */}
        <Button
          className="w-full h-11 bg-primary-500 text-sm text-neutral-50 cursor-pointer"
          disabled={!canContinue}
          onClick={handleVerify}
        >
          {submitting ? "Verifying…" : "Continue"}
        </Button>

        {/* Back to login */}
        <Button
          type="button"
          asChild
          className="w-full h-11 text-sm hover:text-primary-500 flex items-center justify-center gap-3"
        >
          <Link to="/">
            <MoveLeft />
            <span>Back to Login</span>
          </Link>
        </Button>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 text-[#99A1AF] text-sm">
          <Link to="#" className="hover:underline">
            Terms of Use
          </Link>
          <span className="select-none">|</span>
          <Link to="#" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
