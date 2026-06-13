'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateLead, deleteLead } from '@/app/actions'
import type { Lead } from '@leads/db'
import MemoModal from './MemoModal'

type FormErrors = { name?: string; email?: string; phone?: string }

type EditState = {
  id: number
  name: string
  email: string
  phone: string
  errors: FormErrors
}

export default function AdminLeadTable({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editState, setEditState] = useState<EditState | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null)
  const [memoTarget, setMemoTarget] = useState<Lead | null>(null)

  function startEdit(lead: Lead) {
    setEditState({ id: lead.id, name: lead.name, email: lead.email, phone: lead.phone, errors: {} })
  }

  function cancelEdit() {
    setEditState(null)
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setEditState((prev) => prev ? { ...prev, [name]: value, errors: { ...prev.errors, [name]: undefined } } : prev)
  }

  function saveEdit() {
    if (!editState) return
    startTransition(async () => {
      const result = await updateLead(editState.id, {
        name: editState.name,
        email: editState.email,
        phone: editState.phone,
      })
      if (result.success) {
        setEditState(null)
        router.refresh()
      } else {
        setEditState((prev) => prev ? { ...prev, errors: result.errors } : prev)
      }
    })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    const id = deleteTarget.id
    startTransition(async () => {
      await deleteLead(id)
      setDeleteTarget(null)
      router.refresh()
    })
  }

  const inputClass = (error?: string) =>
    `w-full rounded border px-2 py-1 text-sm outline-none focus:ring-2 ${
      error
        ? 'border-red-400 focus:ring-red-400/20'
        : 'border-gray-300 focus:border-gray-600 focus:ring-gray-600/10'
    }`

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-6 py-4 w-12">ID</th>
              <th className="px-4 py-4">이름</th>
              <th className="px-4 py-4">이메일</th>
              <th className="px-4 py-4">전화번호</th>
              <th className="px-4 py-4">등록일</th>
              <th className="px-4 py-4 text-right">액션</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {initialLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  등록된 리드가 없습니다.
                </td>
              </tr>
            )}
            {initialLeads.map((lead) => {
              const isEditing = editState?.id === lead.id
              return (
                <tr
                  key={lead.id}
                  className={isEditing ? 'bg-blue-50/50' : 'hover:bg-gray-50/60'}
                >
                  <td className="px-6 py-3 text-gray-400">{lead.id}</td>

                  {isEditing ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          name="name"
                          value={editState.name}
                          onChange={handleEditChange}
                          className={inputClass(editState.errors.name)}
                          disabled={isPending}
                        />
                        {editState.errors.name && (
                          <p className="mt-0.5 text-xs text-red-500">{editState.errors.name}</p>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="email"
                          value={editState.email}
                          onChange={handleEditChange}
                          className={inputClass(editState.errors.email)}
                          disabled={isPending}
                        />
                        {editState.errors.email && (
                          <p className="mt-0.5 text-xs text-red-500">{editState.errors.email}</p>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          name="phone"
                          value={editState.phone}
                          onChange={handleEditChange}
                          className={inputClass(editState.errors.phone)}
                          disabled={isPending}
                        />
                        {editState.errors.phone && (
                          <p className="mt-0.5 text-xs text-red-500">{editState.errors.phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={saveEdit}
                            disabled={isPending}
                            className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                          >
                            {isPending ? '저장 중…' : '저장'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={isPending}
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            취소
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                      <td className="px-4 py-3 text-gray-600">{lead.phone}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(lead)}
                            disabled={isPending || editState !== null}
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => setMemoTarget(lead)}
                            disabled={isPending || editState !== null}
                            className="rounded-md border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50 disabled:opacity-40"
                          >
                            메모
                          </button>
                          <button
                            onClick={() => setDeleteTarget(lead)}
                            disabled={isPending || editState !== null}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 disabled:opacity-40"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {memoTarget && (
        <MemoModal lead={memoTarget} onClose={() => setMemoTarget(null)} />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">리드 삭제</h2>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-gray-900">{deleteTarget.name}</span>님의 리드를
              삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isPending}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                disabled={isPending}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isPending ? '삭제 중…' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
