import LeadForm from "@/components/LeadForm";

export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">신청하기</h1>
          <p className="mt-2 text-gray-500">아래 정보를 입력해 주세요.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <LeadForm />
        </div>
      </div>
    </main>
  );
}
