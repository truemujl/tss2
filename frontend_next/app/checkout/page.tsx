"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { isLoggedIn } from "@/lib/api";

const plans: Record<string, { name: string; price: number; period: string }> = {
    basic: { name: "Пробный", price: 100, period: "1 месяц" },
    standard: { name: "Оптимальный", price: 250, period: "3 месяца" },
    premium: { name: "Максимум", price: 900, period: "12 месяцев" },
};

const locations = [
    { id: "fi", name: "Финляндия", flag: "🇫🇮" },
    { id: "nl", name: "Нидерланды", flag: "🇳🇱" },
    { id: "us", name: "США", flag: "🇺🇸" },
    { id: "tr", name: "Турция", flag: "🇹🇷" },
];

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planId = searchParams.get("plan") || "standard";
    const plan = plans[planId] || plans.standard;
    const [selectedLocation, setSelectedLocation] = useState("fi");

    useEffect(() => {
        if (!isLoggedIn()) {
            router.push(`/login?redirect=/checkout?plan=${planId}`);
        }
    }, [router, planId]);

    const [processing, setProcessing] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        // TODO: Integrate with payment provider
        setTimeout(() => {
            alert(`Оплата за тариф "${plan.name}" (${locations.find(l => l.id === selectedLocation)?.name}) будет интегрирована позже. Свяжитесь с поддержкой в Telegram.`);
            setProcessing(false);
        }, 1500);
    };

    return (
        <main className="min-h-screen gradient-hero py-20 px-4">
            <div className="container mx-auto max-w-2xl">
                {/* Back Link */}
                <Link
                    href="/#pricing"
                    className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-teal mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Назад к тарифам
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="relative h-12 w-12 mx-auto mb-4">
                            <Image src="/logo-icon.png" alt="TssVPN" fill className="object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-brand-cream">Оформление подписки</h1>
                    </div>

                    {/* Plan Summary */}
                    <div className="bg-brand-navy/50 border border-white/10 rounded-xl p-6 mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <div className="text-brand-teal text-sm">{plan.name}</div>
                                <div className="text-xl font-bold text-brand-cream">{plan.period}</div>
                            </div>
                            <div className="text-3xl font-bold text-brand-teal">{plan.price} ₽</div>
                        </div>
                        <ul className="text-sm text-brand-muted space-y-1">
                            <li>✓ Мгновенная активация</li>
                            <li>✓ Возврат в течение 7 дней</li>
                            <li>✓ Поддержка 24/7</li>
                        </ul>
                    </div>

                    {/* Location Selection */}
                    <div className="space-y-4 mb-8">
                        <h3 className="font-bold text-brand-cream">Выберите локацию сервера</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {locations.map((loc) => (
                                <button
                                    key={loc.id}
                                    onClick={() => setSelectedLocation(loc.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selectedLocation === loc.id
                                            ? "bg-brand-teal/20 border-brand-teal text-brand-cream"
                                            : "bg-brand-navy/50 border-white/10 text-brand-muted hover:border-white/20"
                                        }`}
                                >
                                    <span className="text-2xl">{loc.flag}</span>
                                    <span className="font-medium text-sm">{loc.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4 mb-8">
                        <h3 className="font-bold text-brand-cream">Способ оплаты</h3>

                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full flex items-center justify-center gap-3 bg-brand-teal text-brand-navy font-bold py-4 rounded-xl hover:bg-brand-blue transition-all disabled:opacity-50"
                        >
                            <CreditCard size={20} />
                            {processing ? "Обработка..." : "Оплатить картой"}
                        </button>

                        <button
                            onClick={() => window.open("https://t.me/tssvpn_bot?start=pay_" + planId + "_" + selectedLocation, "_blank")}
                            className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0099dd] text-white font-bold py-4 rounded-xl transition-all"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.12.098.153.228.166.331.014.103.03.338.017.521z" />
                            </svg>
                            Оплатить через Telegram
                        </button>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center gap-3 text-brand-muted text-sm">
                        <Shield size={18} className="text-brand-teal" />
                        <span>Безопасная оплата. Данные защищены шифрованием.</span>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen gradient-hero flex items-center justify-center text-brand-teal">Загрузка...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
