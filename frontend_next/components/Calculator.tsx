"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Activity, CheckCircle } from "lucide-react";

const regions = [
    { id: "msk", name: "Москва" },
    { id: "spb", name: "Санкт-Петербург" },
    { id: "ural", name: "Екатеринбург" },
    { id: "sib", name: "Новосибирск" },
];

interface CalculatorProps {
    title?: string;
}

export default function Calculator({ title = "Проверка скорости соединения" }: CalculatorProps) {
    const [selectedRegion, setSelectedRegion] = useState(regions[0].id);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<number | null>(null);

    const handleCheck = () => {
        setLoading(true);
        setResult(null);
        setTimeout(() => {
            setLoading(false);
            setResult(Math.floor(Math.random() * 30) + 40);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto bg-brand-dark border border-brand-teal/20 rounded-2xl p-8 box-shadow-soft">
            <h3 className="text-2xl font-heading text-brand-cream mb-6 text-center flex items-center justify-center gap-3">
                <Activity className="text-brand-teal" />
                {title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-brand-teal font-mono mb-3 text-sm">Ваш город:</label>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {regions.map((region) => (
                            <button
                                key={region.id}
                                onClick={() => setSelectedRegion(region.id)}
                                className={`p-3 font-mono text-sm rounded-lg border transition-all ${selectedRegion === region.id
                                    ? "bg-brand-teal text-brand-navy border-brand-teal"
                                    : "border-brand-teal/30 text-brand-cream hover:border-brand-teal"
                                    }`}
                            >
                                {region.name}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className="w-full bg-brand-teal text-brand-navy font-heading py-4 rounded-lg text-lg hover:bg-brand-blue transition-colors disabled:opacity-50"
                    >
                        {loading ? "Проверяем..." : "Проверить скорость"}
                    </button>
                </div>

                <div className="bg-brand-navy/50 border border-brand-teal/20 rounded-xl p-6 flex flex-col items-center justify-center min-h-[200px]">
                    {loading && (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        >
                            <Activity size={48} className="text-brand-teal" />
                        </motion.div>
                    )}

                    {!loading && !result && (
                        <div className="text-center text-brand-muted">
                            <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                            <p className="font-mono">Выберите город и нажмите проверить</p>
                        </div>
                    )}

                    {result && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <CheckCircle size={48} className="text-green-400 mx-auto mb-2" />
                            <div className="text-4xl font-heading text-brand-cream mb-2">{result} ms</div>
                            <div className="font-mono text-green-400">Отличное соединение</div>
                            <div className="text-xs text-brand-muted mt-2">Сервер: Амстердам</div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
