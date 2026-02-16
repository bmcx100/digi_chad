import { Suspense } from "react"
import { TeamPickerGate } from "@/components/team/TeamPickerGate"

export default function Home() {
  return (
    <Suspense>
      <TeamPickerGate />
    </Suspense>
  )
}
