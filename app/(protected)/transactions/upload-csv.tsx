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
import { getAccounts } from "../accounts/actions";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

/*
 * @To-Do: try to use service workers or something when inserting data so the user isnt stuck on the page
 */
export function UploadCsv() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // CSV preview and mapping
  const [rawPreviewRow, setRawPreviewRow] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, number>>({
    date: -1,
    description: -1,
    amount: -1,
    income: -1,
    expense: -1,
  });
  const [transactionMethod, setTransactionMethod] = useState<"amount" | "income-expense">("amount");

  useEffect(() => {
    const fetchUserAccounts = async () => {
      const data = await getAccounts();
      if (data) setAccounts(data);
    };
    fetchUserAccounts();
  }, []);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0] || null;
    setFile(uploadedFile);

    if (uploadedFile) {
      Papa.parse(uploadedFile, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as string[][];
          if (data.length > 0) setRawPreviewRow(data[0]); // Use the first row as a preview
        },
      });
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedAccount) return;
  
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    setIsLoading(true);
  
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data as string[][];
  
        const transactions: Transaction[] = rows.map((row, rowIndex) => {
          const date = row[columnMapping.date] || "";
          const description = row[columnMapping.description] || "";
          let amount = 0;
  
          if (columnMapping.amount !== -1) {
            const rawAmount = row[columnMapping.amount];
            amount = parseFloat(rawAmount || "0");
            if (isNaN(amount)) {
              console.error(`Invalid amount at row ${rowIndex}:`, rawAmount);
              amount = 0;
            }
          } else if (columnMapping.income !== -1 || columnMapping.expense !== -1) {
            // Use "Income - Expense" method if both 'income' and 'expense' are mapped
            const rawIncome = row[columnMapping.income];
            const rawExpense = row[columnMapping.expense];
          
            const income = parseFloat(rawIncome || "0");
            const expense = parseFloat(rawExpense || "0");
          
            amount = (isNaN(income) ? 0 : income) - (isNaN(expense) ? 0 : expense);
          } else {
            console.error(
              `No valid columns mapped for amount calculation at row ${rowIndex}. Ensure 'amount' or both 'income' and 'expense' are mapped.`
            );
            amount = 0;
          }          
  
          return {
            user_id: user?.id,
            account_id: selectedAccount,
            date: date,
            description: description,
            amount: amount,
            notes: "",
            type: amount > 0 ? "INCOME" : "EXPENSE",
            category: "Uncategorized",
            updated_at: new Date().toISOString(),
          };
        });
  
        for (const transaction of transactions) {
          await insertTransaction(transaction);
        }
  
        setIsLoading(false);
        setIsDialogOpen(false);
        setFile(null);
        setRawPreviewRow([]);
        setColumnMapping({ date: -1, description: -1, amount: -1, income: -1, expense: -1 });
        sessionStorage.setItem("showToast", "true");
        window.location.reload();
      },
    });
  };
  

  // Display toast on successful upload
  useEffect(() => {
    if (sessionStorage.getItem("showToast") === "true") {
      setShowToast(true);
      sessionStorage.removeItem("showToast"); // Clear toast flag
      setTimeout(() => setShowToast(false), 3000); // Auto-close toast
    }
  }, []);

  return (
    <ToastProvider>
      <Button
        className="text-xs px-2 py-1 w-auto h-auto flex items-center gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        Import Data
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
            <DialogDescription>
              Select an account and upload your CSV file to import transactions.
            </DialogDescription>
          </DialogHeader>

          <div className={`space-y-4 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}>
            <Select
              onValueChange={(value) => setSelectedAccount(value)}
              value={selectedAccount || ""}
            >
              <SelectTrigger className="w-full">
                <span>
                  {accounts.find((account) => account.id === selectedAccount)?.account_name ||
                    "Select an Account"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.account_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

            {file && (
              <>
                <p className="text-sm text-gray-600">Selected File: {file.name}</p>

                {rawPreviewRow.length > 0 && (
                  <div className="overflow-x-auto">
                    <h3 className="text-lg font-small mb-2">Preview Row</h3>
                    <Table className="table-fixed border border-gray-300 w-full">
                      <TableHeader>
                        <TableRow>
                          {rawPreviewRow.map((_, index) => (
                            <TableCell key={index} className="font-medium border border-gray-300">
                              Column {index + 1}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          {rawPreviewRow.map((value, index) => (
                            <TableCell key={index} className="border border-gray-300 truncate">
                              {value}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div>
                  <h4 className="text-md font-medium">Map Columns</h4>
                  <p className="text-sm text-gray-600">Please make sure to map fields ALL possible fields from your data.</p>
                  {["date", "description", "amount", "income", "expense"].map((field) => (
                    <div key={field} className="flex items-center mt-2">
                      <span className="w-32 capitalize text-sm">{field}:</span>
                      <Select
                        onValueChange={(value) =>
                          setColumnMapping({
                            ...columnMapping,
                            [field]: parseInt(value, 10), // Update mapping or set to -1 if unselected
                          })
                        }
                        value={columnMapping[field] !== -1 ? String(columnMapping[field]) : ""}
                      >
                        <SelectTrigger className="w-full">
                          <span>
                            {columnMapping[field] !== -1
                              ? `Column ${columnMapping[field] + 1}`
                              : "Unselect"}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-1">Unselect</SelectItem> {/* Option to unselect */}
                          {rawPreviewRow.map((_, index) => (
                            <SelectItem
                              key={index}
                              value={String(index)}
                              disabled={Object.values(columnMapping).includes(index)} // Disable if already mapped
                            >
                              Column {index + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={handleUpload}
              disabled={isLoading || !file || !selectedAccount}
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
            <p className="text-sm text-gray-500">
              Your transactions have been imported successfully!
            </p>
          </div>
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  );
}
