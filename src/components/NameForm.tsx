import type {
  UseFormHandleSubmit,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { Eye, User } from "lucide-react";

type FormValues = {
  name: string;
};

type NameFormProps = {
  nameLength: number;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  onSubmit: (data: FormValues) => void;
  handleSubmit: UseFormHandleSubmit<FormValues>;
};

export function NameForm({
  nameLength,
  register,
  errors,
  onSubmit,
  handleSubmit,
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

