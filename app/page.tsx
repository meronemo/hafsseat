import { RunButton } from "@/components/run-button"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold text-balance tracking-tight">HAFSSeat</h1>
        </div>

        <div className="flex justify-center">
          <RunButton />
        </div>
      </div>
    </main>
  )
}
