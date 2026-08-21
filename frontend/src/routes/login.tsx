import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/layout/brand-mark";
import { loginUser } from "@/lib/api/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    try {
      await fetch("/api/auth/me", { credentials: "include" });
      throw redirect({ to: "/dashboard" });
    } catch {
      return;
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(() => email.trim() && password.trim().length >= 8, [email, password]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) {
      toast.error("Please enter a valid email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginUser({ email, password });
      toast.success("Signed in successfully.");
      await navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_rgba(199,223,255,0.36)_30%,_rgba(255,255,255,0.16)_60%,_rgba(18,33,56,0.06))] px-4 py-8 sm:px-6">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.28),rgba(158,212,255,0.1),rgba(255,255,255,0.18))]" />
        <div className="absolute bottom-[-18px] left-[-10%] h-[32vh] w-[42vw] rounded-[40%] bg-[radial-gradient(circle_at_20%_30%,rgba(255,196,63,0.22),rgba(255,255,255,0)_55%)] blur-sm" />
        <div className="absolute bottom-0 left-0 h-[38vh] w-[28vw] bg-[linear-gradient(180deg,rgba(88,108,131,0.12),rgba(88,108,131,0.02))]" />
        <div className="absolute right-[-6%] top-[14%] h-[50vh] w-[28vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(82,162,255,0.12),rgba(255,255,255,0)_68%)] blur-md" />
        <div className="absolute right-0 bottom-[10%] h-[36vh] w-[24vw] rounded-l-[60%] bg-[linear-gradient(180deg,rgba(15,32,56,0.16),rgba(15,32,56,0.02))]" />
      </div>

      <div className="relative z-10 w-full max-w-[670px]">
        <div className="mb-6 flex items-center justify-center gap-3 text-center">
          <BrandMark className="size-12" />
          <div>
            <p className="text-[2rem] font-bold tracking-[-0.04em] text-slate-900">Solar &amp; Wind</p>
            <p className="text-[0.92rem] font-medium tracking-[0.12em] text-slate-600 uppercase">
              Deployment Intelligence
            </p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_15px_40px_rgba(13,34,64,0.08)] backdrop-blur-sm sm:p-8 md:p-10">
          <div className="mb-7 text-center">
            <h1 className="text-[2.1rem] font-bold tracking-[-0.04em] text-slate-900">Welcome back</h1>
            <p className="mt-2 text-[1.05rem] text-slate-600">Sign in to your renewable workspace.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[0.88rem] font-medium text-slate-700">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="h-12 rounded-xl border-slate-200 bg-white/80 pl-10 pr-3 text-[0.98rem] text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[0.88rem] font-medium text-slate-700">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="h-12 rounded-xl border-slate-200 bg-white/80 pl-10 pr-11 text-[0.98rem] text-slate-800 shadow-none placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute top-1/2 right-3 inline-flex -translate-y-1/2 items-center justify-center text-slate-400 transition-colors hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <button type="button" className="text-[0.88rem] font-medium text-emerald-700 transition-colors hover:text-emerald-800">
                  Forgot password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isValid}
              className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold text-white shadow-[0_10px_20px_rgba(16,185,129,0.2)] hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-sm font-medium text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-xl border-slate-200 bg-white/80 text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
              <span className="flex items-center justify-center text-[0.6rem] font-black text-red-500">G</span>
            </span>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-slate-600">
            New to Solar &amp; Wind?{' '}
            <Link to="/register" className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
