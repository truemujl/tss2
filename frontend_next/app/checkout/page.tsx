"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Shield, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { isLoggedIn, getToken, createPayment } from "@/lib/api";

const plans: Record<string, { name: string; price: number; period: string; id: string }> = {
    plan_1m_new: { id: "plan_1m_new", name: "Стартовый", price: 99, period: "1 месяц" },
    plan_3m_new: { id: "plan_3m_new", name: "Оптимальный", price: 249, period: "3 месяца" },
    plan_1y_new: { id: "plan_1y_new", name: "Максимум", price: 1000, period: "1 год" },
};

const locations = [
    { id: "nl", name: "Нидерланды", flag: "🇳🇱" },
    { id: "de", name: "Германия", flag: "🇩🇪" },
    { id: "us", name: "США", flag: "🇺🇸" },
    { id: "fi", name: "Финляндия", flag: "🇫🇮" },
    { id: "md", name: "Молдова", flag: "🇲🇩" },
    { id: "kz", name: "Казахстан", flag: "🇰🇿" },
];

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planId = searchParams.get("plan") || "plan_3m_new";
    const plan = plans[planId] || plans.plan_3m_new;
    const initialLocation = searchParams.get("loc") || "nl";
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        setError(null);

        // Check if user is logged in
        if (!isLoggedIn()) {
            router.push(`/login?redirect=/checkout?plan=${planId}&loc=${selectedLocation}`);
            return;
        }

        setProcessing(true);

        try {
            // Decode JWT to get user_id
            const token = getToken();
            if (!token) {
                router.push(`/login?redirect=/checkout?plan=${planId}&loc=${selectedLocation}`);
                return;
            }

            // Parse JWT payload (base64url encoded)
            const payloadBase64 = token.split(".")[1];
            const payload = JSON.parse(atob(payloadBase64));
            const userId = payload.user_id;

            if (!userId) {
                setError("Не удалось определить пользователя. Попробуйте войти заново.");
                setProcessing(false);
                return;
            }

            const locationName = locations.find(l => l.id === selectedLocation)?.name || selectedLocation;

            // Call backend to create Platega payment
            const result = await createPayment(userId, planId, plan.price, locationName);

            if (result.payment_url) {
                // Save transaction_id for status page lookup
                if (result.transaction_id) {
                    sessionStorage.setItem("last_payment_tx", result.transaction_id);
                }
                // Redirect to Platega payment page
                window.location.href = result.payment_url;
            } else {
                setError("Не удалось создать платёж. Попробуйте ещё раз.");
                setProcessing(false);
            }
        } catch (err: any) {
            console.error("Payment error:", err);
            setError(err.message || "Произошла ошибка при создании платежа.");
            setProcessing(false);
        }
    };

    return (
        <main className="min-h-screen py-24 px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-4xl relative z-10">
                {/* Back Link */}
                <Link
                    href="/#pricing"
                    className="inline-flex items-center gap-2 text-brand-text-dim hover:text-white mb-12 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    К выбору тарифа
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Main Selection Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3 space-y-10"
                    >
                        {/* Location Selection */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Где будет ваш сервер?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {locations.map((loc) => (
                                    <button
                                        key={loc.id}
                                        onClick={() => setSelectedLocation(loc.id)}
                                        className={`flex items-center justify-between p-6 rounded-3xl border transition-all duration-300 ${selectedLocation === loc.id
                                            ? "glass border-brand-accent/50 shadow-[0_0_20px_rgba(58,142,246,0.1)]"
                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-3xl">{loc.flag}</span>
                                            <span className="font-semibold text-white">{loc.name}</span>
                                        </div>
                                        {selectedLocation === loc.id && (
                                            <div className="w-5 h-5 rounded-full bg-brand-accent flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="glass p-6 rounded-3xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent shrink-0">
                                <Shield size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Защищенное соединение</h4>
                                <p className="text-brand-text-dim text-sm leading-relaxed">
                                    Весь трафик шифруется по протоколу VLESS с маскировкой Reality. Ваши данные защищены.
                                </p>
                            </div>
                        </div>

                        {/* Payment Methods Notice */}
                        <div className="glass p-6 rounded-3xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 shrink-0">
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Способы оплаты</h4>
                                <p className="text-brand-text-dim text-sm leading-relaxed">
                                    Банковские карты РФ, СБП, криптовалюта. Платёж обрабатывается через защищённый платёжный шлюз.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Summary Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="glass rounded-[40px] p-8 sticky top-28">
                            <h3 className="text-xl font-bold text-white mb-8">Детали заказа</h3>

                            <div className="space-y-6 mb-8 pb-8 border-b border-white/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-brand-text-dim">Тариф</span>
                                    <span className="text-white font-bold">{plan.name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-brand-text-dim">Период</span>
                                    <span className="text-white font-bold">{plan.period}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-brand-text-dim">Страна</span>
                                    <span className="text-white font-bold">
                                        {locations.find(l => l.id === selectedLocation)?.flag}{" "}
                                        {locations.find(l => l.id === selectedLocation)?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-brand-text-dim">Устройства</span>
                                    <span className="text-white font-bold">До 10</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-10">
                                <span className="text-brand-text-dim font-medium">К оплате</span>
                                <div className="text-right">
                                    <div className="text-4xl font-bold text-white tracking-tighter">{plan.price} ₽</div>
                                    <div className="text-xs text-brand-text-dim uppercase tracking-widest mt-1">Все налоги включены</div>
                                </div>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="mb-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
                                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                                    <p className="text-red-300 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full bg-brand-accent text-white font-bold py-5 rounded-2xl hover:shadow-[0_0_30px_var(--color-brand-accent-glow)] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Создаём платёж...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={20} />
                                        Перейти к оплате
                                    </>
                                )}
                            </button>

                            <p className="mt-6 text-center text-xs text-brand-text-dim leading-relaxed">
                                Нажимая кнопку, вы принимаете условия <br />
                                <Link href="/docs/terms" className="text-white hover:underline">публичной оферты</Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
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
