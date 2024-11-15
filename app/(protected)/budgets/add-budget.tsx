"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Account, Budget } from "../types";
import { getAccounts } from "../accounts/actions";
import { createClient } from "@/utils/supabase/client";
import { insertBudget } from "./actions";

export function AddBudget() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [budget, setBudget] = useState<Partial<Budget> | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  useEffect(() => {
    const fetchUserAccounts = async () => {
      const data = await getAccounts();
      if (data) {
        setAccounts(data);
      }
    };

    fetchUserAccounts();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBudget((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
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
        end_date: (budget?.end_date === "") ? undefined : budget?.end_date ,
      };
  
      await insertBudget(newBudget);
      setIsDialogOpen(false);
      resetForm();
      window.location.reload();
    }
  };
  

  const resetForm = () => {
    setBudget(null);
    setSelectedAccount("");
  };

  const isFormValid = budget?.name && budget?.amount && budget?.start_date;

  return (
    <>
      <Button className="text-xs px-2 py-1 w-auto h-auto flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
        Add Budget
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
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
              name="name"
              value={budget?.name || ""}
              onChange={handleChange}
              required
            />
            <select
              name="account_id"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="border rounded p-2 w-full"
            >
              <option value="" disabled>Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Category"
              name="category"
              value={budget?.category || ""}
              onChange={handleChange}
            />
            <Input
              placeholder="Amount"
              name="amount"
              type="number"
              value={budget?.amount || 0}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="Start Date"
              name="start_date"
              type="date"
              value={budget?.start_date || ""}
              onChange={handleChange}
              required
            />
            <Input
              placeholder="End Date"
              name="end_date"
              type="date"
              value={budget?.end_date || ""}
              onChange={handleChange}
            />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddBudget} disabled={!isFormValid}>
              Save Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
