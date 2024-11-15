import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Account } from "../types";

interface AccountDrawerProps {
  isDrawerOpen: boolean;
  onClose: () => void;
  account: Account | null;
}

export function AccountDrawer({ isDrawerOpen, onClose, account }: AccountDrawerProps) {
  if (!account) return null;

  return (
    <Drawer open={isDrawerOpen} onOpenChange={onClose}>
      <DrawerContent className="p-4 mx-auto rounded-none h-full">
        <DrawerHeader>
          <DrawerTitle>{account.account_name || "Unnamed Account"}</DrawerTitle>
          <DrawerDescription>{account.account_type || "Unknown Type"}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          <div>
            <p className="text-sm font-semibold">Balance</p>
            <p>${account.balance?.toLocaleString() || "0.00"}</p>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
