import { Chip } from "@/components/atoms/Chip";
import { BeadedBracelet } from "@/components/art/BeadedBracelet";
import type { Money } from "@/types/money";

type ChatMockProps = {
  buyerMessage: string;
  sellerStrong: string;
  sellerDetail: string;
  viewCatalogue: string;
  buyNow: string;
  buyerReply: string;
  aiNote: string;
  price: Money;
  locale: string;
};

export function ChatMock({
  buyerMessage,
  sellerStrong,
  sellerDetail,
  viewCatalogue,
  buyNow,
  buyerReply,
  aiNote,
}: ChatMockProps) {
  return (
    <div
      className="flex flex-col gap-2 rounded-card bg-wa-chat p-3"
      aria-hidden
    >
      <p className="max-w-[86%] self-start rounded-[13px_13px_13px_4px] bg-white px-3 py-2 text-[0.86rem] leading-snug">
        {buyerMessage}
      </p>
      <div className="w-[86%] self-end rounded-[13px_13px_4px_13px] bg-wa-bubble-us px-3 py-2 text-[0.86rem] leading-snug">
        <div className="mb-2 grid grid-cols-2 gap-1">
          <BeadedBracelet gradientId="chat-1" paletteIndex={2} beadCount={10} />
          <BeadedBracelet gradientId="chat-2" paletteIndex={3} beadCount={11} />
        </div>
        <p className="m-0">
          <span className="font-bold">{sellerStrong}</span>
          <br />
          {sellerDetail}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip className="bg-white">{viewCatalogue}</Chip>
          <Chip variant="sun">{buyNow}</Chip>
        </div>
      </div>
      <p className="max-w-[86%] self-start rounded-[13px_13px_13px_4px] bg-white px-3 py-2 text-[0.86rem]">
        {buyerReply}
      </p>
      <p className="m-0 text-center text-tiny text-ink-45">{aiNote}</p>
    </div>
  );
}
