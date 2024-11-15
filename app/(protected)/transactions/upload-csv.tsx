"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { Loader, Upload, CheckCircle } from "lucide-react";
import Papa from "papaparse";
import { insertTransaction } from "./actions";
import { Account, Transaction } from "../types";
import { createClient } from "@/utils/supabase/client";
import { parseTransactionData } from "./utils";
import { getAccounts } from "../accounts/actions";

export function UploadCsv() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      const data = await getAccounts();

      if (data) {
        setAccounts(data);
      }
    };

    fetchUserAccounts();
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };


const handleUpload = async () => {
  if (!file) {
    console.warn("Please select a file to upload.");
    return;
  }

  setIsLoading(true); // Start loading state

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: async (results) => {
      const parsedData: (Transaction | null)[] = parseTransactionData(results.data);

      for (const transaction of parsedData) {
        if (transaction) {
          const transactionWithDefaults: Transaction = {
            user_id: user?.id,
            account_id: selectedAccount || null,
            date: transaction.date,
            description: transaction.description,
            amount: transaction.amount,
            notes: "",
            type: transaction.amount && transaction.amount > 0 ? "INCOME" : "EXPENSE",
            category: transaction.category || "Uncategorized",
            updated_at: new Date().toISOString(),
          };

          await insertTransaction(transactionWithDefaults);
        }
      }

      setIsLoading(false); // End loading state
      setIsDialogOpen(false); // Close dialog after upload
      setFile(null); // Reset file

      // Set a flag in sessionStorage to show the toast after reload
      sessionStorage.setItem("showToast", "true");

      // Reload the page
      window.location.reload();
    },
  });
};

// In your component, check for the toast flag on mount
  useEffect(() => {
    if (sessionStorage.getItem("showToast") === "true") {
      setShowToast(true);
      sessionStorage.removeItem("showToast"); // Clear the flag after showing the toast

      // Automatically close the toast after a delay
      setTimeout(() => setShowToast(false), 3000);
    }
  }, []);

  return (
    <ToastProvider>
      <Button className="text-xs px-2 py-1 w-auto h-auto flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
        Import Data
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
            <DialogDescription>Select an account and upload your CSV file to import transactions.</DialogDescription>
          </DialogHeader>

          <div className={`space-y-4 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
            <select
              className="border rounded p-2 text-sm w-full"
              value={selectedAccount || ""}
              onChange={(e) => setSelectedAccount(e.target.value)}
              disabled={isLoading}
            >
              <option value="" disabled>Select an account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name}
                </option>
              ))}
            </select>

            <Button 
              variant="secondary" 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs px-2 py-1 w-auto h-auto flex items-center gap-2"
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" /> Select CSV File
            </Button>

            <Input
              id="file"
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />

            {file && <p className="text-sm text-gray-600">Selected File: {file.name}</p>}
          </div>

          <DialogFooter>
            <Button 
              onClick={handleUpload} 
              disabled={isLoading || !file} 
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-4 w-4" /> Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showToast && (
        <Toast>
          <CheckCircle className="text-green-500" />
          <div className="ml-3">
            <p className="font-medium">Upload Successful</p>
            <p className="text-sm text-gray-500">Your transactions have been imported successfully!</p>
          </div>
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  );
}
