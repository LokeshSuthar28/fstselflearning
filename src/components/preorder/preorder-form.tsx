"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  CheckCircle2,
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
        spotNumber: "Processing...",
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
            title: "Pre-Order Spot Confirmed",
            description: `${confirmed.customerName} allocated queue position #${confirmed.queueSpotNumber} for ${confirmed.shoeModel}.`,
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
              : "Unable to complete reservation mutation.",
        });
      }
    });
  }

  return (
    <div id="preorder-section" className="space-y-6 w-full max-w-2xl mx-auto font-mono">
      <Card className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-none shadow-sm">
        <CardHeader className="p-5 border-b border-stone-200 dark:border-stone-800">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Limited Edition Pre-Order
          </CardTitle>
          <CardDescription className="text-xs font-mono text-stone-500 mt-0.5">
            Strict batch reservation executed via type-safe Next.js Server Actions.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Customer Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jordan Hunter"
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
                      <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                        Notification Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jordan@stephigh.com"
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

              {/* Sneaker Model Selector */}
              <FormField
                control={form.control}
                name="shoeModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                      Silhouette Model
                    </FormLabel>
                    <FormControl>
                      <select
                        className="flex h-9 w-full rounded-none border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-3 py-1 text-xs text-stone-900 dark:text-stone-100 disabled:opacity-50"
                        disabled={isPending}
                        {...field}
                      >
                        <option value="AeroStride Zero-G">AeroStride Zero-G (Ultra-light 165g)</option>
                        <option value="Quantum Foam V2 (Carbon Edition)">Quantum Foam V2 Carbon</option>
                        <option value="Graviton Pulse Track">Graviton Pulse Track</option>
                        <option value="Apex Vapor Glide">Apex Vapor Glide</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shoe Size & Colorway Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="shoeSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                        Size (US 5.0 - 15.0)
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
                      <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                        Colorway
                      </FormLabel>
                      <FormControl>
                        <select
                          className="flex h-9 w-full rounded-none border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 px-3 py-1 text-xs text-stone-900 dark:text-stone-100 disabled:opacity-50"
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

              {/* Shipping Zip & Agreement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                <FormField
                  control={form.control}
                  name="shippingZip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                        Postal Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="10001"
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

              {/* Minimalist CTA Button */}
              <Button
                type="submit"
                className="w-full h-10 font-mono uppercase tracking-wider text-xs rounded-none bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 transition-colors mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Allocating Queue Slot...</span>
                  </span>
                ) : (
                  <span>Submit Pre-Order Reservation</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-2.5 px-5 text-[10px] text-stone-500 flex items-center justify-between">
          <span>Type-Safe Server Mutation</span>
          <span>Prisma & Resend Integrated</span>
        </CardFooter>
      </Card>

      {/* OPTIMISTIC LIVE FEED */}
      {optimisticQueue.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-stone-500">
            <span>Live Allocation Feed</span>
            <span>[{optimisticQueue.length} items]</span>
          </div>

          <div className="space-y-1.5">
            {optimisticQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 text-xs font-mono"
              >
                <div className="flex items-center gap-2.5">
                  {item.status === "optimistic_pending" ? (
                    <Loader2 className="h-3.5 w-3.5 text-stone-400 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-stone-900 dark:text-stone-100" />
                  )}
                  <div>
                    <div className="font-bold text-stone-900 dark:text-stone-100">
                      {item.name} &bull; {typeof item.spotNumber === "number" ? `Spot #${item.spotNumber}` : item.spotNumber}
                    </div>
                    <div className="text-[10px] text-stone-500">
                      {item.model} &bull; Size {item.size} &bull; {item.color}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] border border-stone-300 dark:border-stone-700 px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 block">
                    {item.status === "optimistic_pending" ? "SYNCING" : "CONFIRMED"}
                  </span>
                  <span className="text-[9px] text-stone-400 block mt-1">
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
