"use server"

import { decrypt, encrypt } from "@/utils/utils";
import { Account } from "../types";
import { createClient } from "@/utils/supabase/server";

// Get a single account by ID
export const getAccountById = async (accountId: string): Promise<Account | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", accountId)
        .eq("user_id", user?.id)
        .single();

    if (error) {
        console.error("Error fetching account:", error.message);
        return null;
    }

    // Decrypt sensitive fields
    if (data) {
        if (data.account_name) data.account_name = decrypt(data.account_name);
        if (data.account_type) data.account_type = decrypt(data.account_type);
        if (data.balance) data.balance = decrypt(data.balance);
    }

    return data;
};

// Get all accounts for the current user
export const getAccounts = async (): Promise<Account[] | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching accounts:", error.message);
        return null;
    }

    // Decrypt sensitive fields
    const decryptedAccounts = data?.map((account) => {
        if (account.account_name) account.account_name = decrypt(account.account_name);
        if (account.account_type) account.account_type = decrypt(account.account_type);
        if (account.balance) account.balance = decrypt(account.balance);
        return account;
    });

    return decryptedAccounts;
};

// Insert a new account
export const insertAccount = async (newAccount: Account) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Encrypt sensitive fields
    const encryptedAccount = {
        ...newAccount,
        account_name: newAccount.account_name ? encrypt(newAccount.account_name) : undefined,
        account_type: newAccount.account_type ? encrypt(newAccount.account_type) : undefined,
        balance: newAccount.balance ? encrypt(newAccount.balance.toString()) : undefined,
        user_id: user?.id,
    };

    const { error } = await supabase.from("accounts").insert([encryptedAccount]);

    if (error) {
        console.error("Error inserting account:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Account inserted successfully.");
    return { success: true };
};

// Update an existing account
export const updateAccount = async (updatedFields: Partial<Account>) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Encrypt sensitive fields before updating
    const encryptedFields = {
        ...updatedFields,
        account_name: updatedFields.account_name ? encrypt(updatedFields.account_name) : undefined,
        account_type: updatedFields.account_type ? encrypt(updatedFields.account_type) : undefined,
        balance: updatedFields.balance ? encrypt(updatedFields.balance.toString()) : undefined,
    };

    const { error } = await supabase
        .from("accounts")
        .update(encryptedFields)
        .eq("user_id", user?.id)
        .eq("id", updatedFields.id);

    if (error) {
        console.error("Error updating account:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Account updated successfully.");
    return { success: true };
};

// Delete an account by ID
export const deleteAccount = async (accountId: string) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
        .from("accounts")
        .delete()
        .eq("id", accountId)
        .eq("user_id", user?.id);

    if (error) {
        console.error("Error deleting account:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Account deleted successfully.");
    return { success: true };
};
