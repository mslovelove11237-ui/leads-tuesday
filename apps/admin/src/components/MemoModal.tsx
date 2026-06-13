'use client'

import { useState, useEffect, useTransition } from 'react'
import { getMemos, createMemo, deleteMemo } from '@/app/actions'
import type { Lead, Memo } from '@leads/db'

export default function MemoModal({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const [memoList, setMemoList] = useState<Memo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newContent, setNewContent] = useState('')
  const [formError, setFormError] = useState('')
  const [isPending, startTransition] = useTransition()

  async function loadMemos() {
    setIsLoading(true)
    const data = await getMemos(lead.id)
    setMemoList(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadMemos()
  }, [lead.id])

  function handleAdd() {
    startTransition(async () => {
      const result = await createMemo(lead.id, newContent)
      if (result.success) {
        setNewContent('')
        setFormError('')
        await loadMemos()
      } else {
        setFormError(result.error ?? '오류가 발생했습니다.')
      }
    })
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteMemo(id)
      await loadMemos()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">메모 — {lead.name}님</h2>
          <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600">
            닫기
          </button>
        </div>

        <div className="mt-4 max-h-60 overflow-y-auto divide-y divide-gray-50">
          {isLoading && (
            <p className="py-4 text-center text-sm text-gray-400">불러오는 중…</p>
          )}
          {!isLoading && memoList.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-400">등록된 메모가 없습니다.</p>
          )}
          {memoList.map((memo) => (
            <div key={memo.id} className="flex items-start justify-between gap-2 py-2">
              <div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{memo.content}</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {new Date(memo.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
              <button
                onClick={() => handleDelete(memo.id)}
                disabled={isPending}
                className="shrink-0 text-xs text-red-400 hover:text-red-600 disabled:opacity-40"
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <textarea
            rows={3}
            value={newContent}
            onChange={(e) => { setNewContent(e.target.value); setFormError('') }}
            placeholder="메모 내용을 입력하세요"
            disabled={isPending}
            className="w-full resize-none rounded border border-gray-300 px-2 py-1 text-sm outline-none focus:border-gray-600 focus:ring-2 focus:ring-gray-600/10 disabled:opacity-50"
          />
          {formError && <p className="mt-0.5 text-xs text-red-500">{formError}</p>}
          <div className="mt-2 flex justify-end">
            <button
              onClick={handleAdd}
              disabled={isPending}
              className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {isPending ? '저장 중…' : '메모 추가'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
