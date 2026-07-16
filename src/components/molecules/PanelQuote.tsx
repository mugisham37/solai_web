interface PanelQuoteProps {
  quote: string;
  author: string;
  subtitle: string;
  initials: string;
}

export function PanelQuote({
  quote,
  author,
  subtitle,
  initials,
}: PanelQuoteProps) {
  return (
    <div>
      <p className="text-[15px] leading-relaxed text-text-muted">&ldquo;{quote}&rdquo;</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-success/15 text-sm font-semibold text-success">
          {initials}
        </div>
        <div>
          <strong className="block text-sm text-text">{author}</strong>
          <span className="text-xs text-text-muted">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
