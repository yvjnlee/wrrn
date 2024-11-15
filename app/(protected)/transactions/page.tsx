import { getTransactions } from "./actions";
import { HeaderTransaction } from "./header-transaction";
import { TransactionTable } from "./transaction-table";

export default async function TransactionsPage() {
    const transactions = await getTransactions();

    return (
        <>
            <HeaderTransaction />

            <TransactionTable 
                data={transactions}
            />
        </>
    );
}