import { HeaderTransaction } from "./header-transaction";
import { TransactionTable } from "./transaction-table";

export default function Page() {
    return (
        <>
            <HeaderTransaction />

            <TransactionTable />
        </>
    );
}