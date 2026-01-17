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
import { changePassword } from "@/services/verificationService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [oldPswd, setOldPwd] = useState("");    
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [show, setShow] = useState(false);
  const [oldShow, setOldShow] = useState(false)
  const [cshow, setCshow] = useState(false);
  const [loading, setLoading] = useState(false);

  const minLen = 6;
  const pwdInvalid = pwd.length > 0 && pwd.length < minLen;
  const matchInvalid = cpwd.length > 0 && pwd !== cpwd;

  const canSubmit = pwd.length >= minLen && pwd === cpwd && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const payload =
    {
      employeeCode: state?.employeeCode,
      oldPassword: oldPswd,
      newPassword: pwd,
      confirmPassword: cpwd
    }
    await changePassword(payload);
    try {
      setLoading(true);
      navigate("/password-changed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full h-full max-w-md px-8 mb-2 shadow-lg border-0 rounded-2xl bg-[#CED7D3] backdrop-blur">
        <span className="font-bold flex items-center justify-center pt-4">Change Password</span>
        <div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div>
              <Label htmlFor="oldPassword" className="mb-2">Old Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={oldShow ? "text" : "password"}
                  placeholder="Enter your Old password"
                  value={oldPswd}
                  onChange={(e) => setOldPwd(e.target.value)}
                  className="bg-[#FAFBFB] placeholder:text-[#575A59] border border-transparent focus-visible:ring-0 focus-visible:border-transparent focus-visible:outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setOldShow((s) => !s)}
                  className="absolute inset-y-0 right-2 flex items-center text-[#575A59]"
                  aria-label={oldShow ? "Hide password" : "Show password"}
                >
                  {oldShow ? <Eye size={18} /> : <EyeOff size={18} />}
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
            {/* Password */}
            <div>
              <Label htmlFor="password" className="mb-2">Password</Label>
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
            <div>
              <Label htmlFor="confirm" className="mb-2">Confirm Password</Label>
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
              className="w-full bg-primary-500 text-sm text-neutral-50 cursor-pointer"
              disabled={!canSubmit}
            >
              {loading ? "Saving…" : "Reset Password"}
            </Button>

            {/* Back to login */}
            <Button
              type="button"
              asChild
              className="w-full text-sm text-[#020906] flex items-center justify-center"
            >
              <Link to="/">
                <MoveLeft />
                <span>Back to Login</span>
              </Link>
            </Button>

            {/* Footer links */}
            <div className="flex items-center justify-center gap-2 text-[#99A1AF] text-sm mb-3">
              <Link to="#" className="hover:underline">
                Terms of Use
              </Link>
              <span className="select-none">|</span>
              <Link to="#" className="hover:underline">
                Privacy Policy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
