export interface Product {
    id: string
    name: string
    tagline: string
    description: string
    price: number
    originalPrice?: number
    image: string
    category: 'Immunity' | 'Digestive' | 'Skin' | 'Stress & Sleep' | 'Pain Relief' | 'General Wellness'
    brand: string
    inStock: boolean
    isBestseller: boolean
    rating: number
    reviewCount: number
    benefits: string[]
    dosage: string
    packSize: string
}

export const products: Product[] = [
    {
        id: "immunity-boost-drops",
        name: "Immunity Boost Drops",
        tagline: "Strengthen your body's natural defences",
        description: "A carefully formulated homoeopathic blend designed to support and enhance the immune system. Suitable for adults and children seeking a natural approach to immunity.",
        price: 349,
        originalPrice: 420,
        image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
        category: "Immunity",
        brand: "Dr. BND's",
        inStock: true,
        isBestseller: true,
        rating: 4.8,
        reviewCount: 124,
        benefits: [
            "Boosts natural immunity",
            "Reduces frequency of seasonal infections",
            "Safe for long-term use",
            "No known side effects"
        ],
        dosage: "10 drops in half a cup of water, twice daily before meals",
        packSize: "30 ml"
    },
    {
        id: "digestive-harmony-pellets",
        name: "Digestive Harmony Pellets",
        tagline: "Gentle relief for a settled stomach",
        description: "A classical homoeopathic preparation to address bloating, indigestion, acidity, and irregular bowel movements. Works gently and effectively.",
        price: 299,
        image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80",
        category: "Digestive",
        brand: "SBL",
        inStock: true,
        isBestseller: true,
        rating: 4.6,
        reviewCount: 98,
        benefits: [
            "Relieves bloating and flatulence",
            "Corrects acidity and heartburn",
            "Supports healthy digestion",
            "Gentle on the stomach"
        ],
        dosage: "4 pellets under tongue, three times daily",
        packSize: "25 gm"
    },
    {
        id: "skin-clarity-cream",
        name: "Skin Clarity Cream",
        tagline: "Radiant skin through natural healing",
        description: "Homoeopathic topical cream formulated for acne, eczema, and dry skin. Enriched with natural extracts to restore skin health without harsh chemicals.",
        price: 449,
        originalPrice: 520,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
        category: "Skin",
        brand: "Schwabe",
        inStock: true,
        isBestseller: false,
        rating: 4.5,
        reviewCount: 67,
        benefits: [
            "Reduces acne and blemishes",
            "Soothes eczema and dry patches",
            "Restores natural skin tone",
            "Free from steroids and parabens"
        ],
        dosage: "Apply a thin layer on affected area, twice daily",
        packSize: "25 gm"
    },
    {
        id: "calm-sleep-drops",
        name: "Calm & Sleep Drops",
        tagline: "Natural tranquillity for restful nights",
        description: "A soothing blend of homoeopathic remedies to ease anxiety, calm an overactive mind, and encourage deep, restorative sleep.",
        price: 379,
        image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&q=80",
        category: "Stress & Sleep",
        brand: "Dr. BND's",
        inStock: true,
        isBestseller: true,
        rating: 4.9,
        reviewCount: 156,
        benefits: [
            "Reduces anxiety and mental tension",
            "Promotes deeper, uninterrupted sleep",
            "Non-addictive and non-drowsy formula",
            "Suitable for chronic stress management"
        ],
        dosage: "15 drops in water, 30 minutes before bedtime",
        packSize: "30 ml"
    },
    {
        id: "joint-ease-tablets",
        name: "Joint Ease Tablets",
        tagline: "Move freely, live fully",
        description: "Clinically formulated homoeopathic tablets to relieve joint pain, stiffness, and inflammation associated with arthritis and overuse.",
        price: 399,
        originalPrice: 480,
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&q=80",
        category: "Pain Relief",
        brand: "Reckeweg",
        inStock: true,
        isBestseller: false,
        rating: 4.4,
        reviewCount: 89,
        benefits: [
            "Reduces joint pain and swelling",
            "Improves mobility and flexibility",
            "Addresses root cause of inflammation",
            "Safe for daily long-term use"
        ],
        dosage: "2 tablets three times daily with water",
        packSize: "20 tablets"
    },
    {
        id: "liver-detox-drops",
        name: "Liver Detox Drops",
        tagline: "Cleanse and revitalise from within",
        description: "A potent homoeopathic liver tonic to support detoxification, improve liver function, and aid recovery from fatty liver and jaundice.",
        price: 329,
        image: "https://images.unsplash.com/photo-1631563019676-dade0f91f9b5?w=600&q=80",
        category: "General Wellness",
        brand: "SBL",
        inStock: true,
        isBestseller: false,
        rating: 4.3,
        reviewCount: 54,
        benefits: [
            "Supports liver detoxification",
            "Improves appetite and digestion",
            "Aids recovery in liver disorders",
            "Reduces fatigue and sluggishness"
        ],
        dosage: "10 drops in water, three times daily before meals",
        packSize: "30 ml"
    },
    {
        id: "hair-vitality-oil",
        name: "Hair Vitality Oil",
        tagline: "Nourish your roots, revive your hair",
        description: "A homoeopathic hair oil blending traditional remedies to combat hair fall, promote growth, and restore shine to dull, thinning hair.",
        price: 299,
        image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=600&q=80",
        category: "Skin",
        brand: "Dr. BND's",
        inStock: true,
        isBestseller: true,
        rating: 4.7,
        reviewCount: 113,
        benefits: [
            "Reduces hair fall significantly",
            "Stimulates new hair growth",
            "Strengthens hair follicles",
            "Restores natural lustre"
        ],
        dosage: "Massage gently into scalp, leave for 2 hours, wash off",
        packSize: "100 ml"
    },
    {
        id: "allergy-relief-pellets",
        name: "Allergy Relief Pellets",
        tagline: "Breathe easy, every season",
        description: "Specially formulated homoeopathic pellets for seasonal and dust allergies, hay fever, and allergic rhinitis. Provides lasting relief without sedation.",
        price: 319,
        originalPrice: 380,
        image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&q=80",
        category: "Immunity",
        brand: "Schwabe",
        inStock: true,
        isBestseller: false,
        rating: 4.5,
        reviewCount: 76,
        benefits: [
            "Relieves sneezing and runny nose",
            "Reduces eye itching and watering",
            "Addresses allergic asthma triggers",
            "Non-drowsy formulation"
        ],
        dosage: "4 pellets under tongue, four times daily during acute phase",
        packSize: "25 gm"
    },
    {
        id: "stress-relief-complex",
        name: "Stress Relief Complex",
        tagline: "Rediscover your calm",
        description: "A multi-remedy homoeopathic complex addressing modern-day stress, burnout, irritability, and mental fatigue. Suitable for professionals and students.",
        price: 359,
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
        category: "Stress & Sleep",
        brand: "Reckeweg",
        inStock: false,
        isBestseller: false,
        rating: 4.2,
        reviewCount: 42,
        benefits: [
            "Reduces mental exhaustion",
            "Improves concentration and focus",
            "Calms irritability and mood swings",
            "Supports adrenal balance"
        ],
        dosage: "2 tablets twice daily or as directed by physician",
        packSize: "20 tablets"
    },
    {
        id: "back-pain-relief-gel",
        name: "Back Pain Relief Gel",
        tagline: "Targeted relief for aching backs",
        description: "A topical homoeopathic gel formulated for lower back pain, muscle spasms, and sciatica. Fast-absorbing and non-greasy.",
        price: 279,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
        category: "Pain Relief",
        brand: "SBL",
        inStock: true,
        isBestseller: false,
        rating: 4.3,
        reviewCount: 61,
        benefits: [
            "Fast-acting muscle pain relief",
            "Reduces inflammation in lumbar region",
            "Non-greasy, quick-absorbing formula",
            "Suitable for daily use"
        ],
        dosage: "Apply a generous amount to affected area and massage gently, 2-3 times daily",
        packSize: "30 gm"
    },
    {
        id: "wellness-multivitamin-drops",
        name: "Wellness Multivitamin Drops",
        tagline: "Complete nourishment, naturally",
        description: "A comprehensive homoeopathic tonic providing essential micronutrients to support overall health, energy levels, and wellbeing for the whole family.",
        price: 389,
        originalPrice: 450,
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
        category: "General Wellness",
        brand: "Dr. BND's",
        inStock: true,
        isBestseller: false,
        rating: 4.4,
        reviewCount: 85,
        benefits: [
            "Boosts energy and vitality",
            "Supports healthy growth in children",
            "Improves skin and hair health",
            "Suitable for all age groups"
        ],
        dosage: "10 drops in water, twice daily. Children: 5 drops twice daily",
        packSize: "30 ml"
    },
    {
        id: "acidity-gastro-drops",
        name: "Acidity & Gastro Drops",
        tagline: "End the burning, restore comfort",
        description: "Precision-formulated homoeopathic drops for chronic acidity, gastritis, peptic ulcers, and GERD. Tackles the root cause, not just the symptoms.",
        price: 309,
        image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80",
        category: "Digestive",
        brand: "Reckeweg",
        inStock: true,
        isBestseller: false,
        rating: 4.6,
        reviewCount: 93,
        benefits: [
            "Relieves burning sensation and acidity",
            "Heals gastric inflammation",
            "Reduces nausea and vomiting",
            "Suitable for chronic gastritis management"
        ],
        dosage: "10 drops in water before meals, three times daily",
        packSize: "30 ml"
    }
]

export const categories = ['Immunity', 'Digestive', 'Skin', 'Stress & Sleep', 'Pain Relief', 'General Wellness'] as const
export const brands = ["Dr. BND's", 'SBL', 'Schwabe', 'Reckeweg'] as const
