import { useCallback, useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import eidTemplate from "./assets/جريتنج الفاسم.png";
import eventXLight from "./assets/event-x-light.png";
import beigePattern from "./assets/beige-pattern.png";
import { Sparkles } from "lucide-react";
import "./App.css";
import { EidHeader } from "./components/EidHeader";
import { NameForm } from "./components/NameForm";
import { CardPreviewDialog } from "./components/CardPreviewDialog";

type FormValues = {
  name: string;
};

function App() {
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const nameValue = useWatch({ control, name: "name" }) ?? "";

  const onSubmit = (data: FormValues) => {
    const trimmed = data.name.trim();
    if (!trimmed) return;
    setSubmittedName(trimmed);
    setIsModalOpen(true);
  };

  const drawCard = useCallback((name: string | null) => {
    if (!name) return;

    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const { naturalWidth, naturalHeight } = img;
    if (!naturalWidth || !naturalHeight) return;

    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    context.clearRect(0, 0, naturalWidth, naturalHeight);
    context.drawImage(img, 0, 0, naturalWidth, naturalHeight);

    const maxCharsPerLine = 24;
    const words = name.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      if (word.length > maxCharsPerLine) {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = "";
        }
        for (let i = 0; i < word.length; i += maxCharsPerLine) {
          lines.push(word.slice(i, i + maxCharsPerLine));
        }
        continue;
      }

      const candidate = currentLine ? `${currentLine} ${word}` : word;
      if (candidate.length <= maxCharsPerLine) {
        currentLine = candidate;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    const lineCount = lines.length;
    const lineHeightRatio = 1.35;
    const availableHeight = naturalHeight * 0.09;
    const maxFontSize = Math.round(naturalWidth / 16);
    const minFontSize = Math.round(naturalWidth / 26);
    const idealFontSize = availableHeight / (lineCount * lineHeightRatio);
    const fontSize = Math.round(
      Math.max(minFontSize, Math.min(maxFontSize, idealFontSize)),
    );

    const x = naturalWidth / 2;
    const lineHeight = fontSize * lineHeightRatio;
    const baseY = naturalHeight * 0.865;
    const startY = baseY - ((lineCount - 1) * lineHeight) / 2;

    const drawNameBoxAndText = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;

      ctx.font = `${fontSize}px "Aref Ruqaa", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#5a2f86";
      lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        ctx.fillText(line, x, y);
      });
    };

    document.fonts
      .load(`${fontSize}px "Aref Ruqaa"`)
      .then(() => {
        drawNameBoxAndText();
      })
      .catch(() => {
        drawNameBoxAndText();
      });
  }, []);

  useEffect(() => {
    drawCard(submittedName);
  }, [submittedName, drawCard]);

  const handleDownload = () => {
    if (!submittedName) return;

    const safeName = submittedName
      .split(" ")
      .join("-")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9\u0600-\u06FF-]/g, "");
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/jpeg");
    const link = downloadLinkRef.current ?? document.createElement("a");
    link.href = url;
    link.download = `${safeName + "-card"}.jpg`;

    if (!downloadLinkRef.current) {
      downloadLinkRef.current = link;
      document.body.appendChild(link);
    }

    link.click();
  };

  return (
    <div dir="rtl" lang="ar" className="min-h-screen font-changa">
      <div
        className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#fdf9f2]"
        style={{
          backgroundImage: `url(${beigePattern})`,
          backgroundSize: "320px 320px",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="w-full max-w-md rounded-[32px] bg-white/95 border border-[#e5dbc4] shadow-[0_20px_45px_rgba(117,88,43,0.15)] px-6 py-7 space-y-6">
          <EidHeader
            title="شارك فرحة العيد مع أحبابك"
            subtitle="اكتب اسمك لإنشاء بطاقة معايدة مخصّصة"
            badgeText="بطاقة تهنئة لعائلة القاسم"
            Icon={Sparkles}
          />

          <NameForm
            nameLength={nameValue.length}
            register={register}
            errors={errors}
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
          />

          <CardPreviewDialog
            isOpen={isModalOpen}
            submittedName={submittedName}
            eidTemplate={eidTemplate}
            onClose={() => setIsModalOpen(false)}
            onDownload={handleDownload}
            canvasRef={canvasRef}
            imageRef={imageRef}
            drawCard={drawCard}
          />

          <div className="pt-4 border-t border-[#efe2c9] flex items-center justify-center gap-3">
            <span className="text-xs text-[#a28d6b]">مدعوم بواسطة</span>
            <img
              src={eventXLight}
              alt="Event X"
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
