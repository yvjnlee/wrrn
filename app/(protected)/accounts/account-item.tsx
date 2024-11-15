"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Account } from "../types";
import { AccountDrawer } from "./account-drawer";

interface AccountItemProps {
  account: Account;
}

export function AccountItem({ account }: AccountItemProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCardClick = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Card className="shadow-sm cursor-pointer" onClick={handleCardClick}>
        <CardHeader>
          <CardTitle>{account.account_name || "Unnamed Account"}</CardTitle>
          <CardDescription>{account.account_type || "Unknown Type"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Balance:</span>
            <span className="font-semibold">${account.balance?.toLocaleString() || "0.00"}</span>
          </div>
        </CardContent>
      </Card>

      <AccountDrawer
        isDrawerOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        account={account}
      />
    </>
  );
}
