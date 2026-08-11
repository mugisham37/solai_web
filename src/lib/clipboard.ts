/**
 * The one clipboard implementation in the product.
 *
 * The async Clipboard API only exists in secure contexts, and several Android
 * WebViews still ship without it, so the hidden-textarea path is a real fallback
 * rather than legacy defensiveness.
 */
export type CopyOutcome = "copied" | "failed";

function legacyCopy(text: string): CopyOutcome {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  let outcome: CopyOutcome = "failed";
  try {
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    outcome = document.execCommand("copy") ? "copied" : "failed";
  } catch {
    outcome = "failed";
  } finally {
    textarea.remove();
  }
  return outcome;
}

export async function copyText(text: string): Promise<CopyOutcome> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      // Permission denied or a WebView that advertises the API without implementing it.
      return legacyCopy(text);
    }
  }
  return legacyCopy(text);
}
