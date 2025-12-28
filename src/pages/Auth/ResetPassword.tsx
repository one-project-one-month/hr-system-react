import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoveLeft, Eye, EyeOff } from "lucide-react";
import { resetPassword } from "@/services/verificationService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [show, setShow] = useState(false);
  const [cshow, setCshow] = useState(false);
  const [loading, setLoading] = useState(false);

  const minLen = 8;
  const pwdInvalid = pwd.length > 0 && pwd.length < minLen;
  const matchInvalid = cpwd.length > 0 && pwd !== cpwd;

  const canSubmit = pwd.length >= minLen && pwd === cpwd && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const payload =
    {
      email: state?.email,
      resetToken: state?.resetToken ?? "",
      newPassword: pwd
    }
    await resetPassword(payload);
    try {
      setLoading(true);
      navigate("/password-changed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card className="w-full max-w-md px-8 pt-14 pb-10 shadow-lg border-0 rounded-2xl bg-[#CED7D3] backdrop-blur">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl text-black fw-semibold mb-0">
            Set new password
          </CardTitle>
        </CardHeader>

        <CardContent className="py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="bg-[#FAFBFB] placeholder:text-[#575A59] border border-transparent focus-visible:ring-0 focus-visible:border-transparent focus-visible:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute inset-y-0 right-2 flex items-center text-[#575A59]"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {pwdInvalid && (
                <p
                  className={`text-sm mt-1 ${pwdInvalid ? "text-red-600" : "opacity-0"
                    }`}
                >
                  Password must be at least {minLen} characters.
                </p>
              )}
            </div>

            {/* Confirm */}
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm your new Password</Label>
              <div className="relative">
                <Input
                  id="confirm"
                  type={cshow ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={cpwd}
                  onChange={(e) => setCpwd(e.target.value)}
                  className="bg-[#FAFBFB] placeholder:text-[#575A59] border border-transparent focus-visible:ring-0 focus-visible:border-transparent focus-visible:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setCshow((s) => !s)}
                  className="absolute inset-y-0 right-2 flex items-center text-[#575A59]"
                  aria-label={cshow ? "Hide password" : "Show password"}
                >
                  {cshow ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {matchInvalid && (
                <p
                  className={`text-sm mt-1 ${matchInvalid ? "text-red-600" : "opacity-0"
                    }`}
                >
                  Passwords do not match.
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 bg-primary-500 text-sm text-neutral-50 cursor-pointer"
              disabled={!canSubmit}
            >
              {loading ? "Saving…" : "Reset Password"}
            </Button>

            {/* Back to login */}
            <Button
              type="button"
              asChild
              className="w-full h-11 text-sm text-[#020906] flex items-center justify-center gap-3"
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
          </form>
        </CardContent>
      </Card>
    </>
  );
}
