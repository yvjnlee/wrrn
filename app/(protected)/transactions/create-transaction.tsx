"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Account, Transaction } from "../types";
import { insertTransaction } from "./actions";
import { getAccounts } from "../accounts/actions"; // Function to fetch accounts
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";

export function CreateTransactionButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [transaction, setTransaction] = useState<Transaction>({
    date: "",
    description: "",
    amount: 0,
    type: "",
    category: "",
    notes: "",
    account_id: "",
  });

  const [accounts, setAccounts] = useState<Account[]>([]); // Store accounts list

  useEffect(() => {
    const fetchUserAccounts = async () => {
      const data = await getAccounts();
      if (data) setAccounts(data);
    };

    if (isDialogOpen) {
      fetchUserAccounts();
    }
  }, [isDialogOpen]);

  const handleInputChange = (field: string, value: string) => {
    setTransaction((prev) => {
      // Only allow valid numeric inputs for the "amount" field
      if (field === "amount") {
        // Regex to allow valid positive/negative numbers and empty input
        if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(value)) {
          return prev; // Ignore invalid input
        }
      }

      const newTransaction = { ...prev, [field]: value };

      // Automatically determine the transaction type based on the amount
      if (field === "amount" && value.trim() !== "") {
        const numericAmount = parseFloat(value);
        newTransaction.type = numericAmount > 0 ? "INCOME" : "EXPENSE";
      }

      return newTransaction;
    });
  };

  const handleSubmit = async () => {
    await insertTransaction(transaction);

    setIsDialogOpen(false);
    setTransaction({
      date: "",
      description: "",
      amount: 0,
      type: "",
      category: "",
      notes: "",
      account_id: "", // Reset account_id
    });

    sessionStorage.setItem("showToast", "true");
    window.location.reload();
  };

  useEffect(() => {
    if (sessionStorage.getItem("showToast") === "true") {
      setShowToast(true);
      sessionStorage.removeItem("showToast"); // Clear toast flag
      setTimeout(() => setShowToast(false), 3000); // Auto-close toast
    }
  }, []);

  // Check if the required fields are filled
  const isFormValid =
    transaction.date?.trim() !== "" &&
    transaction.description?.trim() !== "" &&
    transaction.account_id?.trim() !== ""; // Ensure an account is selected

  return (
    <ToastProvider>
      <Button
        className="text-xs px-2 py-1 w-auto h-auto flex items-center gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        Create Transaction
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Transaction</DialogTitle>
            <DialogDescription>Fill in the details to create a new transaction.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="account">Account</Label>
              <Select
                onValueChange={(value) => handleInputChange("account_id", value)}
                value={transaction.account_id || ""}
              >
                <SelectTrigger className="w-full">
                  <span>
                    {accounts.find((account) => account.id === transaction.account_id)?.account_name ||
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
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={transaction.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Enter transaction description"
                value={transaction.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="text"
                placeholder="Enter transaction amount"
                value={transaction.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                type="text"
                placeholder="Enter transaction category"
                value={transaction.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes"
                value={transaction.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit} disabled={!isFormValid}>
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showToast && (
        <Toast>
          <CheckCircle className="text-green-500" />

          <div>
            <p className="font-medium">Transaction Added</p>
            <p className="text-sm text-gray-500">Your transaction was successfully added.</p>
          </div>
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  );
}
