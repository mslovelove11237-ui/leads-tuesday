"use client";

import { useState } from "react";

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: 서버 액션 연결
  }

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
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        />
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
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-[0.98]"
      >
        신청하기
      </button>
    </form>
  );
}
