"use server"

import { Transaction } from "../types";
import { createClient } from "@/utils/supabase/server";

export const getTransactionById = async (transactionId: string): Promise<Transaction | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .eq('user_id', user?.id)
      .single();

    if (error) {
        console.error('Error fetching transaction:', error.message);
        return null;
    }

    return data as Transaction; // Return the transaction if found
};

export const getTransactions = async (): Promise<Transaction[] | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .order('date', { ascending: false });
  
    if (error) {
      console.error('Error fetching transactions:', error.message);
      return null; // Return null to indicate an error occurred
    }
  
    return data as Transaction[]; // Return the list of transactions for the user
};

export const insertTransaction = async (newTransaction: Transaction) => {
    const supabase = await createClient();

    // Check if a duplicate exists in Supabase
    const { data: duplicate, error: selectError } = await supabase
      .from('transactions')
      .select('id')
      .eq('date', newTransaction.date)
      .eq('amount', newTransaction.amount)
      .eq('description', newTransaction.description)
      .single();
  
    if (duplicate) {
      console.log('Duplicate transaction detected. Insert aborted.');
      return { success: false, message: 'Duplicate transaction' };
    }
  
    // Insert if no duplicate
    const { error: insertError } = await supabase
      .from('transactions')
      .insert([newTransaction]);
  
    if (insertError) {
      console.error('Error inserting transaction:', insertError);
      return { success: false, error: insertError.message };
    }
  
    console.log('Transaction inserted successfully.');
    return { success: true };
  };

  export const updateTransaction = async (id: string, updatedFields: Partial<Transaction>) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('transactions')
      .update(updatedFields)
      .eq('id', id);
  
    if (error) {
      console.error('Error updating transaction:', error);
      return { success: false, error: error.message };
    }
  
    console.log('Transaction updated successfully.');
    return { success: true };
};

export const deleteTransaction = async (id: string) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('Error deleting transaction:', error);
      return { success: false, error: error.message };
    }
  
    console.log('Transaction deleted successfully.');
    return { success: true };
};