"use server";

import { decrypt, encrypt } from "@/utils/utils";
import { Budget } from "../types";
import { createClient } from "@/utils/supabase/server";

// Get a single budget by ID
export const getBudgetById = async (budgetId: string): Promise<Budget | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("id", budgetId)
        .eq("user_id", user?.id)
        .single();

    if (error) {
        console.error("Error fetching budget:", error.message);
        return null;
    }

    // Decrypt sensitive fields
    if (data) {
        if (data.name) data.name = decrypt(data.name);
        if (data.category) data.category = decrypt(data.category);
        if (data.amount) data.amount = parseFloat(decrypt(data.amount.toString()));
        if (data.spent) data.spent = parseFloat(decrypt(data.spent.toString()));
    }

    return data as Budget;
};

// Get all budgets for a specific account
export const getAccountBudgets = async (accountId: string): Promise<Budget[] | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user?.id)
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching budgets:", error.message);
        return null;
    }

    // Decrypt sensitive fields
    const decryptedBudgets = data?.map((budget) => {
        if (budget.name) budget.name = decrypt(budget.name);
        if (budget.category) budget.category = decrypt(budget.category);
        if (budget.amount) budget.amount = parseFloat(decrypt(budget.amount.toString()));
        if (budget.spent) budget.spent = parseFloat(decrypt(budget.spent.toString()));
        return budget;
    });

    return decryptedBudgets as Budget[];
};

// Get all budgets for the current user
export const getBudgets = async (): Promise<Budget[] | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching budgets:", error.message);
        return null;
    }

    // Decrypt sensitive fields
    const decryptedBudgets = data?.map((budget) => {
        if (budget.name) budget.name = decrypt(budget.name);
        if (budget.category) budget.category = decrypt(budget.category);
        if (budget.amount) budget.amount = parseFloat(decrypt(budget.amount.toString()));
        if (budget.spent) budget.spent = parseFloat(decrypt(budget.spent.toString()));
        return budget;
    });

    return decryptedBudgets as Budget[];
};

// Insert a new budget
export const insertBudget = async (newBudget: Budget) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Encrypt sensitive fields
    const encryptedBudget = {
        ...newBudget,
        name: newBudget.name ? encrypt(newBudget.name) : undefined,
        category: newBudget.category ? encrypt(newBudget.category) : undefined,
        amount: newBudget.amount ? encrypt(newBudget.amount.toString()) : undefined,
        spent: newBudget.spent ? encrypt(newBudget.spent.toString()) : undefined,
        user_id: user?.id
    };

    const { error } = await supabase.from("budgets").insert([encryptedBudget]);

    if (error) {
        console.error("Error inserting budget:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Budget inserted successfully.");
    return { success: true };
};

// Update an existing budget
export const updateBudget = async (updatedFields: Partial<Budget>) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Encrypt sensitive fields
    const encryptedFields = {
        ...updatedFields,
        name: updatedFields.name ? encrypt(updatedFields.name) : undefined,
        category: updatedFields.category ? encrypt(updatedFields.category) : undefined,
        amount: updatedFields.amount ? encrypt(updatedFields.amount.toString()) : undefined,
        spent: updatedFields.spent ? encrypt(updatedFields.spent.toString()) : undefined,
    };

    const { error } = await supabase
        .from("budgets")
        .update(encryptedFields)
        .eq("id", updatedFields.id)
        .eq("user_id", user?.id);

    if (error) {
        console.error("Error updating budget:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Budget updated successfully.");
    return { success: true };
};

// Delete a budget by ID
export const deleteBudget = async (budgetId: string) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("budgets")
        .delete()
        .eq("id", budgetId)
        .eq("user_id", user?.id);

    if (error) {
        console.error("Error deleting budget:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Budget deleted successfully.");
    return { success: true };
};
