xport const TYPE_TRANSFER = "transfer";
export const TYPE_BUYSELL = "buysell";

//production
export const Config = {
	appHost : "https://getalby.com/oauth",
	apiHost : "https://api.getalby.com",
	clientId : "qlO4P09vbP",
    clientSecret: "",
	redirectUri : "https://zapdos.albylabs.com/dashboard",
	scope : "account:read%20invoices:read",
	hostName:  "zapdos.albylabs.com"
}

// testing in production with test client
// export const Config = {
// 	appHost : "https://getalby.com/oauth",
// 	apiHost : "https://api.getalby.com",
// 	secondaryApiHost : "https://zapdos-albylabs.vercel.app",
// 	clientId : "alby_internal_client",
//     clientSecret: "zblqaACzgqUmHjLZdfXJ",
// 	redirectUri : "http://localhost:8080/dashboard",
// 	scope : "account:read%20invoices:read",
// 	hostName:  "localhost:8080"
// }
// //Uncomment for testnet
// export const Config = {
// 	appHost : "https://app.regtest.getalby.com/oauth",
// 	apiHost : "https://api.regtest.getalby.com",
// 	clientId : "test_client",
//     clientSecret: "test_secret",
// 	redirectUri : "http://localhost:8080",
//  	scope : "account:read%20invoices:read",
// 	hostName:  "localhost:8080"
// }

//Transaction interface
export interface Transfer {
    identifier: string,
    amount: number,
    payer_name: string,
    type: string,
    comment: string,
    settled_at: string,
    hidden: boolean;
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