import { DbConnection } from "../module_bindings/index.js";

let onAppliedCb: ((ctx: any)=>void) | null = null;
export function onSubscriptionApplied(cb: (ctx:any)=>void) {
    onAppliedCb = cb;
}

export const conn = DbConnection.builder()
    .withUri("https://maincloud.spacetimedb.com")
    .withDatabaseName("webgames-3nk2n")
    .onConnect((ctx) => {
        ctx.subscriptionBuilder()
        .onApplied(() => {
            console.log("Connected.");
            onAppliedCb?.(ctx);
        })
        .subscribe(["SELECT * FROM user", "SELECT * FROM message"])
    })
    .build();