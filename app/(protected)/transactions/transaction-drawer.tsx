import React, { useState, useEffect } from "react";
import { Transaction } from "../types";
import { getTransactionById, updateTransaction, deleteTransaction } from "./actions"; // Assume deleteTransaction exists
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input"; // Use ShadCN Input
import { BasicDrawer } from "@/components/custom/drawers";

interface TransactionDrawerProps {
  isDrawerOpen: string | null;
  setIsDrawerOpen: (isOpen: string | null) => void;
}

export function TransactionDrawer({
  isDrawerOpen,
  setIsDrawerOpen,
}: TransactionDrawerProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (isDrawerOpen) {
      getTransactionById(isDrawerOpen).then((data) => {
        setTransaction(data);
        setNotes(data?.notes || "");
      });
    } else {
      setTransaction(null);
      setNotes("");
    }
  }, [isDrawerOpen]);

  const handleInputChange = (field: keyof Transaction, value: string) => {
    if (transaction) {
      setTransaction((prev) => (prev ? { ...prev, [field]: value } : null));
    }
  };

  const handleSaveChanges = async () => {
    if (transaction?.id) {
      await updateTransaction({ ...transaction, notes });
      setIsDrawerOpen(null); // Close the drawer after saving
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (transaction?.id) {
      await deleteTransaction(transaction.id);
      setIsDrawerOpen(null); // Close the drawer after deleting
      window.location.reload();
    }
  };

  return (
    <BasicDrawer
      isOpen={!!isDrawerOpen}
      onClose={() => setIsDrawerOpen(null)}
      onDelete={handleDelete}
      title="Transaction Details"
      description="Edit or review the details of the transaction."
      onSave={handleSaveChanges}
    >
      {transaction ? (
        <div className="overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold">Date</p>
              <Input
                type="date"
                value={transaction.date || ""}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Description</p>
              <Input
                type="text"
                value={transaction.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Category</p>
              <Input
                type="text"
                value={transaction.category || ""}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Type</p>
              <Input
                type="text"
                value={transaction.type || ""}
                onChange={(e) => handleInputChange("type", e.target.value)}
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Amount</p>
              <Input
                type="text"
                value={transaction.amount?.toString() || ""}
                onChange={(e) => handleInputChange("amount", e.target.value)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col h-full">
            {/* <p className="text-sm font-semibold">Notes</p> */}
            <Textarea
              placeholder="Type your notes here."
              className="mt-2 w-full h-full"
              value={notes || ""}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="p-4">Loading...</div>
      )}
    </BasicDrawer>
  );
}
