'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin } from '@/app/actions'

export default function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await adminLogin(password)
      if (result.success) {
        router.push('/')
      } else {
        setError('비밀번호가 올바르지 않습니다.')
        setPassword('')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:ring-2 ${
            error
              ? 'border-red-400 focus:ring-red-500/10'
              : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900/10'
          }`}
          disabled={isPending}
          autoFocus
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={isPending || !password}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50"
      >
        {isPending ? '확인 중...' : '로그인'}
      </button>
    </form>
  )
}
