import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreatePostForm } from "@/components/createPostForm";

export default async function Upload() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session) {
    redirect("/")
  }
  return (
    <CreatePostForm />
  )
}
