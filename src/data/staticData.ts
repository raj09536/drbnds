// Static content data — doctors, clinics, stats, specializations, etc.
// These are NOT mock data — they are the actual static content for the site.

export const doctors = [
    {
        id: 1,
        name: "Dr. B. N. Dwivedy",
        photo: "/doctor.jpeg",
        qualifications: [
            "MD (Homeopathy)",
            "M.Sc (Psychotherapy & Counseling)",
        ],
        years_exp: 15,
        specialization: "Classical Homoeopathy & Psychotherapy",
        bio: "With over 15 years of dedicated practice, Dr. B. N. Dwivedy has pioneered an integrated model of healthcare that bridges the gap between classical homoeopathic medicine and modern psychological counseling. His empathetic approach ensures every patient's personal journey is respected and understood.",
        clinic_name: "Dr. BND's Homoeopathic Clinic — Dehradun & Bijnor",
        clinic_address:
            "Jogiwala Ring Road, Upper Nathanpur, Near Pundir Tower, Dehradun, Uttarakhand 248005",
        phone: "+91-8191919949",
        phone2: "+91-9997954989",
        map_link:
            "https://www.google.com/maps/place/DRBND'S+HOMOEOPATHIC+CLINIC/@30.2925051,78.0685929,17z",
        map_embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.0!2d78.0685929!3d30.2925051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092972f1585eed%3A0x581dc7c1c4b30e8e!2sDRBND'S%20HOMOEOPATHIC%20CLINIC!5e0!3m2!1sen!2sin!4v1",
    },
    {
        id: 2,
        name: "Dr. Himanshu Bhandari",
        photo: "/second_doctor.jpeg",
        qualifications: ["B.H.M.S (H.P.U)"],
        years_exp: 8,
        specialization: "Classical Homoeopathy",
        bio: "Dr. Himanshu Bhandari brings 8+ years of dedicated homoeopathic practice at Dr. BND's Clinic in Dehradun. His patient-first approach and deep understanding of classical homoeopathy principles have helped thousands of patients find natural, lasting relief from chronic and acute conditions.",
        clinic_name: "Dr. BND's Homoeopathic Clinic — Dehradun",
        clinic_address:
            "Jogiwala Ring Road, Upper Nathanpur, Near Pundir Tower, Dehradun, Uttarakhand 248005",
        phone: "+91-8191919949",
        phone2: "+91-9997954989",
        map_link:
            "https://www.google.com/maps/place/DRBND'S+HOMOEOPATHIC+CLINIC/@30.2925051,78.0685929,17z",
        map_embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.0!2d78.0685929!3d30.2925051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092972f1585eed%3A0x581dc7c1c4b30e8e!2sDRBND'S%20HOMOEOPATHIC%20CLINIC!5e0!3m2!1sen!2sin!4v1",
    },
];

export const clinics = [
    {
        id: 1,
        name: "Dr. BND's Homoeopathic Clinic",
        location: "Dehradun, Uttarakhand",
        address:
            "Jogiwala Ring Road, Upper Nathanpur, Near Pundir Tower, Dehradun, Uttarakhand 248005",
        phone: "+91-8191919949",
        phone2: "+91-9997954989",
        email: "drbndclinic@gmail.com",
        doctor: "Dr. B. N. Dwivedy & Dr. Himanshu Bhandari",
        map_link:
            "https://www.google.com/maps/place/DRBND'S+HOMOEOPATHIC+CLINIC/@30.2925051,78.0685929,17z",
        map_embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.0!2d78.0685929!3d30.2925051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092972f1585eed%3A0x581dc7c1c4b30e8e!2sDRBND'S%20HOMOEOPATHIC%20CLINIC!5e0!3m2!1sen!2sin!4v1",
        timings: [
            { day: "Monday", slots: ["10:00 AM – 1:30 PM", "5:00 PM – 8:00 PM"], closed: false },
            { day: "Tuesday", slots: ["10:00 AM – 1:30 PM", "5:00 PM – 8:00 PM"], closed: false },
            { day: "Wednesday", slots: ["10:00 AM – 1:30 PM", "5:00 PM – 8:00 PM"], closed: false },
            { day: "Thursday", slots: ["10:00 AM – 1:30 PM", "5:00 PM – 8:00 PM"], closed: false },
            { day: "Friday", slots: ["10:00 AM – 1:30 PM", "5:00 PM – 8:00 PM"], closed: false },
            { day: "Saturday", slots: ["10:00 AM – 1:30 PM", "5:00 PM – 8:00 PM"], closed: false },
            { day: "Sunday", slots: ["10:00 AM – 1:30 PM"], closed: false },
        ],
    },
    {
        id: 2,
        name: "Ocean Hospital Homoeopathic",
        location: "Dhampur, Bijnor, U.P.",
        address:
            "Ocean Hospital, Nagina Chauraha, Dhampur, Bijnor, Uttar Pradesh",
        phone: "+91-8191919949",
        phone2: "+91-9997954989",
        email: "drbndclinic@gmail.com",
        doctor: "Dr. B. N. Dwivedy",
        map_link:
            "https://www.google.com/maps/place/Ocean+hospital+homoeopathic/@29.3120453,78.5042171,17z",
        map_embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.0!2d78.5042171!3d29.3120453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390bc90066b7eb73%3Ae2754a8d5d6b0540!2sOcean%20hospital%20homoeopathic!5e0!3m2!1sen!2sin!4v1",
        timings: [
            { day: "Monday", slots: [], closed: true },
            { day: "Tuesday", slots: ["3:00 PM – 7:00 PM"], closed: false },
            { day: "Wednesday", slots: ["3:00 PM – 7:00 PM"], closed: false },
            { day: "Thursday", slots: [], closed: true },
            { day: "Friday", slots: [], closed: true },
            { day: "Saturday", slots: [], closed: true },
            { day: "Sunday", slots: [], closed: true },
        ],
    },
];

export const stats = [
    { number: 15, suffix: "+", label: "Years Experience" },
    { number: 2, suffix: "", label: "Clinic Locations" },
    { number: 100000, suffix: "+", label: "Patients Treated" },
    { number: 2, suffix: "", label: "Expert Doctors" },
];

export const specializations = [
    { icon: '🤧', title: 'Allergies', desc: 'Homoeopathic treatment for skin allergies, food allergies, dust allergies and all types of allergic conditions.' },
    { icon: '👶', title: 'Children Problems', subtitle: '(Paediatric)', desc: 'Safe and effective homoeopathic treatment for all childhood illnesses — entirely free from side effects.' },
    { icon: '👴', title: 'Old Age Problems', subtitle: '(Geriatrics)', desc: 'Gentle homoeopathic care for elderly patients, addressing joint pain, weakness, memory issues and age-related conditions.' },
    { icon: '👩', title: 'Female Problems', subtitle: '(Gynaecology)', desc: 'Specialist homoeopathic treatment for all women\'s health concerns, including PCOD, irregular periods and leucorrhoea.' },
    { icon: '✨', title: 'Beauty Problems', desc: 'Natural homoeopathic treatment for acne, hair loss, pigmentation and skin conditions — addressing the root cause for lasting results.' },
    { icon: '🧠', title: 'Mind / Mental Problems', desc: 'Effective homoeopathic treatment for anxiety, depression, stress, insomnia and all mental health conditions.' },
    { icon: '⚡', title: 'Hormonal / Endocrinal Problems', desc: 'Root-cause homoeopathic treatment for thyroid disorders, diabetes and hormonal imbalances.' },
    { icon: '🦴', title: 'Bones & Joint Problems', desc: 'Relief from arthritis, back pain, cervical spondylosis and all bone and joint conditions.' },
    { icon: '🧬', title: 'Neurological Problems', desc: 'Homoeopathic management of migraines, nerve pain, numbness and neurological disorders.' },
    { icon: '🫘', title: 'Kidney Problems', desc: 'Safe and gentle homoeopathic treatment for kidney stones, UTIs and kidney function disorders.' },
    { icon: '🫃', title: 'Gastro / Gastric Problems', desc: 'Lasting homoeopathic relief from acidity, IBS, constipation, bloating and digestive disorders.' },
    { icon: '👂', title: 'Ear / Nose / Throat', desc: 'Homoeopathic treatment for sinusitis, tonsillitis, ear infections and nasal conditions.' },
    { icon: '🫁', title: 'Respiratory Problems', desc: 'Root-cause homoeopathic treatment for asthma, bronchitis, chronic cough and breathing disorders.' },
    { icon: '🌿', title: 'Lifestyle Problems', desc: 'Holistic homoeopathic care for obesity, fatigue, low immunity and lifestyle-related conditions.' },
];

export const services = [
    {
        title: 'All Type Consultation',
        desc: 'In-clinic, online and telephone consultations available — consult our doctors at your convenience.',
        icon: '🩺',
        image: '/doctor.jpeg',
        slug: 'all-type-consultation'
    },
    {
        title: 'Medicine Home Delivery',
        desc: 'Order your homoeopathic medicines from the comfort of your home — fast and reliable doorstep delivery.',
        icon: '🚚',
        image: '/homeopathic-medicine.jpg',
        slug: 'medicine-home-delivery'
    },
    {
        title: 'Diet Management',
        desc: 'Disease-specific diet charts, goal-oriented meal plans and personalised nutritional guidance.',
        icon: '🥗',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
        slug: 'diet-management'
    },
    {
        title: 'Cosmetic Products',
        desc: 'Natural homoeopathic cosmetic products for skin care, hair care and holistic beauty.',
        icon: '✨',
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
        slug: 'cosmetic-products'
    },
    {
        title: 'Diet Chart Service',
        desc: 'Personalised diet charts tailored to your condition, age and lifestyle requirements.',
        icon: '📋',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400',
        slug: 'diet-chart-service'
    },
];


export const galleryImages = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=80",
        caption: "Our Dehradun Clinic",
        featured: true,
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
        caption: "Patient Consultation",
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&q=80",
        caption: "Homoeopathic Remedies",
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
        caption: "Medical Facilities",
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=600&q=80",
        caption: "Clinic Reception",
    },
    {
        id: 6,
        src: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&q=80",
        caption: "Expert Diagnosis",
    },
    {
        id: 7,
        src: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=80",
        caption: "Natural Remedies",
    },
];

// Testimonials are now fetched from Supabase (see Testimonials.tsx)

export const faqs = [
    {
        q: "How does classical homoeopathy differ from other treatments?",
        a: "Classical homoeopathy treats the whole person — mind, body, and spirit — using highly diluted natural substances. Unlike conventional medicine that suppresses symptoms, homoeopathy stimulates the body's own healing mechanism to address the root cause.",
    },
    {
        q: "Can homoeopathy aid in infertility treatment?",
        a: "Yes. Homoeopathy has shown positive results in addressing hormonal imbalances, PCOS, endometriosis, and stress-related infertility. Treatment is personalized to each patient's constitutional profile.",
    },
    {
        q: "How effective is homoeopathy in managing thyroid disorders?",
        a: "Homoeopathy can help regulate thyroid function naturally, particularly in cases of hypothyroidism, hyperthyroidism, and Hashimoto's. Many patients experience improved TSH levels and reduced dependence on conventional medication.",
    },
    {
        q: "Can homoeopathic remedies treat chronic skin conditions?",
        a: "Absolutely. Conditions like eczema, psoriasis, urticaria, and acne respond well to constitutional homoeopathic treatment, which addresses the underlying cause rather than just topical symptoms.",
    },
    {
        q: "Is homoeopathy safe for children?",
        a: "Homoeopathic remedies are completely safe for children of all ages, including infants. They are free from side effects and toxicity, making them an ideal choice for pediatric care.",
    },
    {
        q: "How does homoeopathy help with renal stones?",
        a: "Specific homoeopathic remedies help dissolve small to medium stones, relieve acute renal colic, and prevent recurrence by treating the underlying tendency to form stones.",
    },
    {
        q: "What is psychotherapy and when do I need it?",
        a: "Psychotherapy involves talking with a trained therapist to address emotional difficulties, mental health conditions, behavioral issues, or life transitions. It is beneficial for anxiety, depression, stress, relationship issues, and personal growth.",
    },
    {
        q: "Can homoeopathy treat anxiety and depression?",
        a: "Yes. Constitutional homoeopathic remedies, combined with psychotherapy where needed, provide a comprehensive and natural approach to managing anxiety, depression, and other mood disorders.",
    },
    {
        q: "How many sessions does treatment typically take?",
        a: "Duration varies by condition and individual. Acute conditions may resolve in a few weeks, while chronic conditions typically require 3–6 months of consistent treatment. Progress is reviewed at every follow-up.",
    },
    {
        q: "Do you offer online or video consultations?",
        a: "Yes. Both clinics offer video and phone consultations for patients who cannot visit in person. Contact us to schedule a remote appointment at your convenience.",
    },
];
