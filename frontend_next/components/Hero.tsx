"use client";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import Image from "next/image";

interface HeroProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
}

export default function Hero({
    title = "Безопасный VPN для свободного интернета",
    subtitle = "Тсс! VPN — надёжный сервис для свободного интернета. Работает везде, настраивается за 2 минуты.",
    ctaText = "Подключить VPN"
}: HeroProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden gradient-hero">

            <div className="container mx-auto px-4 z-10 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-heading text-brand-cream mb-6 leading-tight">
                            {title}
                        </h1>

                        <p className="text-xl md:text-2xl text-brand-cream/80 mb-8 font-mono leading-relaxed">
                            {subtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.a
                                href="#pricing"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-brand-teal text-brand-navy px-8 py-4 text-xl font-heading rounded-lg hover:bg-brand-blue transition-all text-center flex items-center justify-center gap-3 box-shadow-soft"
                            >
                                <Shield size={24} />
                                {ctaText}
                            </motion.a>

                            <motion.a
                                href="#features"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="border-2 border-brand-cream/30 text-brand-cream px-8 py-4 text-xl font-heading rounded-lg hover:border-brand-teal hover:text-brand-teal transition-colors text-center flex items-center justify-center gap-3"
                            >
                                <Lock size={24} />
                                Узнать больше
                            </motion.a>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-12 flex flex-wrap gap-6 text-brand-muted font-mono text-sm">
                            <span>✓ Без логов</span>
                            <span>✓ Быстрые серверы</span>
                            <span>✓ Поддержка 24/7</span>
                        </div>
                    </motion.div>

                    {/* Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden lg:flex justify-center"
                    >
                        <div className="relative w-[400px] h-[500px] rounded-2xl overflow-hidden border-2 border-brand-teal/30 box-shadow-soft">
                            <Image
                                src="/hero-character.jpg"
                                alt="TssVPN"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
