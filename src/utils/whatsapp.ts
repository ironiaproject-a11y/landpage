import { WHATSAPP_NUMBER } from "@/config/constants";

/**
 * Generates a WhatsApp URL with an encoded message.
 * @param message The message to be sent.
 * @returns A formatted WhatsApp URL.
 */
export function generateWhatsAppUrl(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
