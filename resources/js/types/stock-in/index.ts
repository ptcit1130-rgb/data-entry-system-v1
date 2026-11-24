export type StockIn = {
    id: number;
    uuid: string;
    transaction_number: number;
    source: string;
    transaction_type_in: string;
    recieved: string;
    remarks: "Completed" | "Incompleted";
    status: "Active" | "Inactive";
}