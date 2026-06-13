import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
