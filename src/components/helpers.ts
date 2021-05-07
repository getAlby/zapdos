export const TYPE_TRANSFER = "transfer";
export const TYPE_BUYSELL = "buysell";

//Transaction interface
export interface Transfer {
    id: number,
    type: 'transfer',
    amount: number,
    from_pk: string,
    from_username: string,
    to_pk: string,
    to_username: string,
    coin: string,
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