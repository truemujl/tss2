"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Monitor } from "lucide-react";

interface InstallStep {
    title: string;
    steps: string[];
}

interface InstallationTabsProps {
    data?: {
        ios: InstallStep;
        android: InstallStep;
        windows: InstallStep;
        mac: InstallStep;
    };
}

export default function InstallationTabs({ data }: InstallationTabsProps) {
    const [activeTab, setActiveTab] = useState<"mobile" | "desktop">("mobile");

    const defaultData = {
        ios: { title: "iOS", steps: ["Скачайте 'V2Box' из App Store", "Скопируйте ключ из ЛК", "Добавьте через '+'", "Подключитесь"] },
        android: { title: "Android", steps: ["Скачайте 'v2rayNG' из Play Store", "Скопируйте ключ из ЛК", "Импорт из буфера", "Подключитесь"] },
        windows: { title: "Windows", steps: ["Скачайте 'v2rayN'", "Запустите", "Импорт из буфера", "Включите системный прокси"] },
        mac: { title: "macOS", steps: ["Скачайте 'FoXray'", "Скопируйте ключ", "Добавьте через '+'", "Подключитесь"] }
    };

    const inst = data || defaultData;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8 gap-4">
                <button
                    onClick={() => setActiveTab("mobile")}
                    className={`flex items-center gap-2 px-6 py-3 font-heading rounded-lg border transition-all ${activeTab === "mobile"
                        ? "bg-brand-teal text-brand-navy border-brand-teal shadow-lg"
                        : "text-brand-cream border-brand-teal/30 hover:border-brand-teal"
                        }`}
                >
                    <Smartphone size={20} /> Мобильные
                </button>
                <button
                    onClick={() => setActiveTab("desktop")}
                    className={`flex items-center gap-2 px-6 py-3 font-heading rounded-lg border transition-all ${activeTab === "desktop"
                        ? "bg-brand-teal text-brand-navy border-brand-teal shadow-lg"
                        : "text-brand-cream border-brand-teal/30 hover:border-brand-teal"
                        }`}
                >
                    <Monitor size={20} /> Компьютеры
                </button>
            </div>

            <div className="bg-brand-dark/60 backdrop-blur-md border border-brand-teal/20 rounded-2xl p-8 min-h-[300px]">
                <AnimatePresence mode="wait">
                    {activeTab === "mobile" ? (
                        <motion.div
                            key="mobile"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <div>
                                <h3 className="text-xl font-heading text-brand-teal mb-4">{inst.ios.title}</h3>
                                <ul className="space-y-3 font-mono text-brand-cream/80 text-sm">
                                    {inst.ios.steps.map((s, i) => (
                                        <li key={i} className="flex gap-3"><span className="text-brand-teal font-bold">{i + 1}.</span> {s}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-heading text-brand-teal mb-4">{inst.android.title}</h3>
                                <ul className="space-y-3 font-mono text-brand-cream/80 text-sm">
                                    {inst.android.steps.map((s, i) => (
                                        <li key={i} className="flex gap-3"><span className="text-brand-teal font-bold">{i + 1}.</span> {s}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="desktop"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <div>
                                <h3 className="text-xl font-heading text-brand-teal mb-4">{inst.windows.title}</h3>
                                <ul className="space-y-3 font-mono text-brand-cream/80 text-sm">
                                    {inst.windows.steps.map((s, i) => (
                                        <li key={i} className="flex gap-3"><span className="text-brand-teal font-bold">{i + 1}.</span> {s}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-heading text-brand-teal mb-4">{inst.mac.title}</h3>
                                <ul className="space-y-3 font-mono text-brand-cream/80 text-sm">
                                    {inst.mac.steps.map((s, i) => (
                                        <li key={i} className="flex gap-3"><span className="text-brand-teal font-bold">{i + 1}.</span> {s}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
