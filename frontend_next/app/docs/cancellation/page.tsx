import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";

export default function CancellationPage() {
    return (
        <main className="min-h-screen gradient-hero py-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-teal mb-8 transition-colors"
                >
                    <ArrowLeft size={18} />
                    В личный кабинет
                </Link>

                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-brand-cream mb-8">Отмена подписки</h1>

                    <div className="prose prose-invert max-w-none space-y-6 text-brand-cream/80">
                        <p>
                            Мы ценим, что вы выбрали TssVPN. Если вы решили прекратить использование нашего сервиса,
                            вы можете отменить подписку в любое время.
                        </p>

                        <div className="bg-brand-teal/10 border border-brand-teal/30 rounded-xl p-6 flex items-start gap-4">
                            <AlertCircle className="text-brand-teal shrink-0" size={24} />
                            <div>
                                <h3 className="font-bold text-brand-teal mb-2">Важная информация</h3>
                                <p className="text-sm">
                                    У нас нет автоматических рекуррентных платежей (автопродления).
                                    Ваша подписка просто закончится по истечении оплаченного периода.
                                    Вам не нужно совершать никаких действий, чтобы избежать новых списаний.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-brand-cream">Как досрочно удалить аккаунт</h2>
                        <p>
                            Если вы хотите полностью удалить свои данные из нашей системы до окончания срока подписки:
                        </p>
                        <ol className="list-decimal pl-6 space-y-2">
                            <li>Свяжитесь с нашей поддержкой в Telegram: <a href="https://t.me/tssvpn_support" className="text-brand-teal hover:underline">@tssvpn_support</a></li>
                            <li>Напишите сообщение с запросом на удаление аккаунта</li>
                            <li>Подтвердите владение аккаунтом (мы можем попросить скриншот последней оплаты)</li>
                        </ol>

                        <h2 className="text-xl font-bold text-brand-cream">Возврат средств</h2>
                        <p>
                            Если вы отменяете подписку в течение первых 7 дней использования, вы имеете право на полный возврат средств.
                            Подробнее читайте в разделе <Link href="/docs/refund" className="text-brand-teal hover:underline">Политика возврата</Link>.
                        </p>

                        <div className="pt-8 border-t border-white/10 text-center">
                            <p className="text-brand-muted text-sm mb-4">Остались вопросы?</p>
                            <a
                                href="https://t.me/tssvpn_support"
                                className="inline-block bg-brand-navy/50 border border-white/10 text-brand-teal px-6 py-3 rounded-xl hover:border-brand-teal/50 transition-all"
                            >
                                Написать в поддержку
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
