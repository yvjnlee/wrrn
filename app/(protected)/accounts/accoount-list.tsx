import React from "react";
import { Account } from "../types";
import { AccountItem } from "./account-item";

interface AccountListProps {
  accounts: Account[] | null;
}

export function AccountList({ accounts }: AccountListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {accounts && accounts.length > 0 ? (
        accounts.map((account) => (
          <AccountItem key={account.id} account={account} />
        ))
      ) : (
        <p className="text-center w-full py-8">No accounts available.</p>
      )}
    </div>
  );
}
