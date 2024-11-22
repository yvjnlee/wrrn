import { Transaction } from "../types";

export const parseTransactionData = (data: Transaction[]): Transaction[] => {
    return data
      .map((row) => {
        const transaction = Object.values(row);
  
        let date = "";
        let description = "";
        const category = "Uncategorized";
        let amount = 0;
        let balance = 0;
  
        const numericValues = transaction.filter((value) => !isNaN(Number(value))).map(Number);
        const nonNumericValues = transaction.filter((value) => isNaN(Number(value)));
  
        // Identify the balance as the highest numeric value
        balance = Math.max(...numericValues);
  
        // Remove the balance from numeric values to isolate credit and debit
        const [credit, debit] = numericValues.filter((value) => value !== balance);
  
        // Calculate amount based on credit and debit
        if (credit !== undefined && debit !== undefined) {
          amount = debit - credit;
        } else {
          amount = credit || debit || 0;
        }
  
        // Assume first non-numeric value is date and the second is description
        date = String(nonNumericValues.find((value) => isDate(String(value))) || "");
        description = String(nonNumericValues.find((value) => value !== date) || "");
  
        // Check if required fields are present to return a valid transaction
        if (date && description && (amount !== 0 || balance !== 0)) {
          return { date, description, category, amount, balance };
        } else {
          return null;
        }
      })
      .filter((transaction) => transaction !== null) as Transaction[];
};
  

export const isDate = (value: string): boolean => {
    return !isNaN(Date.parse(value));
};
