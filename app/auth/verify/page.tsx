"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export default function VerifyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const loginVerify = useStore((s) => s.loginVerify);
  const pendingCode = useStore((s) => s.pending2FACode);
  const pendingUserId = useStore((s) => s.pendingLoginUserId);
  const currentUserId = useStore((s) => s.currentUserId);

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (verified) return;
    if (!pendingUserId && !currentUserId) router.replace("/auth/login");
  }, [pendingUserId, currentUserId, verified, router]);

  function setDigit(i: number, v: string) {
    const clean = v.replace(/\D/g, "").slice(0, 1);
    const arr = [...digits];
    arr[i] = clean;
    setDigits(arr);
    if (clean && i < 5) inputs.current[i + 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      e.preventDefault();
      setDigits(text.split(""));
      inputs.current[5]?.focus();
    }
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function verify() {
    setError(undefined);
    setLoading(true);
    const r = loginVerify(digits.join(""));
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setVerified(true);
    toast("¡Cuenta verificada!", "success");
    router.replace("/home");
  }

  function resend() {
    if (pendingCode) toast(`Código simulado: ${pendingCode}`, "info");
  }

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="text-2xl">Verificá tu email</CardTitle>
        <CardDescription>
          Te enviamos un código de 6 dígitos al mail con el que te registraste. Es una
          simulación: el código aparece arriba en un toast.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2" onPaste={onPaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              className={cn(
                "h-14 w-12 sm:w-14 rounded-xl border border-input bg-background text-center text-2xl font-semibold",
                "focus:outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring",
                "transition-colors duration-150",
                error && "border-destructive"
              )}
            />
          ))}
        </div>
        <FieldError message={error} />

        <Button
          className="mt-6 w-full"
          size="lg"
          loading={loading}
          disabled={digits.join("").length !== 6}
          onClick={verify}
        >
          Confirmar y crear cuenta
        </Button>

        <button
          onClick={resend}
          className="mt-4 mx-auto block text-sm text-muted-foreground hover:text-foreground cursor-pointer"
        >
          Reenviar código
        </button>
      </CardContent>
    </Card>
  );
}
