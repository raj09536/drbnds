import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const clinic_id = searchParams.get("clinic_id")
    const includeRejected = searchParams.get("include_rejected") === "true"

    if (!clinic_id) {
        return NextResponse.json({ error: "Missing clinic_id" }, { status: 400 })
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get all doctor IDs for this clinic
    const { data: clinicDoctors } = await supabaseAdmin
        .from("doctors")
        .select("id")
        .eq("clinic_id", clinic_id)

    const doctorIds = (clinicDoctors || []).map((d: any) => d.id)

    if (doctorIds.length === 0) {
        return NextResponse.json({ pending: [] })
    }

    // Fetch all is_active=false video/audio testimonials (bypasses RLS via service role)
    const { data: allMedia, error } = await supabaseAdmin
        .from("testimonials")
        .select("*")
        .in("doctor_id", doctorIds)
        .eq("is_active", false)
        .in("type", ["video", "audio"])
        .order("created_at", { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // If include_rejected=true, return everything (for history); else only non-rejected
    const result = includeRejected
        ? (allMedia || [])
        : (allMedia || []).filter((t: any) => !t.is_rejected)

    return NextResponse.json({ pending: result })
}

export async function PATCH(req: NextRequest) {
    const body = await req.json()
    const { id, action } = body // action: 'approve' | 'reject'

    if (!id || !action) {
        return NextResponse.json({ error: "Missing id or action" }, { status: 400 })
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    if (action === "approve") {
        const { error } = await supabaseAdmin
            .from("testimonials")
            .update({ is_active: true })
            .eq("id", id)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    } else if (action === "reject") {
        const { error } = await supabaseAdmin
            .from("testimonials")
            .update({ is_rejected: true })
            .eq("id", id)
        if (error?.message?.includes("is_rejected")) {
            await supabaseAdmin.from("testimonials").delete().eq("id", id)
        } else if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }
    } else if (action === "remove") {
        // Remove from website — set is_active = false (bypasses RLS)
        const { error } = await supabaseAdmin
            .from("testimonials")
            .update({ is_active: false })
            .eq("id", id)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
