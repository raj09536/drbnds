import { redirect } from "next/navigation"

export default function DashboardIndexPage() {
    redirect("/pharmacy/dashboard/overview")
}
