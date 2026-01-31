import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

const documents = [
    { title: "Политика конфиденциальности", href: "/docs/privacy", desc: "Как мы обрабатываем ваши данные" },
    { title: "Политика Cookie", href: "/docs/cookies", desc: "Использование файлов cookie" },
    { title: "Договор оферты", href: "/docs/terms", desc: "Условия использования сервиса" },
    { title: "Политика возврата", href: "/docs/refund", desc: "Возврат средств и отмена подписки" },
    { title: "Отмена подписки", href: "/docs/cancellation", desc: "Как прекратить использование сервиса" },
    { title: "FAQ", href: "/docs/faq", desc: "Часто задаваемые вопросы" },
];

export default function DocsPage() {
    return (
        <main className="min-h-screen gradient-hero py-20 px-4">
            <div className="container mx-auto max-w-3xl">
                <Link href="/" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-teal mb-8 transition-colors">
                    <ArrowLeft size={18} />
                    На главную
                </Link>

                <div className="bg-brand-dark/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <h1 className="text-3xl font-bold text-brand-cream mb-8">Документы</h1>

                    <div className="space-y-4">
                        {documents.map((doc) => (
                            <Link
                                key={doc.href}
                                href={doc.href}
                                className="flex items-center justify-between p-4 bg-brand-navy/50 border border-white/10 rounded-xl hover:border-brand-teal/50 transition-all group"
                            >
                                <div>
                                    <div className="font-bold text-brand-cream group-hover:text-brand-teal transition-colors">
                                        {doc.title}
                                    </div>
                                    <div className="text-sm text-brand-muted">{doc.desc}</div>
                                </div>
                                <ChevronRight size={20} className="text-brand-muted group-hover:text-brand-teal transition-colors" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
