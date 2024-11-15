"use client"

import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Account } from "../types"; // Make sure this path is correct for the Account type
import { insertAccount } from "./actions";
import { createClient } from "@/utils/supabase/client";

export function AddAccount() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [account, setAccount] = useState<Partial<Account>>({
    account_name: "",
    account_type: "",
    balance: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
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

  const isFormValid = account.account_name && account.account_type;

  return (
    <>
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
              onChange={handleChange}
            />
            <Input
              name="account_type"
              placeholder="Account Type"
              value={account.account_type || ""}
              onChange={handleChange}
            />
            <Input
              name="balance"
              type="number"
              placeholder="Initial Balance"
              value={account.balance?.toString() || ""}
              onChange={handleChange}
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
    </>
  );
}
