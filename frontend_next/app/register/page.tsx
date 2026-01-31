"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }

        if (password.length < 6) {
            setError("Пароль должен быть не менее 6 символов");
            return;
        }

        setLoading(true);

        try {
            await register(username, password);
            setSuccess("Регистрация успешна! Перенаправление...");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    const handleTelegramRegister = () => {
        const botUsername = "tssvpn_bot";
        window.location.href = `https://t.me/${botUsername}?start=register`;
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-20 gradient-hero">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6">
                            <div className="relative h-12 w-12">
                                <Image
                                    src="/logo-icon.png"
                                    alt="TssVPN"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span
                                className="text-2xl font-bold"
                                style={{
                                    background: 'linear-gradient(180deg, #5DADE2 0%, #4ECDC4 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                tssvpn
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-brand-cream">
                            Регистрация
                        </h1>
                    </div>

                    {/* Telegram Register Button */}
                    <button
                        onClick={handleTelegramRegister}
                        className="w-full flex items-center justify-center gap-3 bg-[#0088cc] hover:bg-[#0099dd] text-white font-medium py-4 rounded-xl mb-6 transition-all"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.12.098.153.228.166.331.014.103.03.338.017.521z" />
                        </svg>
                        Регистрация через Telegram
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-brand-dark text-brand-muted">или</span>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-brand-red/20 border border-brand-red/50 text-brand-red p-4 rounded-xl mb-6 flex items-center gap-3"
                        >
                            <AlertCircle size={20} />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-green-500/20 border border-green-500/50 text-green-400 p-4 rounded-xl mb-6 flex items-center gap-3"
                        >
                            <CheckCircle size={20} />
                            {success}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-brand-muted font-medium mb-2 text-sm">
                                Логин
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full bg-brand-navy/50 border border-white/10 text-brand-cream p-4 rounded-xl focus:border-brand-teal focus:outline-none transition-colors"
                                placeholder="Придумайте логин"
                            />
                        </div>

                        <div>
                            <label className="block text-brand-muted font-medium mb-2 text-sm">
                                Пароль
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-brand-navy/50 border border-white/10 text-brand-cream p-4 rounded-xl focus:border-brand-teal focus:outline-none transition-colors"
                                placeholder="Минимум 6 символов"
                            />
                        </div>

                        <div>
                            <label className="block text-brand-muted font-medium mb-2 text-sm">
                                Подтвердите пароль
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full bg-brand-navy/50 border border-white/10 text-brand-cream p-4 rounded-xl focus:border-brand-teal focus:outline-none transition-colors"
                                placeholder="Повторите пароль"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-teal text-brand-navy font-bold py-4 rounded-xl hover:bg-brand-blue transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                "Создание аккаунта..."
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Зарегистрироваться
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-brand-muted">
                        Уже есть аккаунт?{" "}
                        <Link href="/login" className="text-brand-teal hover:underline font-medium">
                            Войти
                        </Link>
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
