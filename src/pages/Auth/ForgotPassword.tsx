import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { sendVerificationMail } from "@/services/verificationService";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isInvalid = touched && !emailRe.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!emailRe.test(email)) return;
    try {
      setLoading(true);
      await sendVerificationMail(email);
      navigate("/verify-otp", { state: { email } });
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-md px-8 pt-14 pb-10 shadow-lg border-0 rounded-2xl bg-[#CED7D3] backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl text-black fw-semibold mb-0">
            Forgot password
          </CardTitle>
          <CardDescription className="text-[#62748E]">
            We will send an OTP to your email.
          </CardDescription>
        </CardHeader>

        <CardContent className="py-4">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="space-y-2 mb-6">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Please enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                required
                className="bg-[#FAFBFB] placeholder:text-[#575A59] border border-transparent focus-visible:ring-0 focus-visible:border-transparent focus-visible:outline-none"
              />
              {isInvalid && (
                <p
                  className={`text-sm transition-opacity duration-200 ${isInvalid ? "text-red-600 opacity-100" : "opacity-0"
                    }`}
                >
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-primary-500 text-sm text-neutral-50 mb-8 disabled:opacity-60 cursor-pointer"
              disabled={loading || !email || isInvalid}
            >
              {loading ? "Sending…" : "Reset password"}
            </Button>

            <Button
              type="button"
              asChild
              className="w-full h-11 text-sm text-[#020906] mb-10 flex items-center justify-center gap-3"
            >
              <Link to="/">
                <MoveLeft /> <span>Back to Login</span>
              </Link>
            </Button>

            <div className="flex items-center justify-center text-center text-sm">
              <div className="flex items-center gap-4 text-[#99A1AF]">
                <Link to="#" className="hover:underline">
                  Terms of Use
                </Link>
                <span className="select-none">•</span>
                <Link to="#" className="hover:underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
