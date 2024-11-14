"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertTransaction } from "./actions";
import { Transaction } from "../types";
import { createClient } from "@/utils/supabase/client";
import { ChangeEvent, useRef } from "react";
import Papa from "papaparse";
import { parseTransactionData } from "./utils";

export function UploadCsv() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger the hidden file input when the button is clicked
    }
  };

  const fileUploadAction = async (e: ChangeEvent<HTMLInputElement>) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const parsedData: (Transaction | null)[] = parseTransactionData(results.data);
  
          for (const transaction of parsedData) {
            if (transaction) {
              const transactionWithDefaults: Transaction = {
                user_id: user?.id,
                date: transaction.date,
                description: transaction.description,
                amount: transaction.amount,
                notes: '',
                type: transaction.amount && transaction.amount > 0 ? 'INCOME' : 'EXPENSE',
                category: transaction.category || 'Uncategorized',
                updated_at: new Date().toISOString(),
              };
  
              await insertTransaction(transactionWithDefaults);
            }
          }
          console.log("File upload and insert actions completed.");
        },
      });
    }
  };

  return (
    <>
      <Button 
        variant="secondary" 
        onClick={handleButtonClick}
        className="text-xs px-2 py-1 w-auto h-auto"
      >
        Import CSV File
      </Button>
      <Input
        id="file"
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={fileUploadAction}
        className="hidden"
      />
    </>
  );
}
