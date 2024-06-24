export type PurchaseTypes = {
    id: number;
    product: {
        id: number;
        description: string;
    };
    quantity: number;
}

export type TopCategoryTypes = {
    category: {
        id: number;
        description: string;
    };
    sales_count: number;
}

export type TopProductTypes = {
    product: {
        id: number;
        description: string;
    };
    total_quantity: number;
}