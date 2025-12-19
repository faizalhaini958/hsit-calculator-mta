import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminPage() {
    return (
        <div className="container mx-auto py-10">
            <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>
            <AdminDashboard />
        </div>
    );
}
