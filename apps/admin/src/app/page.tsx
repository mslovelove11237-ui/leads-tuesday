import { getLeads, adminLogout } from '@/app/actions'
import AdminLeadTable from '@/components/AdminLeadTable'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const leads = await getLeads()

  return (
    <main className="min-h-full bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">리드 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              총 {leads.length}건의 리드가 있습니다.
            </p>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              로그아웃
            </button>
          </form>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
          <AdminLeadTable initialLeads={leads} />
        </div>
      </div>
    </main>
  )
}
