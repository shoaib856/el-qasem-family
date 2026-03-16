import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import eidTemplate from "./assets/el-qasem.jpeg";
import eventXLight from "./assets/event-x-light.png";
import { Sparkles, User, Eye, Download, X } from "lucide-react";
import "./App.css";

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
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const nameValue = watch("name") ?? "";

  const onSubmit = (data: FormValues) => {
    const trimmed = data.name.trim();
    if (!trimmed) return;
    setSubmittedName(trimmed);
    setIsModalOpen(true);
  };

  const drawCard = (name: string | null) => {
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

    const fontSize = Math.round(naturalWidth / 12);
    context.font = `${fontSize}px "Changa", system-ui, sans-serif`;
    context.fillStyle = "#2e2a85";
    context.textAlign = "center";
    context.textBaseline = "middle";

    const x = naturalWidth / 2;
    const maxCharsPerLine = 15;

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

    const lineHeight = fontSize * 1.3;
    const baseY = naturalHeight * 0.87;
    const startY = baseY - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      context.fillText(line, x, y);
    });
  };

  useEffect(() => {
    drawCard(submittedName);
  }, [submittedName]);

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
    <div
      dir="rtl"
      lang="ar"
      className="min-h-screen bg-linear-to-b font-changa from-indigo-50 via-sky-50 to-indigo-100 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white/95 border border-slate-200/80 shadow-2xl px-6 py-7 space-y-6">
        <h1 className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-semibold text-slate-900">
          <Sparkles className="h-6 w-6 text-violet-500" />
          <span>بطاقة تهنئة بالعيد</span>
        </h1>

        <form
          className="space-y-4 rounded-2xl"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex items-baseline justify-between gap-2">
            <label
              className="flex items-center gap-1 text-sm font-medium text-slate-900"
              htmlFor="name"
            >
              <User className="h-4 w-4 text-indigo-500" />
              <span>أدخل الاسم</span>
            </label>
            <p className="text-xs text-slate-500">
              عدد الحروف: {nameValue.length}
            </p>
          </div>

          <input
            id="name"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-right text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400"
            placeholder="اكتب الاسم هنا"
            {...register("name", {
              required: "الاسم مطلوب",
            })}
          />

          {errors.name ? (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          ) : null}

          <button
            type="submit"
            className="mt-2 cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-l from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
          >
            <Eye className="h-4 w-4" />
            إنشاء معاينة البطاقة
          </button>
        </form>

        {isModalOpen && (
          <div
            className="fixed -inset-10 z-50 flex items-center justify-center bg-black/40 px-3"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-sm rounded-3xl bg-white text-slate-900 p-4 sm:p-5 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Eye className="h-4 w-4 text-indigo-500" />
                  <span>معاينة البطاقة</span>
                </h2>
                <button
                  type="button"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="إغلاق المعاينة"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-2 rounded-2xl bg-slate-100 shadow-inner">
                <div className="max-w-2xs mx-auto">
                  <img
                    ref={imageRef}
                    src={eidTemplate}
                    alt="بطاقة تهنئة بالعيد"
                    className="hidden"
                    onLoad={() => drawCard(submittedName)}
                  />
                  <canvas ref={canvasRef} className="w-full h-auto block" />
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
                  onClick={handleDownload}
                  disabled={!submittedName}
                >
                  <Download className="h-4 w-4" />
                  تحميل الصورة
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-slate-50 hover:bg-slate-800"
                  onClick={() => setIsModalOpen(false)}
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
          <span className="text-xs text-slate-500">مدعوم بواسطة</span>
          <img
            src={eventXLight}
            alt="Event X"
            className="h-6 w-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
