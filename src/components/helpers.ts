export const TYPE_TRANSFER = "transfer";
export const TYPE_BUYSELL = "buysell";

//Transaction interface
export interface Transfer {
    id: number,
    amount: number,
    payer_name: string,
    type: string,
    comment: string,
    settled_at: string,
}

export type BuySellKey = 'buy' | 'sell'

export interface BuySellTransaction {
    id: number,
    type: 'buysell',
    amount: number,
    action: BuySellKey,
    actor_pk: string,
    actor: string,
    target_pk: string
}