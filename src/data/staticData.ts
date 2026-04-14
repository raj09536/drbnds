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
    {
        id: 2,
        name: "Dr. Himanshu Bhandari",
        photo: "/second_doctor.jpeg",
        qualifications: ["B.H.M.S (H.P.U)"],
        years_exp: 8,
        specialization: "Classical Homoeopathy",
        bio: "Dr. Himanshu Bhandari brings 8+ years of dedicated homoeopathic practice to Ocean Hospital in Bijnor. His patient-first approach and deep understanding of classical homoeopathy principles have helped thousands of patients find natural, lasting relief from chronic and acute conditions.",
        clinic_name: "Ocean Hospital Homoeopathic — Bijnor",
        clinic_address:
            "Ocean Hospital, Nagina Chauraha, Dhampur, Bijnor, Uttar Pradesh",
        phone: "+91-8191919949",
        phone2: "",
        map_link:
            "https://www.google.com/maps/place/Ocean+hospital+homoeopathic/@29.3120453,78.5042171,17z",
        map_embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.0!2d78.5042171!3d29.3120453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390bc90066b7eb73%3Ae2754a8d5d6b0540!2sOcean%20hospital%20homoeopathic!5e0!3m2!1sen!2sin!4v1",
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
        doctor: "Dr. B. N. Dwivedy",
        map_link:
            "https://www.google.com/maps/place/DRBND'S+HOMOEOPATHIC+CLINIC/@30.2925051,78.0685929,17z",
        map_embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3444.0!2d78.0685929!3d30.2925051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39092972f1585eed%3A0x581dc7c1c4b30e8e!2sDRBND'S%20HOMOEOPATHIC%20CLINIC!5e0!3m2!1sen!2sin!4v1",
        timings: [
            { day: "Monday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Tuesday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Wednesday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Thursday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Friday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Saturday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Sunday", time: "10:00 AM – 1:00 PM", closed: false },
        ],
    },
    {
        id: 2,
        name: "Ocean Hospital Homoeopathic",
        location: "Dhampur, Bijnor, U.P.",
        address:
            "Ocean Hospital, Nagina Chauraha, Dhampur, Bijnor, Uttar Pradesh",
        phone: "+91-8191919949",
        phone2: "",
        email: "drbndclinic@gmail.com",
        doctor: "Dr. Himanshu Bhandari",
        map_link:
            "https://www.google.com/maps/place/Ocean+hospital+homoeopathic/@29.3120453,78.5042171,17z",
        map_embed:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3516.0!2d78.5042171!3d29.3120453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390bc90066b7eb73%3Ae2754a8d5d6b0540!2sOcean%20hospital%20homoeopathic!5e0!3m2!1sen!2sin!4v1",
        timings: [
            { day: "Monday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Tuesday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Wednesday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Thursday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Friday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Saturday", time: "10:00 AM – 8:30 PM", closed: false },
            { day: "Sunday", time: "10:00 AM – 1:00 PM", closed: false },
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
    { icon: '🤧', title: 'Allergies', desc: 'Skin allergies, food allergies, dust allergies aur sabhi prakar ki allergic conditions ka homoeopathic ilaj.' },
    { icon: '👶', title: 'Children Problems', subtitle: '(Paediatric)', desc: 'Bacchon ki sabhi bimariyon ka safe aur effective homoeopathic treatment — bina side effects ke.' },
    { icon: '👴', title: 'Old Age Problems', subtitle: '(Geriatrics)', desc: 'Buzurgon ki takleefon jaise joint pain, weakness, memory issues ka gentle homoeopathic ilaj.' },
    { icon: '👩', title: 'Female Problems', subtitle: '(Gynaecology)', desc: 'Mahilaon ki sabhi samasyon — PCOD, irregular periods, leucorrhoea ka visheshagya upchar.' },
    { icon: '✨', title: 'Beauty Problems', desc: 'Acne, hair fall, pigmentation, skin problems ka andar se ilaj — natural aur long lasting results.' },
    { icon: '🧠', title: 'Mind / Mental Problems', desc: 'Anxiety, depression, stress, insomnia aur sabhi mansik samasyon ka homoeopathic samadhan.' },
    { icon: '⚡', title: 'Hormonal / Endocrinal Problems', desc: 'Thyroid, diabetes, hormonal imbalance ka root cause se homoeopathic upchar.' },
    { icon: '🦴', title: 'Bones & Joint Problems', desc: 'Arthritis, back pain, cervical, knee pain — sabhi haddi aur jodo ki takleefon ka ilaj.' },
    { icon: '🧬', title: 'Neurological Problems', desc: 'Migraine, nerve pain, numbness aur sabhi neurological conditions ka homoeopathic treatment.' },
    { icon: '🫘', title: 'Kidney Problems', desc: 'Kidney stones, UTI, kidney function issues ka safe homoeopathic management.' },
    { icon: '🫃', title: 'Gastro / Gastric Problems', desc: 'Acidity, IBS, constipation, gas, digestive disorders ka permanent homoeopathic ilaj.' },
    { icon: '👂', title: 'Ear / Nose / Throat', desc: 'Sinusitis, tonsils, ear infections, nasal problems ka homoeopathic upchar.' },
    { icon: '🫁', title: 'Respiratory Problems', desc: 'Asthma, bronchitis, chronic cough, breathing issues ka root se homoeopathic ilaj.' },
    { icon: '🌿', title: 'Lifestyle Problems', desc: 'Obesity, fatigue, immunity issues, lifestyle disorders ka holistic homoeopathic samadhan.' },
];

export const services = [
    {
        title: 'All Type Consultation',
        desc: 'In-clinic, online aur phone consultation available — apni suvidha ke anusaar doctor se milein.',
        icon: '🩺',
        image: '/doctor.jpeg',
        slug: 'all-type-consultation'
    },
    {
        title: 'Medicine Home Delivery',
        desc: 'Ghar baithe homoeopathic dawai mangwaiye — fast aur reliable delivery aapke darwaze tak.',
        icon: '🚚',
        image: '/homeopathic-medicine.jpg',
        slug: 'medicine-home-delivery'
    },
    {
        title: 'Diet Management',
        desc: 'Disease oriented diet chart, goal oriented diet plan aur personalized nutrition guidance.',
        icon: '🥗',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
        slug: 'diet-management'
    },
    {
        title: 'Cosmetic Products',
        desc: 'Natural homoeopathic cosmetic products — skin care, hair care aur beauty solutions.',
        icon: '✨',
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
        slug: 'cosmetic-products'
    },
    {
        title: 'Diet Chart Service',
        desc: 'Vyaktigat diet chart — aapki bimari, age aur lifestyle ke anusaar personalized meal plan.',
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
