import { qrSvgString } from "@/lib/qr";

type PrintablePosterProps = {
  shopName: string;
  /** Display form of the link, for people who will type it rather than scan. */
  linkText: string;
  shopUrl: string;
  buyFromLabel: string;
  scanPrompt: string;
  paymentNote: string;
  protectionNote: string;
};

/**
 * The flyer. It has no screen presence at all — `print:block` reveals it and the
 * print stylesheet in globals.css hides the application chrome around it.
 *
 * The QR is sized in millimetres because this ends up on paper, and the
 * protection line is what makes a stranger willing to scan it.
 */
export function PrintablePoster({
  shopName,
  linkText,
  shopUrl,
  buyFromLabel,
  scanPrompt,
  paymentNote,
  protectionNote,
}: PrintablePosterProps) {
  let svg: string | null = null;
  try {
    svg = qrSvgString(shopUrl);
  } catch {
    svg = null;
  }

  return (
    <div data-print-poster className="hidden print:block" aria-hidden>
      <div className="text-center">
        <p className="poster-sub">{buyFromLabel}</p>
        <h1 className="poster-name">{shopName}</h1>
        {svg ? (
          <div className="poster-qr" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : null}
        <p className="poster-link">{linkText}</p>
        <p className="poster-sub">{scanPrompt}</p>
        <p className="poster-foot">
          {paymentNote}
          <br />
          {protectionNote}
        </p>
      </div>
    </div>
  );
}
