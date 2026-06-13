'use server'

import { db, leads } from '@leads/db'

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

export async function createLead(
  data: LeadData
): Promise<{ success: true } | { success: false; errors: FormErrors }> {
  const errors = validate(data)
  if (Object.keys(errors).length > 0) {
    return { success: false, errors }
  }

  try {
    await db.insert(leads).values(data)
  } catch {
    return { success: false, errors: { name: '저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' } }
  }
  return { success: true }
}
