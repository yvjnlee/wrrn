export interface Account {
    id?: UUID;
    user_id?: UUID;
    account_name?: string;
    account_type?: string;
    balance?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Budget {
    id?: UUID;
    user_id?: UUID;
    account_id?: UUID;
    name?: string;
    category?: string;
    amount?: number;
    start_date?: string;
    end_date?: string;
    spent?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Transaction {
    id?: UUID;
    user_id?: UUID;
    account_id?: UUID;
    date?: string;
    description?: string;
    notes?: string;
    amount?: number;
    type?: string;
    category?: string;
    created_at?: string;
    updated_at?: string;
}