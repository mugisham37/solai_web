import { Icon } from "@/components/atoms/Icon";
import { IconTile } from "@/components/atoms/IconTile";
import { cn } from "@/lib/cn";

type AiPhotoNoteProps = {
  title: string;
  body: string;
  className?: string;
};

export function AiPhotoNote({ title, body, className }: AiPhotoNoteProps) {
  return (
    <div className={cn("rounded-card border border-hair bg-white p-4", className)}>
      <div className="flex items-start gap-3">
        <IconTile className="bg-[rgb(169_140_196/20%)] text-[#5E4478]">
          <Icon name="spark" size="md" />
        </IconTile>
        <span className="flex-1">
          <span className="block text-[0.92rem] font-bold leading-snug">{title}</span>
          <span className="mt-0.5 block text-[0.74rem] leading-snug text-ink-45">{body}</span>
        </span>
      </div>
    </div>
  );
}
