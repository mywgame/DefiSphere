export type Pkg = {
    id: string;
    name: string;
    staked: number;
    dpy: number;
    status: "Active" | "Locked" | "Ended";
    start: string;
    expiry: string;
};

export type Tx = {
    id: string;
    type:
    | "Deposit"
    | "Withdrawal"
    | "Staking"
    | "Unstaking"
    | "Reward Claim"
    | "Referral Bonus";
    amount: number;
    asset: "USDT" | "DFX" | "ETH" | "BTC";
    status: "Completed" | "Pending" | "Failed";
    date: string;
    hash: string;
};

export const stats = {
    wallet: 24819.42,
    withdrawable: 1842.55,
    pending: 312.18,
    total: 6920.77,
};

export const activeStake = {
    package: "Quantum Yield Pro",
    staked: 15000,
    dpy: 1.42,
    progress: 64,
    nextRewardInSec: 60 * 60 * 6 + 1820,
};

export const packages: Pkg[] = [
    {
        id: "p1",
        name: "Quantum Yield Pro",
        staked: 15000,
        dpy: 1.42,
        status: "Active",
        start: "2026-04-12",
        expiry: "2026-10-12",
    },
    {
        id: "p2",
        name: "Nebula Stable Vault",
        staked: 5000,
        dpy: 0.62,
        status: "Active",
        start: "2026-05-03",
        expiry: "2026-08-03",
    },
    {
        id: "p3",
        name: "Stellar Boost 90d",
        staked: 2500,
        dpy: 0.91,
        status: "Locked",
        start: "2026-05-20",
        expiry: "2026-08-20",
    },
];

export const transactions: Tx[] = [
    { id: "t1", type: "Deposit", amount: 5000, asset: "USDT", status: "Completed", date: "2026-06-04 14:21", hash: "0x9a2c…f4b1" },
    { id: "t2", type: "Staking", amount: 2500, asset: "USDT", status: "Completed", date: "2026-06-04 14:25", hash: "0x12bd…77ee" },
    { id: "t3", type: "Reward Claim", amount: 184.22, asset: "DFX", status: "Completed", date: "2026-06-03 09:11", hash: "0x55aa…11dd" },
    { id: "t4", type: "Referral Bonus", amount: 42.5, asset: "USDT", status: "Completed", date: "2026-06-02 18:02", hash: "0x77cc…aa90" },
    { id: "t5", type: "Withdrawal", amount: 800, asset: "USDT", status: "Pending", date: "2026-06-02 11:30", hash: "0x33ee…bb71" },
    { id: "t6", type: "Unstaking", amount: 1200, asset: "USDT", status: "Completed", date: "2026-05-30 22:45", hash: "0x88ff…22cd" },
];

export const networks = [
    { id: "trc20", label: "Tron (TRC20)", fee: "1 USDT", min: "10 USDT" },
    { id: "erc20", label: "Ethereum (ERC20)", fee: "8 USDT", min: "20 USDT" },
    { id: "bep20", label: "BNB Chain (BEP20)", fee: "0.5 USDT", min: "10 USDT" },
    { id: "polygon", label: "Polygon (MATIC)", fee: "0.2 USDT", min: "5 USDT" },
];

export const depositAddress = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";
