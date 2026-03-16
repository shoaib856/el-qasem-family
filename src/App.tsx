import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import eidTemplate from "./assets/el-qasem.jpeg";
import eventXLight from "./assets/event-x-light.png";
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

    const text = name;
    context.font = `${Math.round(naturalWidth / 12)}px sans-serif`;
    context.fillStyle = "#2e2a85";
    context.textAlign = "center";
    context.textBaseline = "middle";

    const x = naturalWidth / 2;
    // push the text lower so it sits between the two bottom crosses
    const y = naturalHeight * 0.89;
    context.fillText(text, x, y);
  };

  useEffect(() => {
    drawCard(submittedName);
  }, [submittedName]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/jpeg");
    const link = downloadLinkRef.current ?? document.createElement("a");
    link.href = url;
    link.download = "eid-greeting.jpg";

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
      className="min-h-screen bg-linear-to-b from-indigo-50 via-sky-50 to-indigo-100 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md rounded-3xl bg-white/95 border border-slate-200/80 shadow-2xl px-6 py-7 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 text-center">
          بطاقة تهنئة بالعيد
        </h1>

        <form
          className="space-y-4 rounded-2xl"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="flex items-baseline justify-between gap-2">
            <label
              className="text-sm font-medium text-slate-900"
              htmlFor="name"
            >
              أدخل الاسم
            </label>
            <p className="text-xs text-slate-500">{nameValue.length}/15 حروف</p>
          </div>

          <input
            id="name"
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-right text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400"
            placeholder="اكتب الاسم هنا"
            maxLength={15}
            {...register("name", {
              required: "الاسم مطلوب",
              maxLength: {
                value: 15,
                message: "الحد الأقصى ١٥ حرفًا",
              },
            })}
          />

          {errors.name ? (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          ) : null}

          <button
            type="submit"
            className="mt-2 cursor-pointer inline-flex w-full items-center justify-center rounded-full bg-linear-to-l from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
          >
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
                <h2 className="text-lg font-semibold">معاينة البطاقة</h2>
                <button
                  type="button"
                  className="text-2xl leading-none text-slate-400 hover:text-slate-700"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="إغلاق المعاينة"
                >
                  ×
                </button>
              </div>

              <div className="mt-2 rounded-2xl bg-slate-100 shadow-inner">
                <div className="max-w-3xs mx-auto">
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
                  className="inline-flex items-center justify-center rounded-full border border-indigo-300 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
                  onClick={handleDownload}
                  disabled={!submittedName}
                >
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
