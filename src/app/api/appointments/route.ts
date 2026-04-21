import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function getAdmin() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const doctorName = searchParams.get("doctor")

    let query = getAdmin()
        .from("public_appointments")
        .select("*")
        .order("created_at", { ascending: false })

    if (doctorName) {
        query = query.ilike("doctor_name", `%${doctorName.split(" ").slice(-1)[0]}%`)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

export async function PATCH(req: Request) {
    const { id, status } = await req.json()
    const { error } = await getAdmin()
        .from("public_appointments")
        .update({ status })
        .eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
}
