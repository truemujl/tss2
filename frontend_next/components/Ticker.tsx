interface TickerProps {
    message?: string;
}

export default function Ticker({
    message = "✦ Быстрое подключение ✦ Работает в России ✦ Без ограничений скорости ✦ Поддержка 24/7 ✦ Гарантия возврата 7 дней ✦"
}: TickerProps) {
    return (
        <div className="w-full bg-brand-teal/10 border-y border-brand-teal/30 overflow-hidden py-3">
            <div className="animate-ticker whitespace-nowrap inline-block min-w-full">
                <span className="text-brand-teal font-mono text-sm md:text-base px-4">
                    {message}
                </span>
                <span className="text-brand-teal font-mono text-sm md:text-base px-4">
                    {message}
                </span>
            </div>
        </div>
    );
}
