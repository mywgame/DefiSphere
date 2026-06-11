export type AdminUser = {
    id: string;
    email: string;
    name: string;
    joined: string;
    balance: number;
    staked: number;
    kyc: "Verified" | "Pending" | "Rejected";
    status: "Active" | "Suspended";
};

export type AdminTx = {
    id: string;
    user: string;
    type: "Deposit" | "Withdrawal" | "Staking" | "Reward Claim";
    amount: number;
    asset: "USDT" | "DFX" | "ETH" | "BTC";
    status: "Pending" | "Approved" | "Rejected" | "Completed";
    date: string;
    hash: string;
};

export type AdminPlan = {
    id: string;
    name: string;
    dpy: number;
    minStake: number;
    lockDays: number;
    active: boolean;
};

export type SiteSettings = {
    siteName: string;
    supportEmail: string;
    depositsEnabled: boolean;
    withdrawalsEnabled: boolean;
    signupsEnabled: boolean;
    maintenanceMode: boolean;
    referralPct: number;
    announcement: string;
};

let users: AdminUser[] = [
    { id: "u1", email: "alex.eth@defisphere.io", name: "Alex Stone", joined: "2026-03-12", balance: 24819.42, staked: 15000, kyc: "Verified", status: "Active" },
    { id: "u2", email: "neha.crypto@defisphere.io", name: "Neha Verma", joined: "2026-04-02", balance: 5320.10, staked: 5000, kyc: "Verified", status: "Active" },
    { id: "u3", email: "kim.h@defisphere.io", name: "Kim Hyun", joined: "2026-04-22", balance: 942.55, staked: 0, kyc: "Pending", status: "Active" },
    { id: "u4", email: "diego.ramos@defisphere.io", name: "Diego Ramos", joined: "2026-05-01", balance: 12120.00, staked: 8000, kyc: "Verified", status: "Suspended" },
    { id: "u5", email: "tomi.dev@defisphere.io", name: "Tomi K.", joined: "2026-05-12", balance: 75.00, staked: 0, kyc: "Rejected", status: "Active" },
    { id: "u6", email: "sara.li@defisphere.io", name: "Sara Li", joined: "2026-05-20", balance: 3199.00, staked: 2500, kyc: "Verified", status: "Active" },
];

let txs: AdminTx[] = [
    { id: "tx1", user: "alex.eth@defisphere.io", type: "Withdrawal", amount: 800, asset: "USDT", status: "Pending", date: "2026-06-08 11:30", hash: "0x33ee…bb71" },
    { id: "tx2", user: "neha.crypto@defisphere.io", type: "Deposit", amount: 5000, asset: "USDT", status: "Completed", date: "2026-06-08 09:21", hash: "0x9a2c…f4b1" },
    { id: "tx3", user: "kim.h@defisphere.io", type: "Withdrawal", amount: 220, asset: "USDT", status: "Pending", date: "2026-06-08 08:02", hash: "0xaabc…9911" },
    { id: "tx4", user: "diego.ramos@defisphere.io", type: "Staking", amount: 2500, asset: "USDT", status: "Completed", date: "2026-06-07 14:25", hash: "0x12bd…77ee" },
    { id: "tx5", user: "sara.li@defisphere.io", type: "Reward Claim", amount: 184.22, asset: "DFX", status: "Completed", date: "2026-06-07 09:11", hash: "0x55aa…11dd" },
    { id: "tx6", user: "tomi.dev@defisphere.io", type: "Deposit", amount: 75, asset: "USDT", status: "Rejected", date: "2026-06-06 22:45", hash: "0x88ff…22cd" },
];

let plans: AdminPlan[] = [
    { id: "pl1", name: "Quantum Yield Pro", dpy: 1.42, minStake: 1000, lockDays: 180, active: true },
    { id: "pl2", name: "Nebula Stable Vault", dpy: 0.62, minStake: 100, lockDays: 90, active: true },
    { id: "pl3", name: "Stellar Boost 90d", dpy: 0.91, minStake: 500, lockDays: 90, active: true },
    { id: "pl4", name: "Legacy Pulse", dpy: 0.45, minStake: 50, lockDays: 30, active: false },
];

let settings: SiteSettings = {
    siteName: "DefiSphere",
    supportEmail: "support@defisphere.io",
    depositsEnabled: true,
    withdrawalsEnabled: true,
    signupsEnabled: true,
    maintenanceMode: false,
    referralPct: 8,
    announcement: "Stake before Friday and get +0.25% DPY for 30 days.",
};

const subscribers = new Set<() => void>();
const notify = () => subscribers.forEach((fn) => fn());

export const adminStore = {
    subscribe(fn: () => void) {
        subscribers.add(fn);
        return () => subscribers.delete(fn);
    },
    getUsers: () => users,
    getTxs: () => txs,
    getPlans: () => plans,
    getSettings: () => settings,

    setUserStatus(id: string, status: AdminUser["status"]) {
        users = users.map((u) => (u.id === id ? { ...u, status } : u));
        notify();
    },
    setKyc(id: string, kyc: AdminUser["kyc"]) {
        users = users.map((u) => (u.id === id ? { ...u, kyc } : u));
        notify();
    },
    deleteUser(id: string) {
        users = users.filter((u) => u.id !== id);
        notify();
    },
    setTxStatus(id: string, status: AdminTx["status"]) {
        txs = txs.map((t) => (t.id === id ? { ...t, status } : t));
        notify();
    },
    togglePlan(id: string) {
        plans = plans.map((p) => (p.id === id ? { ...p, active: !p.active } : p));
        notify();
    },
    updatePlan(id: string, patch: Partial<AdminPlan>) {
        plans = plans.map((p) => (p.id === id ? { ...p, ...patch } : p));
        notify();
    },
    addPlan(plan: Omit<AdminPlan, "id">) {
        plans = [...plans, { ...plan, id: `pl${Date.now()}` }];
        notify();
    },
    deletePlan(id: string) {
        plans = plans.filter((p) => p.id !== id);
        notify();
    },
    updateSettings(patch: Partial<SiteSettings>) {
        settings = { ...settings, ...patch };
        notify();
    },
};
