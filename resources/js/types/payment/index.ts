export type PaymentStatuses = "pending" | "proccessing" | "success" | "failed";

export type Payment = {
    id: string;
    amount: number;
    status: PaymentStatuses;
    email: string;
}