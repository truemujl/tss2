import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RefundPage() {
    return (
        <main className="min-h-screen gradient-hero py-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-teal mb-8 transition-colors">
                    <ArrowLeft size={18} />
                    На главную
                </Link>

                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-brand-cream mb-8">Политика возврата</h1>

                    <div className="prose prose-invert max-w-none space-y-6 text-brand-cream/80">
                        <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>

                        <h2 className="text-xl font-bold text-brand-cream">Гарантия возврата 7 дней</h2>
                        <p>
                            Мы уверены в качестве нашего сервиса, поэтому предлагаем полный возврат средств
                            в течение 7 дней с момента покупки.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">Условия возврата</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Запрос на возврат подан в течение 7 дней после оплаты</li>
                            <li>Это ваша первая покупка в нашем сервисе</li>
                            <li>Объём использованного трафика не превышает 1 ГБ</li>
                        </ul>

                        <h2 className="text-xl font-bold text-brand-cream">Как запросить возврат</h2>
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Напишите в поддержку: <a href="https://t.me/tssvpn_support" className="text-brand-teal hover:underline">@tssvpn_support</a></li>
                            <li>Укажите email или Telegram, использованный при регистрации</li>
                            <li>Опишите причину возврата</li>
                        </ol>

                        <h2 className="text-xl font-bold text-brand-cream">Сроки возврата</h2>
                        <p>
                            Возврат осуществляется в течение 3-5 рабочих дней на тот же способ оплаты.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">Отмена подписки</h2>
                        <p>
                            Подписка не продлевается автоматически. Однако если вы хотите отменить текущую подписку досрочно,
                            свяжитесь с поддержкой для расчёта частичного возврата (пропорционально неиспользованному времени).
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
