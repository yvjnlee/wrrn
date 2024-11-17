"use server"

import { Account } from "../types";
import { createClient } from "@/utils/supabase/server";

// Get a single account by ID
export const getAccountById = async (accountId: string): Promise<Account | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .eq('user_id', user?.id)
      .single();

    if (error) {
        console.error('Error fetching account:', error.message);
        return null;
    }

    return data as Account;
};

// Get all accounts for the current user
export const getAccounts = async (): Promise<Account[] | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching accounts:', error.message);
      return null;
    }
  
    return data as Account[];
};

// Insert a new account
export const insertAccount = async (newAccount: Account) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Insert the new account
    const { error } = await supabase
      .from('accounts')
      .insert([newAccount]);
  
    if (error) {
      console.error('Error inserting account:', error.message);
      return { success: false, error: error.message };
    }
  
    console.log('Account inserted successfully.');
    return { success: true };
};

// Update an existing account
export const updateAccount = async (updatedFields: Partial<Account>) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('accounts')
      .update(updatedFields)
      .eq('user_id', user?.id);
  
    if (error) {
      console.error('Error updating account:', error.message);
      return { success: false, error: error.message };
    }
  
    console.log('Account updated successfully.');
    return { success: true };
};

// Delete an account by ID
export const deleteAccount = async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', user?.id);
  
    if (error) {
      console.error('Error deleting account:', error.message);
      return { success: false, error: error.message };
    }
  
    console.log('Account deleted successfully.');
    return { success: true };
};
