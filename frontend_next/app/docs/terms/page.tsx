import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen gradient-hero py-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-teal mb-8 transition-colors">
                    <ArrowLeft size={18} />
                    На главную
                </Link>

                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-brand-cream mb-8">Договор оферты</h1>

                    <div className="prose prose-invert max-w-none space-y-6 text-brand-cream/80">
                        <p>Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>

                        <h2 className="text-xl font-bold text-brand-cream">1. Общие положения</h2>
                        <p>
                            Настоящий документ является публичной офертой TssVPN (далее — «Сервис»)
                            и определяет условия предоставления услуг VPN.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">2. Предмет договора</h2>
                        <p>
                            Сервис предоставляет Пользователю доступ к защищённому VPN-соединению
                            на условиях выбранного тарифного плана.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">3. Права и обязанности</h2>
                        <h3 className="text-lg font-bold text-brand-cream">Сервис обязуется:</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Предоставлять стабильный доступ к VPN</li>
                            <li>Не хранить логи подключений</li>
                            <li>Оказывать техническую поддержку</li>
                        </ul>
                        <h3 className="text-lg font-bold text-brand-cream">Пользователь обязуется:</h3>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Не использовать сервис для противоправных действий</li>
                            <li>Не передавать доступ третьим лицам</li>
                            <li>Своевременно оплачивать услуги</li>
                        </ul>

                        <h2 className="text-xl font-bold text-brand-cream">4. Оплата и возврат</h2>
                        <p>
                            Оплата производится по выбранному тарифу. Условия возврата описаны в
                            <Link href="/docs/refund" className="text-brand-teal hover:underline"> Политике возврата</Link>.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">5. Ограничение ответственности</h2>
                        <p>
                            Сервис не несёт ответственности за действия пользователей и не гарантирует
                            100% доступность в связи с возможными техническими работами.
                        </p>

                        <h2 className="text-xl font-bold text-brand-cream">6. Изменение условий</h2>
                        <p>
                            Сервис оставляет за собой право изменять условия договора с уведомлением пользователей.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
