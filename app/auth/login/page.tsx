"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const loginStart = useStore((s) => s.loginStart);

  const [identifier, setIdentifier] = useState("bautista.coronel33@outlook.com");
  const [password, setPassword] = useState("Tandil2026");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    const r = loginStart(identifier, password);
    setLoading(false);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    toast("¡Sesión iniciada!", "success");
    router.replace("/home");
  }

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="text-2xl">Ingresá a tu cuenta</CardTitle>
        <CardDescription>Email o teléfono + contraseña.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="identifier">Email o teléfono</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="nacho@intelligentfood.test"
              autoComplete="username"
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          <FieldError message={error} />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            Ingresar
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          ¿No tenés cuenta?{" "}
          <Link href="/auth/register" className="text-primary hover:underline cursor-pointer">
            Registrate gratis
          </Link>
        </p>

        <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Demo</p>
          <p>bautista.coronel33@outlook.com · Tandil2026</p>
          <p className="mt-1">Cualquiera de los 60 usuarios de la DB (G7) funciona con esa contraseña.</p>
        </div>
      </CardContent>
    </Card>
  );
}
