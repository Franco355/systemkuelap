/**
 * Repeating diamond frieze, referencing the geometric stonework carved into
 * Kuélap's circular houses. Used as a one-line ornamental divider — the
 * single decorative flourish in the footer — never repeated elsewhere.
 */
export default function FriezeBand({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 240 12"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
        >
            <path
                d="M0 6 L6 0 L12 6 L18 0 L24 6 L30 0 L36 6 L42 0 L48 6 L54 0 L60 6 L66 0 L72 6 L78 0 L84 6 L90 0 L96 6 L102 0 L108 6 L114 0 L120 6 L126 0 L132 6 L138 0 L144 6 L150 0 L156 6 L162 0 L168 6 L174 0 L180 6 L186 0 L192 6 L198 0 L204 6 L210 0 L216 6 L222 0 L228 6 L234 0 L240 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
