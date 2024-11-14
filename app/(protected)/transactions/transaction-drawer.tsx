import React, { useState, useEffect } from "react";

import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Transaction } from "../types";
import { getTransactionById, updateTransaction } from "./actions";
import { Textarea } from "@/components/ui/textarea";

interface TransactionDrawerProps {
    isDrawerOpen: string | null; // Holds transaction ID if open, null otherwise
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

    const handleSaveChanges = async () => {
        if (transaction?.id) {
            await updateTransaction(transaction.id, { ...transaction, notes });
            setIsDrawerOpen(null); // Close the drawer after saving
        }
    };

    return (
        <Drawer open={!!isDrawerOpen} onOpenChange={() => setIsDrawerOpen(null)}>
            <DrawerContent className="h-full p-4 rounded-none mx-auto">
                <DrawerHeader>
                    <DrawerTitle>Transaction Details</DrawerTitle>
                    <DrawerDescription>Review the details of the transaction.</DrawerDescription>
                </DrawerHeader>
                
                {/* Display Transaction Details */}
                {transaction ? (
                    <div className="overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                            <div>
                                <p className="text-sm font-semibold">Date</p>
                                <p>{transaction.date}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Description</p>
                                <p>{transaction.description}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Category</p>
                                <p>{transaction.category}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Type</p>
                                <p className={transaction.type === "INCOME" ? "text-green-600" : "text-red-600"}>
                                    {transaction.type}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Amount</p>
                                <p>{transaction.amount}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Account ID</p>
                                <p>{transaction.account_id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold">User ID</p>
                                <p>{transaction.user_id}</p>
                            </div>

                            {/* Editable Notes Section */}
                            <div className="md:col-span-2">
                                <p className="text-sm font-semibold">Notes</p>
                                <Textarea
                                    placeholder="Type your notes here."
                                    className="mt-2 w-full h-32 md:h-48"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <DrawerFooter className="flex flex-col md:flex-row gap-2 justify-center mt-4">
                            <Button onClick={handleSaveChanges} className="w-full md:w-auto">
                                Save Changes
                            </Button>
                            <Button variant="outline" onClick={() => setIsDrawerOpen(null)} className="w-full md:w-auto">
                                Close
                            </Button>
                        </DrawerFooter>
                    </div>
                ) : (
                    <div className="p-4">Loading...</div>
                )}
            </DrawerContent>
        </Drawer>
    );
}
