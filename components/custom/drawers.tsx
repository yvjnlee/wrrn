import React, { ReactNode } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface BasicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  saveLabel?: string;
  cancelLabel?: string;
}

export function BasicDrawer({
  isOpen,
  onClose,
  onSave,
  title,
  description,
  children,
}: BasicDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-full p-4 rounded-none mx-auto">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>

        {children && <div className="p-4 overflow-y-auto">{children}</div>}

        <DrawerFooter className="flex gap-2 justify-end">
          {onSave && (
            <Button
              onClick={onSave}
              className="py-1 px-3 text-sm" // Smaller padding and font size
            >
              Save
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="py-1 px-3 text-sm" // Match size with Save button
          >
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
