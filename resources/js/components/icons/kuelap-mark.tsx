import type { SVGAttributes } from 'react';

/**
 * Abstract mark built from the rhomboid frieze bands carved into the stone
 * walls of the Kuélap citadel — three rows of diamonds standing for the
 * network's tiers (members, teams, research lines). Renders in
 * `currentColor` so it adapts to both the light header and the navy footer.
 */
export default function KuelapMark(props: SVGAttributes<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
            <rect
                x="0.75"
                y="0.75"
                width="38.5"
                height="38.5"
                rx="9.25"
                stroke="currentColor"
                strokeOpacity="0.16"
                strokeWidth="1.5"
            />
            <path
                d="M9 15.5L14.5 11L20 15.5L25.5 11L31 15.5"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 24.5L14.5 20L20 24.5L25.5 20L31 24.5"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 29.5L14.5 25L20 29.5L25.5 25L31 29.5"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.55"
            />
        </svg>
    );
}
