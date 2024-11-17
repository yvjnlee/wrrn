"use server";

import { Budget } from "../types";
import { createClient } from "@/utils/supabase/server";

// Get a single budget by ID
export const getBudgetById = async (budgetId: string): Promise<Budget | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', budgetId)
      .eq('user_id', user?.id)
      .single();

    if (error) {
        console.error('Error fetching budget:', error.message);
        return null;
    }

    return data as Budget; // Return the budget if found
};

// Get all budgets for the current user
export const getAccountBudgets = async (accountId: string): Promise<Budget[] | null> => {
  const supabase = await createClient();
  const {
      data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user?.id)
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching budgets:', error.message);
    return null;
  }

  return data as Budget[]; // Return the list of budgets for the user
};

// Get all budgets for the current user
export const getBudgets = async (): Promise<Budget[] | null> => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error('Error fetching budgets:', error.message);
      return null;
    }
  
    return data as Budget[]; // Return the list of budgets for the user
};

// Insert a new budget
export const insertBudget = async (newBudget: Budget) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('budgets')
      .insert([newBudget]);
  
    if (error) {
      console.error('Error inserting budget:', error.message);
      return { success: false, error: error.message };
    }
  
    console.log('Budget inserted successfully.');
    return { success: true };
};

// Update an existing budget
export const updateBudget = async (id: string, updatedFields: Partial<Budget>) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('budgets')
      .update(updatedFields)
      .eq('id', id);
  
    if (error) {
      console.error('Error updating budget:', error.message);
      return { success: false, error: error.message };
    }
  
    console.log('Budget updated successfully.');
    return { success: true };
};

// Delete a budget by ID
export const deleteBudget = async (id: string) => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
  
    if (error) {
      console.error('Error deleting budget:', error.message);
      return { success: false, error: error.message };
    }
  
    console.log('Budget deleted successfully.');
    return { success: true };
};
