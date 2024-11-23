import React, { ReactNode, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react"; // Import a trash icon
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface BasicDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  onDelete?: () => void; // Optional delete button handler
  title: string;
  description?: string;
  children?: ReactNode;
  saveLabel?: string;
  cancelLabel?: string;
  deletePosition?: "header" | "footer"; // Position of the delete button
}

export function BasicDrawer({
  isOpen,
  onClose,
  onSave,
  onDelete,
  title,
  description,
  children,
}: BasicDrawerProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for confirmation modal

  const handleDeleteClick = () => {
    setIsConfirmOpen(true); // Open confirmation dialog
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(); // Trigger delete callback
    }
    setIsConfirmOpen(false); // Close confirmation dialog
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-full p-4 rounded-none mx-auto">
          <DrawerHeader className="flex justify-between items-center">
            <div>
              <DrawerTitle>{title}</DrawerTitle>
              {description && <DrawerDescription>{description}</DrawerDescription>}
            </div>
            {onDelete && (
              <Button
                variant="ghost"
                className="p-2"
                onClick={handleDeleteClick} // Open confirmation modal
                title="Delete"
                aria-label="Delete"
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            )}
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

      {/* Confirmation Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="destructive"
              onClick={handleConfirmDelete} // Confirm deletion
              className="py-1 px-3 text-sm"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsConfirmOpen(false)} // Cancel deletion
              className="py-1 px-3 text-sm"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
