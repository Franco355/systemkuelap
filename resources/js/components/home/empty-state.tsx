import type { LucideIcon } from 'lucide-react';

export function EmptyState({
    icon: Icon,
    title,
    body,
}: {
    icon: LucideIcon;
    title: string;
    body: string;
}) {
    return (
        <div className="border-kuelap-ink/15 flex flex-col items-start gap-3 rounded-2xl border border-dashed bg-white px-6 py-8">
            <span className="bg-kuelap-green-soft text-kuelap-green flex size-11 items-center justify-center rounded-full">
                <Icon className="size-5" />
            </span>
            <p className="text-kuelap-ink font-display text-lg font-bold">
                {title}
            </p>
            <p className="text-kuelap-ink/60 max-w-sm text-[15px] leading-relaxed">
                {body}
            </p>
        </div>
    );
}
