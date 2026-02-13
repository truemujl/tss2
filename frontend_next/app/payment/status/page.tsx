"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Clock, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { checkPaymentStatus } from "@/lib/api";

type PaymentState = "loading" | "pending" | "confirmed" | "canceled" | "fail" | "error";

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    // Try URL param first, then sessionStorage (which has the real Platega tx_id)
    const urlTx = searchParams.get("tx") || "";
    const storedTx = typeof window !== "undefined" ? sessionStorage.getItem("last_payment_tx") || "" : "";
    // Use stored tx (real Platega ID) if available, otherwise URL param (temp_id)
    const txId = storedTx || urlTx;
    const [status, setStatus] = useState<PaymentState>("loading");
    const [pollCount, setPollCount] = useState(0);
    const MAX_POLLS = 60; // 5 min max (every 5s)

    const pollStatus = useCallback(async () => {
        if (!txId) {
            setStatus("error");
            return;
        }

        try {
            const result = await checkPaymentStatus(txId);
            const s = result.status?.toUpperCase();

            if (s === "CONFIRMED") {
                setStatus("confirmed");
            } else if (s === "CANCELED") {
                setStatus("canceled");
            } else if (s === "FAIL") {
                setStatus("fail");
            } else {
                setStatus("pending");
            }
        } catch (err) {
            console.error("Status check error:", err);
            setStatus("error");
        }
    }, [txId]);

    useEffect(() => {
        pollStatus();
    }, [pollStatus]);

    // Auto-poll while pending
    useEffect(() => {
        if (status !== "pending" && status !== "loading") return;
        if (pollCount >= MAX_POLLS) return;

        const timer = setTimeout(() => {
            setPollCount(c => c + 1);
            pollStatus();
        }, 5000);

        return () => clearTimeout(timer);
    }, [status, pollCount, pollStatus]);

    const statusConfig: Record<PaymentState, {
        icon: React.ReactNode;
        title: string;
        description: string;
        color: string;
        bgColor: string;
    }> = {
        loading: {
            icon: <Loader2 size={48} className="animate-spin" />,
            title: "Проверяем платёж...",
            description: "Подождите, мы запрашиваем статус вашего платежа.",
            color: "text-brand-accent",
            bgColor: "bg-brand-accent/10",
        },
        pending: {
            icon: <Clock size={48} />,
            title: "Ожидаем подтверждение",
            description: "Платёж обрабатывается. Обычно это занимает несколько минут. Страница обновится автоматически.",
            color: "text-yellow-400",
            bgColor: "bg-yellow-400/10",
        },
        confirmed: {
            icon: <CheckCircle size={48} />,
            title: "Оплата прошла успешно!",
            description: "Ваша подписка активирована. Ключ доступен в личном кабинете или в Telegram-боте.",
            color: "text-green-400",
            bgColor: "bg-green-400/10",
        },
        canceled: {
            icon: <XCircle size={48} />,
            title: "Платёж отменён",
            description: "Вы можете попробовать снова или выбрать другой способ оплаты.",
            color: "text-orange-400",
            bgColor: "bg-orange-400/10",
        },
        fail: {
            icon: <XCircle size={48} />,
            title: "Ошибка платежа",
            description: "Произошла ошибка при обработке платежа. Попробуйте снова или обратитесь в поддержку.",
            color: "text-red-400",
            bgColor: "bg-red-400/10",
        },
        error: {
            icon: <XCircle size={48} />,
            title: "Ошибка проверки",
            description: "Не удалось проверить статус платежа. Попробуйте позже или свяжитесь с поддержкой.",
            color: "text-red-400",
            bgColor: "bg-red-400/10",
        },
    };

    const config = statusConfig[status];

    return (
        <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center"
            >
                <div className={`glass rounded-[40px] p-10 space-y-8`}>
                    {/* Status Icon */}
                    <div className={`w-24 h-24 rounded-full ${config.bgColor} ${config.color} flex items-center justify-center mx-auto`}>
                        {config.icon}
                    </div>

                    {/* Status Text */}
                    <div className="space-y-3">
                        <h1 className="text-2xl font-bold text-white">{config.title}</h1>
                        <p className="text-brand-text-dim text-sm leading-relaxed">{config.description}</p>
                    </div>

                    {/* Pending pulse indicator */}
                    {status === "pending" && (
                        <div className="flex items-center justify-center gap-2 text-yellow-400/70 text-xs">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            Автоматическое обновление каждые 5 секунд
                        </div>
                    )}

                    {/* Transaction ID */}
                    {txId && (
                        <div className="text-xs text-brand-text-dim/50 font-mono break-all">
                            ID: {txId}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                        {status === "confirmed" && (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="w-full bg-brand-accent text-white font-bold py-4 rounded-2xl hover:shadow-[0_0_30px_var(--color-brand-accent-glow)] transition-all flex items-center justify-center gap-2"
                                >
                                    <Home size={18} />
                                    Перейти в кабинет
                                </Link>
                                <a
                                    href="https://t.me/tssvpn_bot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                >
                                    Получить ключ в боте
                                </a>
                            </>
                        )}

                        {(status === "canceled" || status === "fail" || status === "error") && (
                            <Link
                                href="/#pricing"
                                className="w-full bg-brand-accent text-white font-bold py-4 rounded-2xl hover:shadow-[0_0_30px_var(--color-brand-accent-glow)] transition-all flex items-center justify-center gap-2"
                            >
                                <RotateCcw size={18} />
                                Попробовать снова
                            </Link>
                        )}

                        <Link
                            href="/"
                            className="w-full bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Home size={18} />
                            На главную
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        </main>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-brand-teal">Загрузка...</div>}>
            <PaymentStatusContent />
        </Suspense>
    );
}
