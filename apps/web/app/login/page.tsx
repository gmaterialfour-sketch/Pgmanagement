"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@pg-rental/ui";
import type { UserRole } from "@pg-rental/config";
import { api, storeAuth } from "../../lib/client";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("+919999999999");
  const [role, setRole] = useState<UserRole>("student");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  async function requestOtp(event: FormEvent) {
    event.preventDefault();
    const result = await api.requestOtp({ phone, role });
    setServerOtp(result.devOtp || "");
    setStep("otp");
  }

  async function verifyOtp(event: FormEvent) {
    event.preventDefault();
    const result = await api.verifyOtp({ phone, role, otp });
    storeAuth(result.tokens);
    router.push(role === "owner" ? "/owner" : "/");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="text-3xl font-bold text-ink">OTP login</h1>
      <p className="mt-2 text-sm text-zinc-600">Use a student or owner role. In development, the API returns the OTP in the response.</p>
      <form onSubmit={step === "phone" ? requestOtp : verifyOtp} className="mt-6 grid gap-4 rounded-lg border border-zinc-200 bg-white p-5">
        <label className="grid gap-1 text-sm font-medium">
          Phone
          <input className="rounded-md border border-zinc-300 px-3 py-2" value={phone} onChange={(event) => setPhone(event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Role
          <select className="rounded-md border border-zinc-300 px-3 py-2" value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
            <option value="student">Student</option>
            <option value="owner">Owner</option>
          </select>
        </label>
        {step === "otp" ? (
          <label className="grid gap-1 text-sm font-medium">
            OTP {serverOtp ? <span className="text-xs text-campus">dev OTP: {serverOtp}</span> : null}
            <input className="rounded-md border border-zinc-300 px-3 py-2" value={otp} onChange={(event) => setOtp(event.target.value)} />
          </label>
        ) : null}
        <Button type="submit">{step === "phone" ? "Send OTP" : "Verify and continue"}</Button>
      </form>
    </main>
  );
}
