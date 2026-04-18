import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const { username, password } = await req.json()

    if (!username || !password) {
        return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabaseAdmin
        .from("pharmacist_users")
        .select("id, name, username")
        .eq("username", username)
        .eq("password", password)
        .single()

    if (error || !data) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ pharmacist: { id: data.id, name: data.name, username: data.username } })
}
