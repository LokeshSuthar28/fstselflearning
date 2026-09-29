"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sparkles,
  Loader2,
  Ticket,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {
  preorderSchema,
  type PreorderSchemaType,
} from "@/schemas/preorder.schema";
import { reservePreorderAction } from "@/actions/reserve-preorder";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { PreorderRecord } from "@/lib/types";

interface OptimisticQueueItem {
  id: string;
  spotNumber: number | string;
  name: string;
  model: string;
  size: number;
  color: string;
  status: "optimistic_pending" | "confirmed";
  timestamp: string;
}

export function PreorderForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [confirmedReservations, setConfirmedReservations] = React.useState<
    PreorderRecord[]
  >([]);

  // OPTIMISTIC UI: Instant reservation in the UI before server confirms
  const [optimisticQueue, setOptimisticQueue] = React.useOptimistic<
    OptimisticQueueItem[],
    OptimisticQueueItem
  >(
    confirmedReservations.map((res) => ({
      id: res.reservationId,
      spotNumber: res.queueSpotNumber,
      name: res.customerName,
      model: res.shoeModel,
      size: res.shoeSize,
      color: res.preferredColor,
      status: "confirmed",
      timestamp: res.createdAt,
    })),
    (state, newReservation) => [newReservation, ...state]
  );

  const form = useForm<PreorderSchemaType>({
    resolver: zodResolver(preorderSchema),
    defaultValues: {
      customerName: "Alex Mercer",
      email: "alex.mercer@stephigh.com",
      shoeModel: "AeroStride Zero-G",
      shoeSize: 10,
      preferredColor: "Volt Neon",
      shippingZip: "90210",
      agreeToTerms: true,
    },
    mode: "onBlur",
  });

  async function onSubmit(values: PreorderSchemaType) {
    startTransition(async () => {
      const temporaryId = `PENDING-${Date.now().toString().slice(-4)}`;
      setOptimisticQueue({
        id: temporaryId,
        spotNumber: "Securing Spot...",
        name: values.customerName,
        model: values.shoeModel,
        size: values.shoeSize,
        color: values.preferredColor,
        status: "optimistic_pending",
        timestamp: new Date().toISOString(),
      });

      try {
        const response = await reservePreorderAction(values);

        if (!response.success) {
          if (response.errors) {
            Object.entries(response.errors).forEach(([field, messages]) => {
              if (messages && messages[0]) {
                form.setError(field as keyof PreorderSchemaType, {
                  type: "server",
                  message: messages[0],
                });
              }
            });
          }

          toast({
            variant: "destructive",
            title: "Pre-order Reservation Failed",
            description: response.message,
          });
          return;
        }

        if (response.data) {
          const confirmed = response.data;
          setConfirmedReservations((prev) => [confirmed, ...prev]);

          toast({
            variant: "success",
            title: "Zero-G Priority Spot Secured!",
            description: `Congratulations ${confirmed.customerName}! You are #${confirmed.queueSpotNumber} in line for the ${confirmed.shoeModel} (${confirmed.preferredColor}).`,
          });

          form.reset({
            customerName: "",
            email: "",
            shoeModel: "AeroStride Zero-G",
            shoeSize: 10,
            preferredColor: "Triple Black",
            shippingZip: "",
            agreeToTerms: true,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Network Connection Issue",
          description:
            error instanceof Error
              ? error.message
              : "Unable to reach Step High reservation servers.",
        });
      }
    });
  }

  return (
    <div id="preorder-section" className="space-y-8 w-full max-w-2xl mx-auto">
      {/* 
        WARM FROSTED GLASS CONTAINER:
        backdrop-blur-md, bg-white/85 dark:bg-stone-900/60, border-amber-900/10
      */}
      <Card className="backdrop-blur-md bg-white/85 dark:bg-stone-900/60 border border-amber-900/10 dark:border-white/10 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ease-out">
        <CardHeader className="p-6 border-b border-amber-900/10 dark:border-white/10">
          <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
            <Ticket className="h-6 w-6" />
            <CardTitle className="text-xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 dark:from-amber-400 dark:to-orange-400">
              Limited Edition Zero-G Pre-Order
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Secure priority drop allocation. Validated isomorphically with Zod schemas and executed via native Next.js Server Actions.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Customer Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Jordan Hunter"
                          disabled={isPending}
                          className="bg-stone-50/80 dark:bg-stone-950/60 border-stone-200 dark:border-white/10 text-foreground transition-all duration-300 ease-out focus-visible:ring-amber-500 focus-visible:shadow-[0_0_15px_rgba(245,124,0,0.25)]"
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
                      <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        VIP Comms Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jordan@stephigh.com"
                          disabled={isPending}
                          className="bg-stone-50/80 dark:bg-stone-950/60 border-stone-200 dark:border-white/10 text-foreground transition-all duration-300 ease-out focus-visible:ring-amber-500 focus-visible:shadow-[0_0_15px_rgba(245,124,0,0.25)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sneaker Model Selector */}
              <FormField
                control={form.control}
                name="shoeModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Drop Silhouette Model
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-stone-200 dark:border-white/10 bg-stone-50/90 dark:bg-stone-950/70 px-3 py-1 text-sm shadow-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:shadow-[0_0_15px_rgba(245,124,0,0.25)] text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isPending}
                        {...field}
                      >
                        <option value="AeroStride Zero-G">
                          AeroStride Zero-G (Ultra-light 165g)
                        </option>
                        <option value="Quantum Foam V2 (Carbon Edition)">
                          Quantum Foam V2 - Carbon Edition (Sub-atomic rebound)
                        </option>
                        <option value="Graviton Pulse Track">
                          Graviton Pulse Track (Track & Field record edition)
                        </option>
                        <option value="Apex Vapor Glide">
                          Apex Vapor Glide (Atmospheric cushion)
                        </option>
                      </select>
                    </FormControl>
                    <FormDescription className="text-[11px] text-muted-foreground">
                      Numbered limited batch release.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shoe Size & Colorway Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="shoeSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        US Shoe Size (5.0 - 15.0)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.5"
                          min="5"
                          max="15"
                          disabled={isPending}
                          className="bg-stone-50/80 dark:bg-stone-950/60 border-stone-200 dark:border-white/10 text-foreground transition-all duration-300 ease-out focus-visible:ring-amber-500 focus-visible:shadow-[0_0_15px_rgba(245,124,0,0.25)] font-mono"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-[11px] text-muted-foreground">
                        Half increments accepted (e.g. 10.5).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Colorway Selection
                      </FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-stone-200 dark:border-white/10 bg-stone-50/90 dark:bg-stone-950/70 px-3 py-1 text-sm shadow-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:shadow-[0_0_15px_rgba(245,124,0,0.25)] text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={isPending}
                          {...field}
                        >
                          <option value="Volt Neon">Volt Neon (Signature Release)</option>
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

              {/* Shipping Zip & Agreement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="shippingZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Postal / Zip Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 10001"
                          disabled={isPending}
                          className="bg-stone-50/80 dark:bg-stone-950/60 border-stone-200 dark:border-white/10 text-foreground transition-all duration-300 ease-out focus-visible:ring-amber-500 focus-visible:shadow-[0_0_15px_rgba(245,124,0,0.25)] font-mono"
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
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50/60 dark:bg-stone-950/40 p-3 mt-1 sm:mt-6 transition-all duration-300 ease-out">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 mt-0.5 rounded border-stone-300 dark:border-white/20 bg-white dark:bg-stone-950 text-amber-600 focus:ring-amber-500 transition-all duration-300 ease-out cursor-pointer"
                          checked={field.value}
                          onChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs cursor-pointer font-medium text-foreground">
                          Accept VIP Queue Rules
                        </FormLabel>
                        <FormDescription className="text-[10px] text-muted-foreground">
                          Strict limit of 1 pair allocation per operative email.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* WARM AMBER CTA BUTTON */}
              <Button
                type="submit"
                className="w-full h-12 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-4 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_0_20px_rgba(245,124,0,0.35)] hover:shadow-[0_0_30px_rgba(245,124,0,0.55)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 ease-out"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Allocating Queue Slot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-white" />
                    <span>Reserve My Spot in Line (Server Action)</span>
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="bg-stone-100/60 dark:bg-stone-950/60 border-t border-amber-900/10 dark:border-white/10 py-3 px-6 text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Type-Safe Server Mutation</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-mono text-[11px]">
            <Zap className="h-3.5 w-3.5" />
            <span>Sub-100ms Atomic Queue</span>
          </div>
        </CardFooter>
      </Card>

      {/* OPTIMISTIC LIVE FEED */}
      {optimisticQueue.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
              Live Allocation Feed (Optimistic Sync)
            </h3>
            <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 rounded-full shadow-sm">
              Allocated: {optimisticQueue.length}
            </span>
          </div>

          <div className="space-y-2">
            {optimisticQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-amber-900/10 dark:border-white/10 bg-white/80 dark:bg-stone-900/50 backdrop-blur-md text-xs shadow-md transition-all duration-300 ease-out"
              >
                <div className="flex items-center gap-3">
                  {item.status === "optimistic_pending" ? (
                    <Loader2 className="h-4 w-4 text-amber-600 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2">
                      <span>{item.name}</span>
                      <span className="font-mono text-[11px] text-amber-600 dark:text-amber-400 font-black">
                        {typeof item.spotNumber === "number"
                          ? `Spot #${item.spotNumber}`
                          : item.spotNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {item.model} • Size US {item.size} • {item.color}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.status === "optimistic_pending"
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/25"
                        : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25"
                    }`}
                  >
                    {item.status === "optimistic_pending"
                      ? "Syncing"
                      : "Verified"}
                  </span>
                  <span className="font-mono text-muted-foreground text-[10px]">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
