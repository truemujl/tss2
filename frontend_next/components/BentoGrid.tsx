"use client";
import { motion } from "framer-motion";
import { Eye, Zap, MonitorSmartphone, ShieldCheck } from "lucide-react";

const defaultFeatures = [
    {
        title: "Стабильное соединение",
        desc: "Современный протокол VLESS/Reality обеспечивает надёжное и защищённое подключение в любой сети.",
        icon: Eye,
        colSpan: "col-span-1 md:col-span-2",
    },
    {
        title: "Минимальные задержки",
        desc: "Серверы с пингом от 5 мс и каналом до 1 Гбит/с. Идеально для видео 4K, звонков и онлайн-игр.",
        icon: Zap,
    },
    {
        title: "До 10 устройств",
        desc: "Один ключ на все платформы: iOS, Android, Windows, macOS и роутеры — без ограничений.",
        icon: MonitorSmartphone,
    },
    {
        title: "Конфиденциальность",
        desc: "Строгая политика No-Logs. Мы не храним и не передаём данные о подключениях.",
        icon: ShieldCheck,
        colSpan: "col-span-1 md:col-span-2",
    }
];

interface BentoGridProps {
    features?: Array<{ title: string; desc: string }>;
}

export default function BentoGrid({ features: cmsFeatures }: BentoGridProps) {
    const icons = [Eye, Zap, MonitorSmartphone, ShieldCheck];
    const displayFeatures = cmsFeatures ? cmsFeatures.map((f, i) => ({
        ...f,
        icon: icons[i % icons.length],
        colSpan: i === 0 || i === 3 ? "col-span-1 md:col-span-2" : "col-span-1"
    })) : defaultFeatures;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {displayFeatures.map((feature, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`${feature.colSpan || "col-span-1"} bg-brand-dark border border-brand-teal/20 rounded-xl p-6 hover:border-brand-teal/50 transition-all group`}
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-brand-teal/10 rounded-lg text-brand-teal group-hover:bg-brand-teal group-hover:text-brand-navy transition-all">
                            <feature.icon size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-heading text-brand-cream mb-2">{feature.title}</h3>
                            <p className="font-mono text-brand-muted text-sm">{feature.desc}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
