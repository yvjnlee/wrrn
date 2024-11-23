"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Account, Budget } from "../types";
import { getAccounts } from "../accounts/actions";
import { createClient } from "@/utils/supabase/client";
import { insertBudget } from "./actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { CheckCircle } from "lucide-react";

export function AddBudget() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [budget, setBudget] = useState<Partial<Budget>>({
    account_id: "",
    name: "",
    category: "",
    amount: 0,
    start_date: "",
    end_date: "",
    spent: 0,
  });
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      const data = await getAccounts();
      if (data) {
        setAccounts(data);
      }
    };

    fetchUserAccounts();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setBudget((prev) => {
      if (field === "amount") {
        // Validate numeric input for "amount"
        if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(value)) {
          return prev; // Ignore invalid input
        }
      }

      const newBudget = { ...prev, [field]: value };

      return newBudget;
    });
  };

  const handleAddBudget = async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.id) {
      const newBudget: Budget = {
        ...budget,
        user_id: user.id,
        account_id: selectedAccount || null,
        end_date: budget?.end_date === "" ? undefined : budget?.end_date,
      };

      await insertBudget(newBudget);
      setIsDialogOpen(false);
      resetForm();
      sessionStorage.setItem("showToast", "true");
      window.location.reload();
    }
  };

  const resetForm = () => {
    setBudget({});
    setSelectedAccount("");
  };

  useEffect(() => {
    if (sessionStorage.getItem("showToast") === "true") {
      setShowToast(true);
      sessionStorage.removeItem("showToast"); // Clear toast flag
      setTimeout(() => setShowToast(false), 3000); // Auto-close toast
    }
  }, []);

  const isFormValid =
    !!budget?.name && !!budget?.amount && !!budget?.start_date && !!selectedAccount;

  return (
    <ToastProvider>
      <Button
        className="text-xs px-2 py-1 w-auto h-auto flex items-center gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        Add Budget
      </Button>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          if (!open) resetForm();
          setIsDialogOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Budget Name"
              value={budget?.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
            <Select
              onValueChange={(value) => setSelectedAccount(value)}
              value={selectedAccount}
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
            <Input
              placeholder="Category"
              value={budget?.category || ""}
              onChange={(e) => handleInputChange("category", e.target.value)}
            />
            <Input
              placeholder="Amount"
              type="text"
              value={budget.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              required
            />
            <Input
              placeholder="Start Date"
              type="date"
              value={budget?.start_date || ""}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              required
            />
            <Input
              placeholder="End Date"
              type="date"
              value={budget?.end_date || ""}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddBudget} disabled={!isFormValid}>
              Save Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showToast && (
        <Toast>
          <CheckCircle className="text-green-500" />

          <div>
            <p className="font-medium">Budget Added</p>
            <p className="text-sm text-gray-500">Your budget was successfully added.</p>
          </div>
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  );
}
