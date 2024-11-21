"use server";

import { decrypt, encrypt } from "@/utils/utils";
import { Transaction } from "../types";
import { createClient } from "@/utils/supabase/server";

// Get a single transaction by ID
export const getTransactionById = async (transactionId: string): Promise<Transaction | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .eq("user_id", user?.id)
        .single();

    if (error) {
        console.error("Error fetching transaction:", error.message);
        return null;
    }

    // Decrypt sensitive fields
    if (data) {
        if (data.description) data.description = decrypt(data.description);
        if (data.notes) data.notes = decrypt(data.notes);
        if (data.amount) data.amount = parseFloat(decrypt(data.amount.toString()));
        if (data.type) data.type = decrypt(data.type);
        if (data.category) data.category = decrypt(data.category);
    }

    return data as Transaction;
};

// Get all transactions for a specific account
export const getAccountTransactions = async (accountId: string): Promise<Transaction[] | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .eq("account_id", accountId)
        .order("date", { ascending: false });

    if (error) {
        console.error("Error fetching transactions:", error.message);
        return null;
    }

    // Decrypt sensitive fields
    const decryptedTransactions = data?.map((transaction) => {
        if (transaction.description) transaction.description = decrypt(transaction.description);
        if (transaction.notes) transaction.notes = decrypt(transaction.notes);
        if (transaction.amount) transaction.amount = parseFloat(decrypt(transaction.amount.toString()));
        if (transaction.type) transaction.type = decrypt(transaction.type);
        if (transaction.category) transaction.category = decrypt(transaction.category);
        return transaction;
    });

    return decryptedTransactions as Transaction[];
};

// Get all transactions for the current user
export const getTransactions = async (): Promise<Transaction[] | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("date", { ascending: false });

    if (error) {
        console.error("Error fetching transactions:", error.message);
        return null;
    }

    // Decrypt sensitive fields
    const decryptedTransactions = data?.map((transaction) => {
        if (transaction.description) transaction.description = decrypt(transaction.description);
        if (transaction.notes) transaction.notes = decrypt(transaction.notes);
        if (transaction.amount) transaction.amount = parseFloat(decrypt(transaction.amount.toString()));
        if (transaction.type) transaction.type = decrypt(transaction.type);
        if (transaction.category) transaction.category = decrypt(transaction.category);
        return transaction;
    });

    return decryptedTransactions as Transaction[];
};

// Insert a new transaction
export const insertTransaction = async (newTransaction: Transaction) => {
  const supabase = await createClient();
  const {
      data: { user },
  } = await supabase.auth.getUser();

    // Check if a duplicate exists in Supabase
    const { data: duplicate } = await supabase
        .from("transactions")
        .select("id")
        .eq("date", newTransaction.date)
        .eq("amount", newTransaction.amount)
        .eq("description", newTransaction.description)
        .single();

    if (duplicate) {
        console.log("Duplicate transaction detected. Insert aborted.");
        return { success: false, message: "Duplicate transaction" };
    }

    // Encrypt sensitive fields
    const encryptedTransaction = {
        ...newTransaction,
        description: newTransaction.description ? encrypt(newTransaction.description) : undefined,
        notes: newTransaction.notes ? encrypt(newTransaction.notes) : undefined,
        amount: newTransaction.amount ? encrypt(newTransaction.amount.toString()) : undefined,
        type: newTransaction.type ? encrypt(newTransaction.type) : undefined,
        category: newTransaction.category ? encrypt(newTransaction.category) : undefined,
        user_id: user?.id
    };

    const { error } = await supabase.from("transactions").insert([encryptedTransaction]);

    if (error) {
        console.error("Error inserting transaction:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Transaction inserted successfully.");
    return { success: true };
};

// Update an existing transaction
export const updateTransaction = async (updatedFields: Partial<Transaction>) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Encrypt sensitive fields
    const encryptedFields = {
        ...updatedFields,
        description: updatedFields.description ? encrypt(updatedFields.description) : undefined,
        notes: updatedFields.notes ? encrypt(updatedFields.notes) : undefined,
        amount: updatedFields.amount ? encrypt(updatedFields.amount.toString()) : undefined,
        type: updatedFields.type ? encrypt(updatedFields.type) : undefined,
        category: updatedFields.category ? encrypt(updatedFields.category) : undefined,
    };

    const { error } = await supabase
        .from("transactions")
        .update(encryptedFields)
        .eq("user_id", user?.id)
        .eq("id", encryptedFields.id);

    if (error) {
        console.error("Error updating transaction:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Transaction updated successfully.");
    return { success: true };
};

// Delete a transaction by ID
export const deleteTransaction = async (transactionId: string) => {
  const supabase = await createClient();
  const {
      data: { user },
  } = await supabase.auth.getUser();

    const { error } = await supabase.from("transactions")
      .delete()
      .eq("id", transactionId)
      .eq("user_id", user?.id);

    if (error) {
        console.error("Error deleting transaction:", error.message);
        return { success: false, error: error.message };
    }

    console.log("Transaction deleted successfully.");
    return { success: true };
};
