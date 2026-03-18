import type {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Eye, Type, User } from "lucide-react";
import type { FormValues } from "../App";

const FONT_PREVIEW_TEXT = "معايدة سعيدة";

type NameFormProps = {
  nameLength: number;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  onSubmit: (data: FormValues) => void;
  handleSubmit: UseFormHandleSubmit<FormValues>;
  availableFonts: readonly { value: string; label: string; fontFamily: string }[];
  selectedFont: string;
};

export function NameForm({
  nameLength,
  register,
  errors,
  onSubmit,
  handleSubmit,
  availableFonts,
  selectedFont,
}: NameFormProps) {
  return (
    <form
      className="space-y-2 rounded-2xl"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="flex items-baseline justify-between gap-2">
        <label
          className="flex items-center gap-1 text-sm font-medium text-[#3c2b17]"
          htmlFor="name"
        >
          <User className="size-4 text-[#c28b37]" />
          <span>أدخل الاسم</span>
        </label>
        <p className="text-xs text-[#a28d6b]">عدد الحروف: {nameLength}</p>
      </div>

      <input
        id="name"
        className="w-full rounded-xl border border-[#e3d2b4] bg-[#faf3e5] px-3 py-2.5 text-right text-[#3c2b17] shadow-sm focus:border-[#c28b37] focus:outline-none focus:ring-2 focus:ring-[#e1c07a] placeholder:text-[#b9a789]"
        placeholder="اكتب الاسم هنا"
        {...register("name", {
          required: "الاسم مطلوب",
        })}
      />

      {errors.name ? (
        <p className="text-xs text-red-500">{errors.name.message}</p>
      ) : null}

      <div className="space-y-2">
        <span className="flex items-center gap-1 text-sm font-medium text-[#3c2b17]">
          <Type className="size-4 text-[#c28b37]" />
          <span>الخط</span>
        </span>
        <div className="grid grid-cols-2 gap-3">
          {availableFonts.map((font) => {
            const isSelected = selectedFont === font.value;
            return (
              <label
                key={font.value}
                className={`cursor-pointer rounded-xl border-2 px-3 py-3 text-right shadow-sm transition-all focus-within:ring-2 focus-within:ring-[#c28b37] focus-within:ring-offset-2 ${
                  isSelected
                    ? "border-[#c28b37] bg-[#faf3e5] ring-2 ring-[#e1c07a]"
                    : "border-[#e3d2b4] bg-[#faf3e5] hover:border-[#d4c4a8]"
                }`}
              >
                <input
                  type="radio"
                  value={font.value}
                  className="sr-only"
                  {...register("font")}
                />
                <p
                  className="text-xs font-medium text-[#8c6223]"
                  style={{ fontFamily: "inherit" }}
                >
                  {font.label}
                </p>
                <p
                  className="mt-1 text-lg text-[#3c2b17]"
                  style={{ fontFamily: `"${font.fontFamily}", system-ui, sans-serif` }}
                >
                  {FONT_PREVIEW_TEXT}
                </p>
              </label>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        className="mt-2 cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-l from-[#c28b37] to-[#8f6220] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(140,98,35,0.4)] transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-60 disabled:hover:translate-y-0"
      >
        <Eye className="size-4" />
        إنشاء معاينة البطاقة
      </button>
    </form>
  );
}

