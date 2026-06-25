"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useToast } from "@/components/ui/toast";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  CreditCard,
  Wallet,
  Plus,
  Check,
  X,
  Users,
  LogOut,
  ShieldCheck,
  Tag,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = useStore((s) => s.getCurrentUser());
  const group = useStore((s) => s.getCurrentGroup());
  const groupBalance = useStore((s) => (group ? s.getGroupBalance(group.id) : 0));
  const users = useStore((s) => s.users);
  const groups = useStore((s) => s.groups);
  const allCupones = useStore((s) => s.cupones);
  const cupones = useMemo(
    () => (user ? allCupones.filter((c) => c.userId === user.id) : []),
    [allCupones, user]
  );
  const linkMP = useStore((s) => s.linkMercadoPago);
  const unlinkMP = useStore((s) => s.unlinkMercadoPago);
  const addBalance = useStore((s) => s.addBalance);
  const approve = useStore((s) => s.approveJoinRequest);
  const reject = useStore((s) => s.rejectJoinRequest);
  const createGroup = useStore((s) => s.createGroup);
  const request = useStore((s) => s.requestJoinGroup);
  const leave = useStore((s) => s.leaveGroup);
  const logout = useStore((s) => s.logout);

  const [topUp, setTopUp] = useState("2000");
  const [newGroupName, setNewGroupName] = useState("");

  if (!user) return null;

  const isOwner = group && group.ownerId === user.id;
  const members = group ? users.filter((u) => group.memberIds.includes(u.id)) : [];

  const cuponesDisponibles = cupones.filter((c) => c.estado === "Disponible");
  const cuponesUsados = cupones.filter((c) => c.estado !== "Disponible");

  return (
    <>
      <TopBar back fallbackHref="/home" />
      <section className="container max-w-3xl mt-2 space-y-5">
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center text-lg font-semibold">
                {user.nombre[0]}
                {user.apellido[0]}
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight truncate">
                  {user.nombre} {user.apellido}
                </h1>
                <p className="text-xs text-muted-foreground truncate">{user.mail}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  toast("Sesión cerrada", "info");
                  router.replace("/auth/login");
                }}
                className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
                aria-label="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <Info label="Documento" value={`${user.tipoDoc} ${user.dni}`} />
              <Info label="Sexo" value={user.sexo} />
              <Info label="Teléfono" value={user.celular} />
              <Info label="Alta" value={formatDateTime(user.fechaAlta)} />
            </dl>
          </CardContent>
        </Card>

        {/* Mercado Pago */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CreditCard className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold">Mercado Pago</p>
                  <p className="text-xs text-muted-foreground">
                    {user.cuentaMercadoPago
                      ? `Vinculado · ${user.cuentaMercadoPago}`
                      : "Sin vincular"}
                  </p>
                </div>
              </div>
              {user.cuentaMercadoPago ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    unlinkMP();
                    toast("Mercado Pago desvinculado", "info");
                  }}
                >
                  Desvincular
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    linkMP();
                    toast("Mercado Pago vinculado", "success");
                  }}
                >
                  Vincular
                </Button>
              )}
            </div>
            {user.cuentaMercadoPago && (
              <Badge tone="success" className="mt-4">
                <ShieldCheck className="h-3 w-3" /> Activo
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Cupones del usuario */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Tag className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Mis cupones</p>
                <p className="text-xs text-muted-foreground">
                  {cuponesDisponibles.length} disponibles · {cuponesUsados.length} históricos
                </p>
              </div>
            </div>
            {cupones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Todavía no tenés cupones asignados.
              </p>
            ) : (
              <ul className="space-y-2">
                {cupones.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium">{c.codigo}</p>
                      <p className="text-xs text-muted-foreground">
                        Vence {new Date(c.fechaVencimiento).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="primary">-{c.porcentajeDto}%</Badge>
                      <Badge
                        tone={
                          c.estado === "Disponible"
                            ? "success"
                            : c.estado === "Usado"
                              ? "muted"
                              : "destructive"
                        }
                      >
                        {c.estado}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Group */}
        <Card>
          <CardContent className="pt-5 pb-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">Grupo de compras</p>
                <p className="text-xs text-muted-foreground">
                  {group ? group.nombre : "Sin grupo"}
                </p>
              </div>
            </div>

            {group ? (
              <>
                <div className="mt-5 rounded-xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Saldo del grupo
                    </p>
                    <p className="mt-0.5 text-2xl font-semibold tabular-nums">
                      {formatCurrency(groupBalance)}
                    </p>
                  </div>
                  <Wallet className="h-7 w-7 text-primary/70" />
                </div>

                {user.cuentaMercadoPago && (
                  <div className="mt-4">
                    <Label>Cargar saldo con Mercado Pago</Label>
                    <div className="flex gap-2">
                      <Input
                        value={topUp}
                        onChange={(e) => setTopUp(e.target.value.replace(/\D/g, ""))}
                        inputMode="numeric"
                        className="max-w-[160px]"
                      />
                      <Button
                        onClick={() => {
                          const n = Number(topUp);
                          if (!n || n <= 0) return toast("Monto inválido", "error");
                          addBalance(n);
                          toast(`+ ${formatCurrency(n)} cargados`, "success");
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Cargar
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                    Miembros ({members.length})
                  </p>
                  <ul className="space-y-2">
                    {members.map((m) => (
                      <li
                        key={m.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                            {m.nombre[0]}
                            {m.apellido[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {m.nombre} {m.apellido}
                            </p>
                            <p className="text-xs text-muted-foreground">{m.mail}</p>
                          </div>
                        </div>
                        {m.id === group.ownerId ? (
                          <Badge tone="primary">Titular</Badge>
                        ) : m.id === user.id ? (
                          <Badge tone="accent">Vos</Badge>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>

                {isOwner && group.pendingRequests.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                      Solicitudes pendientes
                    </p>
                    <ul className="space-y-2">
                      {group.pendingRequests.map((r) => (
                        <li
                          key={r.userId}
                          className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2.5"
                        >
                          <span className="text-sm">{r.userName}</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                approve(r.userId);
                                toast(`${r.userName} se sumó al grupo`, "success");
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground hover:bg-success/90 cursor-pointer active:scale-[0.97] transition-colors"
                              aria-label="Aprobar"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                reject(r.userId);
                                toast(`Solicitud rechazada`, "info");
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer active:scale-[0.97] transition-colors"
                              aria-label="Rechazar"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="mt-5 w-full text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    leave();
                    toast("Saliste del grupo", "info");
                  }}
                >
                  Salir del grupo
                </Button>
              </>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <Label>Crear un grupo nuevo</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Familia Coronel"
                    />
                    <Button
                      onClick={() => {
                        if (!newGroupName.trim()) return toast("Ingresá un nombre", "error");
                        createGroup(newGroupName.trim());
                        toast("Grupo creado", "success");
                        setNewGroupName("");
                      }}
                    >
                      Crear
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>O unirte a uno existente</Label>
                  <ul className="space-y-2 max-h-72 overflow-auto scrollbar-thin pr-1">
                    {groups.slice(0, 8).map((g) => (
                      <li
                        key={g.id}
                        className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5"
                      >
                        <div>
                          <p className="text-sm font-medium">{g.nombre}</p>
                          <p className="text-xs text-muted-foreground">
                            {g.memberIds.length} miembros
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={g.pendingRequests.some((p) => p.userId === user.id)}
                          onClick={() => {
                            request(g.id);
                            toast("Solicitud enviada", "success");
                          }}
                        >
                          {g.pendingRequests.some((p) => p.userId === user.id)
                            ? "Pendiente"
                            : "Solicitar unirse"}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <dt className="uppercase tracking-[0.12em] text-muted-foreground text-[10px]">{label}</dt>
      <dd className="font-medium mt-0.5">{value}</dd>
    </div>
  );
}
