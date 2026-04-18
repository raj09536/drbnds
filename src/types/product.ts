export interface Product {
    id: string
    name: string
    brand: string
    category: string
    price: number
    original_price?: number | null
    description: string
    image_url: string
    weight?: string | null
    in_stock: boolean
    is_popular: boolean
    is_best_seller: boolean
    tags?: string[] | null
    created_at?: string
}
