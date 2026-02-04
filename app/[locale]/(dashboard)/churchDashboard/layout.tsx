import { AppSidebar } from "@/components/dashboard/sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full max-h-screen overflow-auto">
        <SidebarTrigger  className="ml-4"/>
        {children}
      </main>
    </SidebarProvider>
  )
}