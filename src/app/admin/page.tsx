import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { SignOutButton } from "@/components/sign-out-button"

export default async function AdminPage() {
    const session = await getSession()

    if (!session) {
        redirect("/admin/login")
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Logged in as {session.user?.name}
                    </p>
                </div>
                <SignOutButton />
            </div>
            <AdminDashboard />
        </div>
    )
}
