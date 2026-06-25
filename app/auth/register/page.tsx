"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, FieldError } from "@/components/ui/input";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import type { Sexo, TipoDoc } from "@/lib/types";

type FormState = {
  nombre: string;
  apellido: string;
  tipoDoc: TipoDoc;
  dni: string;
  sexo: Sexo;
  celular: string;
  mail: string;
  password: string;
  password2: string;
};

const initial: FormState = {
  nombre: "",
  apellido: "",
  tipoDoc: "DNI",
  dni: "",
  sexo: "Femenino",
  celular: "",
  mail: "",
  password: "",
  password2: "",
};

const sexos: Sexo[] = ["Femenino", "Masculino", "No binario", "Prefiero no decir"];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const register = useStore((s) => s.register);

  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [serverError, setServerError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.apellido.trim()) e.apellido = "Requerido";
    if (!form.dni.trim() || form.dni.length < 5) e.dni = "Documento inválido";
    if (!/^\+?\d{8,15}$/.test(form.celular)) e.celular = "Teléfono inválido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.mail)) e.mail = "Email inválido";
    if (!/^(?=.*[A-Z])(?=.*\d).{8,16}$/.test(form.password))
      e.password = "8-16 caracteres, 1 mayúscula y 1 número.";
    if (form.password !== form.password2) e.password2 = "Las contraseñas no coinciden.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    setServerError(undefined);
    if (!validate()) return;
    setLoading(true);
    const r = register({
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      tipoDoc: form.tipoDoc,
      dni: form.dni.trim(),
      sexo: form.sexo,
      celular: form.celular.trim(),
      mail: form.mail.trim(),
      password: form.password,
    });
    setLoading(false);
    if (!r.ok) {
      setServerError(r.error);
      return;
    }
    toast(`Código de verificación simulado: ${r.code}`, "info");
    router.replace("/auth/verify");
  }

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle className="text-2xl">Crear cuenta</CardTitle>
        <CardDescription>Solo necesitamos algunos datos para empezar.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={(e) => update("nombre", e.target.value)}
                invalid={!!errors.nombre}
              />
              <FieldError message={errors.nombre} />
            </div>
            <div>
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                value={form.apellido}
                onChange={(e) => update("apellido", e.target.value)}
                invalid={!!errors.apellido}
              />
              <FieldError message={errors.apellido} />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_2fr] gap-3">
            <div>
              <Label htmlFor="tipoDoc">Tipo</Label>
              <Select
                id="tipoDoc"
                value={form.tipoDoc}
                onChange={(e) => update("tipoDoc", e.target.value as TipoDoc)}
              >
                <option>DNI</option>
                <option>LE</option>
                <option>LC</option>
                <option>Pasaporte</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="dni">Número de documento</Label>
              <Input
                id="dni"
                value={form.dni}
                onChange={(e) => update("dni", e.target.value.replace(/\D/g, ""))}
                invalid={!!errors.dni}
                inputMode="numeric"
              />
              <FieldError message={errors.dni} />
            </div>
          </div>

          <div>
            <Label>Sexo</Label>
            <Select value={form.sexo} onChange={(e) => update("sexo", e.target.value as Sexo)}>
              {sexos.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="celular">Celular</Label>
            <Input
              id="celular"
              value={form.celular}
              onChange={(e) => update("celular", e.target.value)}
              invalid={!!errors.celular}
              placeholder="+54249..."
              inputMode="tel"
            />
            <FieldError message={errors.celular} />
          </div>

          <div>
            <Label htmlFor="mail">Email</Label>
            <Input
              id="mail"
              type="email"
              value={form.mail}
              onChange={(e) => update("mail", e.target.value)}
              invalid={!!errors.mail}
              autoComplete="email"
            />
            <FieldError message={errors.mail} />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              invalid={!!errors.password}
              autoComplete="new-password"
            />
            <FieldError message={errors.password} />
          </div>

          <div>
            <Label htmlFor="password2">Repetir contraseña</Label>
            <Input
              id="password2"
              type="password"
              value={form.password2}
              onChange={(e) => update("password2", e.target.value)}
              invalid={!!errors.password2}
              autoComplete="new-password"
            />
            <FieldError message={errors.password2} />
          </div>

          <FieldError message={serverError} />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Crear cuenta
          </Button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground text-center">
          ¿Ya tenés cuenta?{" "}
          <Link href="/auth/login" className="text-primary hover:underline cursor-pointer">
            Iniciar sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
