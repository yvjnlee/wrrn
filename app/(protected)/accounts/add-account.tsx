"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Account } from "../types"; // Make sure this path is correct for the Account type
import { insertAccount } from "./actions";
import { createClient } from "@/utils/supabase/client";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import { CheckCircle } from "lucide-react";

export function AddAccount() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [account, setAccount] = useState<Partial<Account>>({
    account_name: "",
    account_type: "",
    balance: 0,
  });

  const handleInputChange = (field: string, value: string) => {
    setAccount((prev) => {
      if (field === "balance") {
        if (!/^[-+]?[0-9]*\.?[0-9]*$/.test(value)) {
          return prev;
        }
      }

      const newAccount = { ...prev, [field]: value };

      return newAccount;
    });
  };

  const handleSave = async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (user?.id) {
      const newAccount: Partial<Account> = {
        user_id: user.id,
        account_name: account.account_name,
        account_type: account.account_type,
        balance: account.balance,
      };
  
      await insertAccount(newAccount);
      setIsDialogOpen(false);
      resetForm();
      sessionStorage.setItem("showToast", "true");
      window.location.reload();
    }
  };
  
  const resetForm = () => {
    setAccount({
      account_name: "",
      account_type: "",
      balance: 0,
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("showToast") === "true") {
      setShowToast(true);
      sessionStorage.removeItem("showToast"); // Clear toast flag
      setTimeout(() => setShowToast(false), 3000); // Auto-close toast
    }
  }, []);

  const isFormValid = account.account_name && account.account_type;

  return (
    <ToastProvider>
      <Button className="text-xs px-2 py-1 w-auto h-auto flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>Add Account</Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              name="account_name"
              placeholder="Account Name"
              value={account.account_name || ""}
              onChange={(e) => handleInputChange("account_name", e.target.value)}
            />
            <Input
              name="account_type"
              placeholder="Account Type"
              value={account.account_type || ""}
              onChange={(e) => handleInputChange("account_type", e.target.value)}
            />
            <Input
              name="balance"
              type="text"
              placeholder="Initial Balance"
              value={account.balance?.toString() || ""}
              onChange={(e) => handleInputChange("balance", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isFormValid}>
              Save Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Toast */}
      {showToast && (
        <Toast>
          <CheckCircle className="text-green-500" />

          <div>
            <p className="font-medium">Account Added</p>
            <p className="text-sm text-gray-500">Your account was successfully added.</p>
          </div>
        </Toast>
      )}

      <ToastViewport />
    </ToastProvider>
  );
}
