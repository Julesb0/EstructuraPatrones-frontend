import type React from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="pt-20 lg:pl-64">{children}</main>
    </>
  )
}
