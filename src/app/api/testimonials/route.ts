import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { patient_name, review, rating, doctor_id, type, media_url } = body

    if (!patient_name || !rating || !doctor_id || !type) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Look up clinic_id from doctor record (best-effort, don't fail if not found)
    let clinic_id: number | null = null
    try {
        const { data: doctorData } = await supabaseAdmin
            .from("doctors")
            .select("clinic_id")
            .eq("id", Number(doctor_id))
            .maybeSingle()
        clinic_id = doctorData?.clinic_id ?? null
    } catch {
        clinic_id = null
    }

    const insertPayload: any = {
        patient_name,
        review: review ?? "",
        rating,
        doctor_id: Number(doctor_id),
        type,
        media_url: media_url ?? null,
        is_active: false,
    }

    // Only include clinic_id if we found it
    if (clinic_id !== null) {
        insertPayload.clinic_id = clinic_id
    }

    const { error } = await supabaseAdmin.from("testimonials").insert(insertPayload)

    if (error) {
        console.error("Testimonial insert error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
