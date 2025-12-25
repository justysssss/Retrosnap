"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import SignInDialog from "@/components/SignInDialog"

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <main className="flex items-center justify-center min-h-screen">
      <Button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-3 px-8 py-4 bg-[#fdfbf7] border-2 border-stone-800 rounded-lg text-xl font-bold hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200"
      >
        Open Popup
      </Button>

      <SignInDialog open={isOpen} onOpenChange={setIsOpen} />
    </main>
  )
}

