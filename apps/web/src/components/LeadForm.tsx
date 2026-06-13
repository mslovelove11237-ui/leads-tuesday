"use client";

import { useState, useTransition } from "react";
import { createLead } from "@/app/actions";

type FormErrors = { name?: string; email?: string; phone?: string };

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await createLead(form);
      if (result.success) {
        setSubmitted(true);
      } else {
        setErrors(result.errors);
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <p className="text-base font-medium text-gray-900">신청이 완료되었습니다. 감사합니다!</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({ name: "", email: "", phone: "" });
            setErrors({});
          }}
          className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700"
        >
          다시 신청하기
        </button>
      </div>
    );
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 ${
      errors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
        : "border-gray-200 focus:border-gray-900 focus:ring-gray-900/10"
    }`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="홍길동"
          value={form.name}
          onChange={handleChange}
          className={inputClass("name")}
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="text"
          placeholder="example@email.com"
          value={form.email}
          onChange={handleChange}
          className={inputClass("email")}
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          전화번호
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="010-0000-0000"
          value={form.phone}
          onChange={handleChange}
          className={inputClass("phone")}
        />
        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? "저장 중..." : "신청하기"}
      </button>
    </form>
  );
}
