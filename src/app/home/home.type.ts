export type CategoryTypes = {
    description: string;
    id: number;
}

export type DecodedTokenTypes = {
    id: string;
    sub: string;
}

export type ProductTypes = {
    id: number;
    description: string;
    price: number | null;
    price_in_usd: number | null;
    category_id: number | null;
    stock_quantity: number | null;
    category: {
        id: number;
        description: string;
    }
}

export type NewProductTypes = {
    description: string;
    price: number | null;
    category_id: number | null;
    stock_quantity: number | null;
    user_id: string | number;
}