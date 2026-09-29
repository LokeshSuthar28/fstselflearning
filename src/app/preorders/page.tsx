"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { preorderSchema, type PreorderSchemaType } from "@/schemas/preorder.schema";
import { reservePreorderAction } from "@/actions/reserve-preorder";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import type { PreorderRecord } from "@/lib/types";

export default function PreordersPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [currentRole, setCurrentRole] = React.useState<"ADMIN" | "MEMBER" | "GUEST">("MEMBER");
  const [lastResult, setLastResult] = React.useState<PreorderRecord | null>(null);

  React.useEffect(() => {
    const cookie = document.cookie;
    if (cookie.includes("mock_session_guest")) {
      setCurrentRole("GUEST");
    } else if (cookie.includes("mock_session_admin")) {
      setCurrentRole("ADMIN");
    } else {
      setCurrentRole("MEMBER");
    }
  }, []);

  const form = useForm<PreorderSchemaType>({
    resolver: zodResolver(preorderSchema),
    defaultValues: {
      customerName:
        currentRole === "ADMIN"
          ? "Neo Vance (Lead Architect)"
          : currentRole === "GUEST"
          ? "Cipher Smith (Guest)"
          : "Trinity Cole (VIP Collector)",
      email:
        currentRole === "ADMIN"
          ? "admin@stephigh.com"
          : currentRole === "GUEST"
          ? "guest@stephigh.com"
          : "member@stephigh.com",
      shoeModel: "AeroStride Zero-G",
      shoeSize: 10.5,
      preferredColor: "Volt Neon",
      shippingZip: "94016",
      agreeToTerms: true,
    },
    mode: "onBlur",
  });

  React.useEffect(() => {
    form.setValue(
      "customerName",
      currentRole === "ADMIN"
        ? "Neo Vance (Lead Architect)"
        : currentRole === "GUEST"
        ? "Cipher Smith (Guest)"
        : "Trinity Cole (VIP Collector)"
    );
    form.setValue(
      "email",
      currentRole === "ADMIN"
        ? "admin@stephigh.com"
        : currentRole === "GUEST"
        ? "guest@stephigh.com"
        : "member@stephigh.com"
    );
  }, [currentRole, form]);

  async function onSubmit(values: PreorderSchemaType) {
    startTransition(async () => {
      try {
        const response = await reservePreorderAction(values);

        if (!response.success) {
          toast({
            variant: "destructive",
            title: "Pre-order Denied",
            description: response.message,
          });
          return;
        }

        if (response.data) {
          setLastResult(response.data);
          toast({
            variant: "success",
            title: "Pre-Order Allocated",
            description: `Order code: ${response.data.reservationId}. Confirmation logged.`,
          });
        }
      } catch (err: unknown) {
        toast({
          variant: "destructive",
          title: "Execution Error",
          description: err instanceof Error ? err.message : "Error executing pre-order.",
        });
      }
    });
  }

  return (
    <div className="container max-w-3xl py-10 space-y-6 font-mono">
      {/* Header Banner */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex flex-col sm:flex-row justify-between sm:items-end gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
            Allocation Portal
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-stone-900 dark:text-white">
            Sneaker Pre-Order
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Protected by Next.js Server Action, PostgreSQL persistence, and Edge RBAC.
          </p>
        </div>

        <Link href="/records">
          <Button variant="outline" size="sm" className="rounded-none text-xs uppercase h-8">
            View Ledger
          </Button>
        </Link>
      </div>

      {/* Guest Notice */}
      {currentRole === "GUEST" && (
        <div className="p-3.5 border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 text-xs space-y-1">
          <div className="font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            [Notice] Guest Tier Active
          </div>
          <p className="text-stone-500">
            Guest accounts are restricted from placing orders by the RBAC middleware. Submitting will return 403 Forbidden.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1 font-bold text-stone-900 dark:text-stone-100 underline text-[11px] pt-1"
          >
            <span>Switch to Member role in Gateway</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Pre-Order Form Card */}
      <Card className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-none shadow-sm">
        <CardHeader className="p-5 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Configure Allocation
            </CardTitle>
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700 px-2 py-0.5">
              $240.00 USD
            </span>
          </div>
          <CardDescription className="text-[11px] font-mono text-stone-500 mt-1">
            Commits directly to the normalized PostgreSQL database and dispatches Resend notifications.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold text-stone-500">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Trinity Cole"
                          disabled={isPending}
                          className="bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-none text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold text-stone-500">
                        Notification Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="member@stephigh.com"
                          disabled={isPending}
                          className="bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-none text-xs font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sneaker Model */}
              <FormField
                control={form.control}
                name="shoeModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold text-stone-500">
                      Silhouette Model
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full rounded-none border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-3 py-1 text-xs text-stone-900 dark:text-stone-100"
                        disabled={isPending}
                        {...field}
                      >
                        <option value="AeroStride Zero-G">AeroStride Zero-G (Sub-170g runner)</option>
                        <option value="Quantum Foam V2 (Carbon Edition)">Quantum Foam V2 Carbon</option>
                        <option value="Graviton Pulse Track">Graviton Pulse Track</option>
                        <option value="Apex Vapor Glide">Apex Vapor Glide</option>
                        <option value="Lunar Tempo Nitro">Lunar Tempo Nitro</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Size & Colorway */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="shoeSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold text-stone-500">
                        Size (US)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          min="5"
                          max="15"
                          disabled={isPending}
                          className="bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-none text-xs font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold text-stone-500">
                        Colorway
                      </FormLabel>
                      <FormControl>
                        <select
                          className="flex h-9 w-full rounded-none border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-3 py-1 text-xs text-stone-900 dark:text-stone-100"
                          disabled={isPending}
                          {...field}
                        >
                          <option value="Volt Neon">Volt Neon</option>
                          <option value="Triple Black">Triple Black</option>
                          <option value="Cloud White">Cloud White</option>
                          <option value="Lunar Grey">Lunar Grey</option>
                          <option value="Aurora Blue">Aurora Blue</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Zip & Agreement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <FormField
                  control={form.control}
                  name="shippingZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold text-stone-500">
                        Postal Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="94016"
                          disabled={isPending}
                          className="bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 rounded-none text-xs font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-2 space-y-0 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 p-2.5 mt-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 mt-0.5 rounded-none border-stone-300 dark:border-stone-700 text-stone-900"
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <div className="space-y-0.5 leading-none">
                        <FormLabel className="text-[11px] font-mono text-stone-700 dark:text-stone-300 cursor-pointer">
                          Accept Allocation Policy
                        </FormLabel>
                        <FormDescription className="text-[9px] text-stone-400">
                          Limit 1 pair per account.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-10 font-mono uppercase tracking-wider text-xs rounded-none bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 transition-colors mt-2"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Processing Transaction...</span>
                  </span>
                ) : (
                  <span>Execute Pre-Order Server Action</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-2.5 px-5 text-[10px] text-stone-500 flex items-center justify-between">
          <span>Role Session: {currentRole}</span>
          <span>Prisma & Resend Integrated</span>
        </CardFooter>
      </Card>

      {/* Confirmation Result Card */}
      {lastResult && (
        <Card className="border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 rounded-none shadow-sm">
          <CardHeader className="p-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100">
              <CheckCircle2 className="h-4 w-4" />
              <CardTitle className="text-xs font-bold uppercase tracking-wider">
                Pre-Order Confirmed
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
                <span className="text-stone-400 block text-[9px] uppercase">Order Number</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{lastResult.reservationId}</span>
              </div>
              <div className="p-2 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
                <span className="text-stone-400 block text-[9px] uppercase">Queue Position</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">#{lastResult.queueSpotNumber}</span>
              </div>
            </div>

            <p className="text-stone-500 text-[11px]">
              Recipient: {lastResult.email} &bull; Model: {lastResult.shoeModel} ({lastResult.preferredColor}, Size {lastResult.shoeSize})
            </p>

            <Link href="/records" className="text-stone-900 dark:text-stone-100 font-bold underline text-[11px] inline-block pt-1">
              Inspect in Live Ledger &rarr;
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
