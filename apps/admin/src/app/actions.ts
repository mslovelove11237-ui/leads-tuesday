'use server'

import { db, leads, memos } from '@leads/db'
import type { Lead, Memo } from '@leads/db'
import { eq, desc } from 'drizzle-orm'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHash } from 'crypto'

type LeadData = { name: string; email: string; phone: string }
type FormErrors = { name?: string; email?: string; phone?: string }

function validate(data: LeadData): FormErrors {
  const errors: FormErrors = {}

  if (!/^[가-힣]{2,10}$/.test(data.name)) {
    errors.name = '이름은 한글 2~10자로 입력해 주세요.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '올바른 이메일 형식을 입력해 주세요.'
  }

  if (!/^010-\d{4}-\d{4}$/.test(data.phone)) {
    errors.phone = '전화번호는 010-0000-0000 형식으로 입력해 주세요.'
  }

  return errors
}

function sessionToken(): string {
  if (!process.env.ADMIN_PASSWORD) throw new Error('ADMIN_PASSWORD env var is not set')
  return createHash('sha256').update(process.env.ADMIN_PASSWORD).digest('hex')
}

export async function adminLogin(password: string): Promise<{ success: boolean }> {
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return { success: false }
  }
  const cookieStore = await cookies()
  cookieStore.set('admin_session', sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
  return { success: true }
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/login')
}

export async function getLeads(): Promise<Lead[]> {
  return db.select().from(leads).orderBy(desc(leads.createdAt))
}

export async function updateLead(
  id: number,
  data: LeadData
): Promise<{ success: true } | { success: false; errors: FormErrors }> {
  const errors = validate(data)
  if (Object.keys(errors).length > 0) return { success: false, errors }
  try {
    const updated = await db.update(leads).set(data).where(eq(leads.id, id)).returning({ id: leads.id })
    if (updated.length === 0) return { success: false, errors: { name: '리드가 이미 삭제되었습니다.' } }
  } catch {
    return { success: false, errors: { name: '저장 중 오류가 발생했습니다.' } }
  }
  return { success: true }
}

export async function deleteLead(id: number): Promise<void> {
  try {
    await db.delete(leads).where(eq(leads.id, id)).returning({ id: leads.id })
  } catch {
    // 이미 삭제된 경우 무시 — 화면은 refresh로 최신 상태 반영
  }
}

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== sessionToken()) redirect('/login')
}

export async function getMemos(leadId: number): Promise<Memo[]> {
  await requireAdmin()
  return db.select().from(memos).where(eq(memos.leadId, leadId)).orderBy(desc(memos.createdAt))
}

export async function createMemo(
  leadId: number,
  content: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  const trimmed = content.trim()
  if (!trimmed) return { success: false, error: '메모 내용을 입력해 주세요.' }
  if (trimmed.length > 500) return { success: false, error: '메모는 500자 이내로 입력해 주세요.' }
  try {
    await db.insert(memos).values({ leadId, content: trimmed })
    return { success: true }
  } catch {
    return { success: false, error: '저장 중 오류가 발생했습니다.' }
  }
}

export async function deleteMemo(id: number): Promise<void> {
  await requireAdmin()
  try {
    await db.delete(memos).where(eq(memos.id, id))
  } catch {
    // 이미 삭제된 경우 무시
  }
}
