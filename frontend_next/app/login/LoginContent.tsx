"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken } from "@/lib/api";
import dynamicImport from 'next/dynamic';

const DynamicNewTelegramAuth = dynamicImport(() => import('@/components/NewTelegramAuth'), {
  ssr: false,
});

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams(); // useSearchParams теперь внутри Client Component
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const redirectPath = searchParams.get("redirect") || "/dashboard";
    const plan = searchParams.get("plan");
    const loc = searchParams.get("loc");

    // Listen for messages from the auth popup window
    useEffect(() => {
        const handleMessage = (event: any) => {
            if (event.data.type === 'TELEGRAM_AUTH_SUCCESS') {
                setToken(event.data.token);
                // Construct the final redirect URL with preserved params
                let finalUrl = redirectPath;
                if (plan || loc) {
                    const params = new URLSearchParams();
                    if (plan) params.append("plan", plan);
                    if (loc) params.append("loc", loc);
                    finalUrl += (finalUrl.includes('?') ? '&' : '?') + params.toString();
                }
                router.push(finalUrl);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [router, redirectPath, plan, loc]);

    return (
        <main className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass rounded-[48px] p-12 text-center">
                    {/* Header */}
                    <div className="mb-12">
                        <Link href="/" className="inline-flex items-center gap-3 mb-10">
                            <div className="relative h-12 w-12 glass flex items-center justify-center rounded-2xl">
                                <Image
                                    src="/logo-icon.png"
                                    alt="TssVPN"
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                tssvpn
                            </span>
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
                            Добро пожаловать
                        </h1>
                        <p className="text-brand-text-dim leading-relaxed">
                            Используйте Telegram для мгновенного входа в аккаунт и управления вашим VPN.
                        </p>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm"
                            >
                                <AlertCircle size={18} />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Telegram Login Button */}
                    <div className="flex justify-center mb-10 py-4 glass bg-white/5 border-white/5 rounded-3xl">
                        <DynamicNewTelegramAuth />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-xs text-brand-text-dim uppercase tracking-widest justify-center">
                            <div className="h-px w-8 bg-white/5" />
                            <span>Безопасно через Telegram</span>
                            <div className="h-px w-8 bg-white/5" />
                        </div>

                        <p className="text-xs text-brand-text-dim leading-relaxed px-4">
                            Мы не получаем доступа к вашему паролю или номеру телефона. <br />
                            Только публичный профиль.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
        </main>
    );
}