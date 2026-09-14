import {
    Facebook,
    Globe,
    Instagram,
    Link2,
    Linkedin,
    type LucideIcon,
    MessageCircle,
    Send,
    Twitch,
    X,
    Youtube,
} from 'lucide-react';

/**
 * Maps a `tipos_redes.tipos_redes` label to the icon used for it in the
 * header and footer. Networks without a dedicated brand glyph in lucide
 * fall back to a plain link icon rather than an inexact stand-in.
 */
const ICONS_BY_TIPO: Record<string, LucideIcon> = {
    'Sitio web': Globe,
    Facebook: Facebook,
    Instagram: Instagram,
    'X (Twitter)': X,
    LinkedIn: Linkedin,
    YouTube: Youtube,
    WhatsApp: MessageCircle,
    Telegram: Send,
    Twitch: Twitch,
};

export function socialIconFor(tipo: string): LucideIcon {
    return ICONS_BY_TIPO[tipo] ?? Link2;
}
