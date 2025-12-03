"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSignInGoogle = async () => {
    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/studio",

    })
    console.log(result);
    if (result.error) {
      console.log("Error while Login");
    } else {
      console.log(result.data);
    }
  }

  return (
    <main className="flex items-center justify-center min-h-screen">
      <Button
        onClick={() => setIsOpen(true)}
        className="relative flex items-center gap-3 px-8 py-4 bg-[#fdfbf7] border-2 border-stone-800 rounded-lg text-xl font-bold hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-200"
      >
        Open Popup
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <Button onClick={handleSignInGoogle} className="w-full">
              Sign In with Google
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}

