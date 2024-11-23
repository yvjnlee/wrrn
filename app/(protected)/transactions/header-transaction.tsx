import React from "react";
import { SubHeader } from "@/components/custom/headers";
import { UploadCsv } from "./upload-csv";
import { CreateTransactionButton } from "./create-transaction";

export function HeaderTransaction() {
    return (
        <SubHeader 
            title="Transactions"
            actions={
                <>
                    <CreateTransactionButton />
                    <UploadCsv />
                </>
            }
        />
    );
}