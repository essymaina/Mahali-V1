import DebugHelper from "../workspace/debug-helper"

export default function DebugPage() {
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Next.js Page Debugger</h1>
      <DebugHelper />
    </div>
  )
}