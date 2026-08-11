/**
 * Every share-intent URL in the product, in one file.
 *
 * Platforms change these endpoints without notice, and a share button that opens
 * a dead composer is invisible until a seller complains. Keeping them here means
 * one edit fixes every surface rather than a hunt through components.
 *
 * All of them take the already-composed text. The link lives inside that text
 * because SMS, WhatsApp and email carry no separate link field.
 */

/** Opens the WhatsApp chooser, then the seller picks the chat or group. */
export function whatsappUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/**
 * Facebook only reliably honours `u`. The `quote` parameter is ignored by some
 * surfaces, which is exactly why the link is also inside the text.
 */
export function facebookUrl(url: string, text: string): string {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
}

export function telegramUrl(url: string, text: string): string {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
}

export function tweetUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

/**
 * `sms:?&body=` is the form both Android and iOS accept when no recipient is
 * set. Dropping the `&` breaks the body on some Android dialers.
 */
export function smsUrl(text: string): string {
  return `sms:?&body=${encodeURIComponent(text)}`;
}

export function emailUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * The plain app, not a composer. Instagram permits no third-party posting, so
 * the hand-off sheet does the real work and this just gets them there.
 */
export function instagramUrl(): string {
  return "https://www.instagram.com/";
}

export type NativeShareOutcome = "shared" | "cancelled" | "unsupported";

/**
 * The system share sheet, where it exists.
 *
 * A cancel is not a failure — the seller changed their mind — so it is reported
 * separately and never surfaces as an error.
 */
export async function nativeShare(payload: {
  title: string;
  text: string;
  url: string;
}): Promise<NativeShareOutcome> {
  if (typeof navigator === "undefined" || !navigator.share) return "unsupported";
  try {
    await navigator.share(payload);
    return "shared";
  } catch {
    return "cancelled";
  }
}

/**
 * Handing a generated image straight to WhatsApp, which Android supports and
 * most desktop browsers do not.
 *
 * Guarded by `canShare({ files })` because calling `share` with files where it
 * is unsupported throws, and the download path has to remain the default.
 */
export function canShareFiles(files: readonly File[]): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare || !navigator.share) return false;
  try {
    return navigator.canShare({ files: [...files] });
  } catch {
    return false;
  }
}

export async function shareFiles(payload: {
  title: string;
  text: string;
  files: readonly File[];
}): Promise<NativeShareOutcome> {
  if (!canShareFiles(payload.files)) return "unsupported";
  try {
    await navigator.share({
      title: payload.title,
      text: payload.text,
      files: [...payload.files],
    });
    return "shared";
  } catch {
    return "cancelled";
  }
}
