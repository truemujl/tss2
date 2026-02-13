"use client";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import Image from "next/image";

interface HeroProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    posterImage?: string;
}

export default function Hero({
    title = "Безопасный VPN для свободного интернета",
    subtitle = "Тсс! VPN — надёжный сервис для свободного интернета. Работает везде, настраивается за 2 минуты.",
    ctaText = "Подключить VPN",
    posterImage = "/hero-poster-v1.jpg"
}: HeroProps) {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                    {/* Left Column: Text */}
                    <div className="flex-1 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                                {title}
                            </h1>

                            <p className="text-lg md:text-xl text-brand-text-dim mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                                {subtitle}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center">
                                <motion.a
                                    href="#pricing"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-brand-accent text-white px-8 py-4 text-lg font-bold rounded-full hover:shadow-[0_0_30px_var(--color-brand-accent-glow)] transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                                >
                                    <Shield size={20} />
                                    {ctaText}
                                </motion.a>

                                <motion.a
                                    href="#features"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="text-brand-text-dim px-8 py-4 text-lg font-medium hover:text-white transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                                >
                                    <Lock size={20} />
                                    Подробнее
                                </motion.a>
                            </div>

                            {/* Minimalist indicators */}
                            <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6 text-brand-text-dim text-xs font-semibold tracking-widest uppercase opacity-50">
                                <span className="flex items-center gap-2">No Logs</span>
                                <span className="flex items-center gap-2">VLESS/Reality</span>
                                <span className="flex items-center gap-2">Global Access</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Poster Image */}
                    <div className="flex-1 w-full max-w-[500px] relative">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl glass">
                                <Image
                                    src={posterImage}
                                    alt="TssVPN Poster"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 500px"
                                    priority
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Subtle light effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] max-h-[800px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
}
