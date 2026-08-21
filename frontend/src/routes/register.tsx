import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { Building2, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { BrandMark } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/api/auth";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    try {
      await fetch("/api/auth/me", { credentials: "include" });
      throw redirect({ to: "/dashboard" });
    } catch {
      return;
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organization: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const isValid = useMemo(
    () =>
      form.name.trim().length > 1 &&
      form.email.trim().length > 3 &&
      form.password.length >= 8 &&
      form.password === form.confirmPassword,
    [form],
  );

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) {
      toast.error("Please complete all required fields and confirm your password.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        organization: form.organization,
        phone: form.phone,
      });
      toast.success("Account created successfully.");
      await navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.72),_rgba(199,223,255,0.36)_30%,_rgba(255,255,255,0.16)_60%,_rgba(18,33,56,0.06))] px-4 py-8 sm:px-6">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.28),rgba(158,212,255,0.1),rgba(255,255,255,0.18))]" />
        <div className="absolute bottom-[-18px] left-[-10%] h-[32vh] w-[42vw] rounded-[40%] bg-[radial-gradient(circle_at_20%_30%,rgba(255,196,63,0.22),rgba(255,255,255,0)_55%)] blur-sm" />
      </div>

      <div className="relative z-10 w-full max-w-[670px]">
        <div className="mb-6 flex items-center justify-center gap-3 text-center">
          <BrandMark className="size-12" />
          <div>
            <p className="text-[2rem] font-bold tracking-[-0.04em] text-slate-900">Solar &amp; Wind</p>
            <p className="text-[0.92rem] font-medium tracking-[0.12em] text-slate-600 uppercase">Deployment Intelligence</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_15px_40px_rgba(13,34,64,0.08)] backdrop-blur-sm sm:p-8 md:p-10">
          <div className="mb-7 text-center">
            <h1 className="text-[2.1rem] font-bold tracking-[-0.04em] text-slate-900">Create account</h1>
            <p className="mt-2 text-[1.05rem] text-slate-600">Set up your renewable workspace.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="name" className="text-[0.88rem] font-medium text-slate-700">Full name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="name" value={form.name} onChange={(e)=>handleChange("name", e.target.value)} placeholder="John Doe" className="h-11 rounded-xl border-slate-200 bg-white/80 pl-10 text-slate-800" />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email" className="text-[0.88rem] font-medium text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="email" type="email" value={form.email} onChange={(e)=>handleChange("email", e.target.value)} placeholder="you@example.com" className="h-11 rounded-xl border-slate-200 bg-white/80 pl-10 text-slate-800" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[0.88rem] font-medium text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="password" type={showPassword ? "text" : "password"} value={form.password} onChange={(e)=>handleChange("password", e.target.value)} placeholder="Create a password" className="h-11 rounded-xl border-slate-200 bg-white/80 pl-10 pr-10 text-slate-800" />
                  <button type="button" onClick={()=>setShowPassword((v)=>!v)} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}</button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[0.88rem] font-medium text-slate-700">Confirm password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={(e)=>handleChange("confirmPassword", e.target.value)} placeholder="Repeat password" className="h-11 rounded-xl border-slate-200 bg-white/80 pl-10 pr-10 text-slate-800" />
                  <button type="button" onClick={()=>setShowConfirm((v)=>!v)} className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400">{showConfirm ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}</button>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="organization" className="text-[0.88rem] font-medium text-slate-700">Organization</Label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="organization" value={form.organization} onChange={(e)=>handleChange("organization", e.target.value)} placeholder="Renewables Lab" className="h-11 rounded-xl border-slate-200 bg-white/80 pl-10 text-slate-800" />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone" className="text-[0.88rem] font-medium text-slate-700">Phone</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input id="phone" value={form.phone} onChange={(e)=>handleChange("phone", e.target.value)} placeholder="+1 555 0123" className="h-11 rounded-xl border-slate-200 bg-white/80 pl-10 text-slate-800" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading || !isValid} className="mt-2 h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Creating account..." : "Create account"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="font-semibold text-emerald-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
