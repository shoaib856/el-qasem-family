import { useEffect, useRef } from "react";
import { Download, Eye } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";

type CardPreviewDialogProps = {
  isOpen: boolean;
  submittedName: string | null;
  eidTemplate: string;
  onClose: () => void;
  onDownload: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  imageRef: React.RefObject<HTMLImageElement | null>;
  drawCard: (name: string | null) => void;
};

export function CardPreviewDialog({
  isOpen,
  submittedName,
  eidTemplate,
  onClose,
  onDownload,
  canvasRef,
  imageRef,
  drawCard,
}: CardPreviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(contentRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) {
      onClose();
    }
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      drawCard(submittedName);
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen, submittedName, drawCard]);

  return (
    <dialog
      ref={dialogRef}
      className="card-dialog rounded-[28px] border border-[#e5dbc4] bg-white text-[#3c2b17] p-0 shadow-[0_20px_45px_rgba(0,0,0,0.25)] backdrop:bg-black/45 backdrop:backdrop-blur-sm"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="space-y-4 animate-modal-in">
        <div
          ref={contentRef}
          className="space-y-4 p-4 sm:p-5 max-w-sm w-full"
        >
          <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Eye className="size-4 text-[#c28b37]" />
            <span>معاينة البطاقة</span>
          </h2>
          </div>

          <div className="rounded-2xl bg-[#f6f0e4] shadow-inner">
          <div className="max-w-3xs mx-auto">
            <img
              ref={imageRef as React.RefObject<HTMLImageElement>}
              src={eidTemplate}
              alt="بطاقة تهنئة بالعيد"
              className="hidden"
              onLoad={() => drawCard(submittedName)}
            />
            <canvas
              ref={canvasRef as React.RefObject<HTMLCanvasElement>}
              className="w-full h-auto block"
            />
          </div>
          </div>

          <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border border-[#d7ba7d] px-4 py-2 text-sm font-medium text-[#7b5a1e] hover:bg-[#f6eee1] disabled:opacity-60 transition"
            onClick={onDownload}
            disabled={!submittedName}
          >
            <Download className="size-4" />
            تحميل الصورة
          </button>
          <button
            type="button"
            className="cursor-pointer inline-flex items-center justify-center rounded-lg bg-[#3c2b17] px-4 py-2 text-sm font-medium text-white hover:bg-[#271b0d] transition"
            onClick={onClose}
          >
            إغلاق
          </button>
        </div>
      </div>
      </div>
    </dialog>
  );
}

