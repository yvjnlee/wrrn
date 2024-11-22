import React from "react";
import { SubHeader } from "@/components/custom/headers";
import { UploadCsv } from "./upload-csv";

export function HeaderTransaction() {
    return (
        <SubHeader 
            title="Transactions"
            actions={
                <UploadCsv />
            }
        />
    );
}