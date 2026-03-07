-- ═══════════════════════════════════════════════════════════════════════
-- MIGRATION v2 — Full schema for Dr. BND's Clinic
-- Run this in Supabase SQL Editor (Dashboard → SQL)
-- ═══════════════════════════════════════════════════════════════════════

-- ──────────── 1. DOCTORS TABLE ────────────
CREATE TABLE IF NOT EXISTS public.doctors (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),  -- links to auth user (for login)
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,            -- for login
    photo TEXT DEFAULT '/doctor.jpeg',
    qualifications TEXT[] DEFAULT '{}',
    years_exp INT DEFAULT 0,
    specialization TEXT,
    bio TEXT,
    clinic_name TEXT,
    clinic_address TEXT,
    phone TEXT,
    phone2 TEXT DEFAULT '',
    map_link TEXT,
    map_embed TEXT,
    clinic_id INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────── 2. CLINICS TABLE ────────────
CREATE TABLE IF NOT EXISTS public.clinics (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    address TEXT,
    phone TEXT,
    phone2 TEXT DEFAULT '',
    email TEXT,
    doctor_name TEXT,
    map_link TEXT,
    map_embed TEXT,
    timings JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────── 3. CONTACT_MESSAGES TABLE ────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    clinic TEXT,
    message TEXT NOT NULL,
    clinic_id INT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────── 4. TESTIMONIALS TABLE ────────────
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_name TEXT NOT NULL,
    review TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    doctor_id INT REFERENCES public.doctors(id),
    doctor_name TEXT,
    clinic TEXT,
    is_active BOOLEAN DEFAULT false,   -- requires admin approval
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────── 5. PUBLIC APPOINTMENTS (no auth needed) ────────────
CREATE TABLE IF NOT EXISTS public.public_appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id INT REFERENCES public.doctors(id) NOT NULL,
    clinic_id INT DEFAULT 1,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_email TEXT,
    patient_location TEXT,
    reason TEXT,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    mode TEXT DEFAULT 'physical' CHECK (mode IN ('audio', 'video', 'physical')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────── 6. DOCTOR UNAVAILABILITY ────────────
CREATE TABLE IF NOT EXISTS public.doctor_unavailability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    doctor_id INT REFERENCES public.doctors(id) NOT NULL,
    blocked_dates DATE[] DEFAULT '{}',
    blocked_slots JSONB DEFAULT '{}',
    reason TEXT DEFAULT '',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(doctor_id)
);

-- ═══════════════ RLS POLICIES ═══════════════

-- doctors: public read, doctor self-update
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Doctors readable by anyone" ON public.doctors;
CREATE POLICY "Doctors readable by anyone" ON public.doctors FOR SELECT USING (true);
DROP POLICY IF EXISTS "Doctors can update own record" ON public.doctors;
CREATE POLICY "Doctors can update own record" ON public.doctors FOR UPDATE USING (auth.uid() = user_id);

-- clinics: public read
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Clinics readable by anyone" ON public.clinics;
CREATE POLICY "Clinics readable by anyone" ON public.clinics FOR SELECT USING (true);

-- contact_messages: anyone can insert, doctors can read
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can send a message" ON public.contact_messages;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Doctors can read messages" ON public.contact_messages;
CREATE POLICY "Doctors can read messages" ON public.contact_messages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.doctors WHERE user_id = auth.uid())
    );
DROP POLICY IF EXISTS "Doctors can update messages" ON public.contact_messages;
CREATE POLICY "Doctors can update messages" ON public.contact_messages
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.doctors WHERE user_id = auth.uid())
    );

-- testimonials: anyone can insert (pending approval), public read active ones
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.testimonials;
CREATE POLICY "Anyone can submit feedback" ON public.testimonials FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Active testimonials readable by anyone" ON public.testimonials;
CREATE POLICY "Active testimonials readable by anyone" ON public.testimonials
    FOR SELECT USING (is_active = true OR EXISTS (SELECT 1 FROM public.doctors WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Doctors can update testimonials" ON public.testimonials;
CREATE POLICY "Doctors can update testimonials" ON public.testimonials
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.doctors WHERE user_id = auth.uid())
    );
DROP POLICY IF EXISTS "Doctors can delete testimonials" ON public.testimonials;
CREATE POLICY "Doctors can delete testimonials" ON public.testimonials
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.doctors WHERE user_id = auth.uid())
    );

-- public_appointments: anyone can insert, doctors can read/update
ALTER TABLE public.public_appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can book appointment" ON public.public_appointments;
CREATE POLICY "Anyone can book appointment" ON public.public_appointments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Doctors can read appointments" ON public.public_appointments;
CREATE POLICY "Doctors can read appointments" ON public.public_appointments
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.doctors WHERE user_id = auth.uid())
    );
DROP POLICY IF EXISTS "Doctors can update appointments" ON public.public_appointments;
CREATE POLICY "Doctors can update appointments" ON public.public_appointments
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.doctors WHERE user_id = auth.uid())
    );

-- doctor_unavailability: doctors can manage
ALTER TABLE public.doctor_unavailability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Unavailability readable by anyone" ON public.doctor_unavailability;
CREATE POLICY "Unavailability readable by anyone" ON public.doctor_unavailability FOR SELECT USING (true);
DROP POLICY IF EXISTS "Doctors can manage unavailability" ON public.doctor_unavailability;
CREATE POLICY "Doctors can manage unavailability" ON public.doctor_unavailability
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.doctors WHERE user_id = auth.uid() AND doctors.id = doctor_unavailability.doctor_id)
    );

-- ═══════════════ SEED DATA ═══════════════

-- Seed Doctors (run once)
INSERT INTO public.doctors (id, name, username, photo, qualifications, years_exp, specialization, bio, clinic_name, clinic_address, phone, phone2, map_link, map_embed, clinic_id)
VALUES
(1, 'Dr. B. N. Dwivedy', 'drbnd', '/doctor.jpeg',
 ARRAY['MD (Homeopathy)', 'M.Sc (Psychotherapy & Counseling)'],
 15, 'Classical Homoeopathy & Psychotherapy',
 'With over 15 years of dedicated practice, Dr. B. N. Dwivedy has pioneered an integrated model of healthcare that bridges the gap between classical homoeopathic medicine and modern psychological counseling.',
 'Dr. BND''s Homoeopathic Clinic — Dehradun',
 'Jogiwala Ring Road, Upper Nathanpur, Near Pundir Tower, Dehradun, Uttarakhand 248005',
 '+91-8191919949', '+91-9997954989',
 'https://www.google.com/maps/place/DRBND''S+HOMOEOPATHIC+CLINIC/@30.2925051,78.0685929,17z',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.0!2d78.0685929!3d30.2925051',
 1),
(2, 'Dr. Himanshu Bhandari', 'drhimanshu', '/second_doctor.jpeg',
 ARRAY['B.H.M.S (H.P.U)'],
 8, 'Classical Homoeopathy',
 'Dr. Himanshu Bhandari brings 8+ years of dedicated homoeopathic practice to Ocean Hospital in Bijnor.',
 'Ocean Hospital Homoeopathic — Bijnor',
 'Ocean Hospital, Nagina Chauraha, Dhampur, Bijnor, Uttar Pradesh',
 '+91-8191919949', '',
 'https://www.google.com/maps/place/Ocean+hospital+homoeopathic/@29.3120453,78.5042171,17z',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.0!2d78.5042171!3d29.3120453',
 2)
ON CONFLICT (id) DO NOTHING;

-- Seed Clinics
INSERT INTO public.clinics (id, name, location, address, phone, phone2, email, doctor_name, map_link, map_embed, timings)
VALUES
(1, 'Dr. BND''s Homoeopathic Clinic', 'Dehradun, Uttarakhand',
 'Jogiwala Ring Road, Upper Nathanpur, Near Pundir Tower, Dehradun, Uttarakhand 248005',
 '+91-8191919949', '+91-9997954989', 'drbndclinic@gmail.com', 'Dr. B. N. Dwivedy',
 'https://www.google.com/maps/place/DRBND''S+HOMOEOPATHIC+CLINIC/@30.2925051,78.0685929,17z',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.0!2d78.0685929!3d30.2925051',
 '[{"day":"Monday","time":"10:00 AM – 8:30 PM","closed":false},{"day":"Tuesday","time":"10:00 AM – 8:30 PM","closed":false},{"day":"Wednesday","time":"10:00 AM – 8:30 PM","closed":false},{"day":"Thursday","time":"10:00 AM – 8:30 PM","closed":false},{"day":"Friday","time":"10:00 AM – 8:30 PM","closed":false},{"day":"Saturday","time":"10:00 AM – 8:30 PM","closed":false},{"day":"Sunday","time":"10:00 AM – 1:00 PM","closed":false}]'::jsonb),
(2, 'Ocean Hospital Homoeopathic', 'Dhampur, Bijnor, U.P.',
 'Ocean Hospital, Nagina Chauraha, Dhampur, Bijnor, Uttar Pradesh',
 '+91-8191919949', '', 'drbndclinic@gmail.com', 'Dr. Himanshu Bhandari',
 'https://www.google.com/maps/place/Ocean+hospital+homoeopathic/@29.3120453,78.5042171,17z',
 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.0!2d78.5042171!3d29.3120453',
 '[{"day":"Monday","time":"Closed","closed":true},{"day":"Tuesday","time":"Closed","closed":true},{"day":"Wednesday","time":"6:00 PM – 9:00 PM","closed":false},{"day":"Thursday","time":"6:00 PM – 9:00 PM","closed":false},{"day":"Friday","time":"6:00 PM – 9:00 PM","closed":false},{"day":"Saturday","time":"5:00 PM – 9:00 PM","closed":false},{"day":"Sunday","time":"10:00 AM – 2:00 PM","closed":false}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed initial unavailability records
INSERT INTO public.doctor_unavailability (doctor_id, blocked_dates, blocked_slots, reason)
VALUES (1, '{}', '{}', ''), (2, '{}', '{}', '')
ON CONFLICT (doctor_id) DO NOTHING;

-- Seed some active testimonials
INSERT INTO public.testimonials (patient_name, review, rating, doctor_id, doctor_name, clinic, is_active)
VALUES
('Priya Sharma', 'Dr. Dwivedy''s treatment completely transformed my health. After years of thyroid issues with no relief, 3 months of homoeopathy changed everything.', 5, 1, 'Dr. B. N. Dwivedy', 'Dehradun Clinic', true),
('Rajesh Kumar', 'The psychotherapy sessions gave me tools to manage my anxiety that I still use daily. Dr. BND listens with genuine care.', 5, 1, 'Dr. B. N. Dwivedy', 'Dehradun Clinic', true),
('Sunita Verma', 'Dr. Himanshu is exceptional. My child''s chronic skin condition cleared completely after 2 months.', 5, 2, 'Dr. Himanshu Bhandari', 'Bijnor Clinic', true),
('Mohan Das', 'I was skeptical about homoeopathy for renal stones, but the results speak for themselves. No surgery needed.', 5, 1, 'Dr. B. N. Dwivedy', 'Dehradun Clinic', true);

-- Reset sequence after seed
SELECT setval('doctors_id_seq', (SELECT MAX(id) FROM doctors));
SELECT setval('clinics_id_seq', (SELECT MAX(id) FROM clinics));

-- ═══════════════ ENABLE REALTIME ═══════════════
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
