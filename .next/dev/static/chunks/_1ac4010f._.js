(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/api-client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "acceptConnection",
    ()=>acceptConnection,
    "addExpense",
    ()=>addExpense,
    "addIncome",
    ()=>addIncome,
    "apiCall",
    ()=>apiCall,
    "deleteTransaction",
    ()=>deleteTransaction,
    "getAcceptedConnections",
    ()=>getAcceptedConnections,
    "getAuthUsers",
    ()=>getAuthUsers,
    "getConnectionBetweenUsers",
    ()=>getConnectionBetweenUsers,
    "getConnections",
    ()=>getConnections,
    "getDashboard",
    ()=>getDashboard,
    "getMarketInsights",
    ()=>getMarketInsights,
    "getMarketPriceHistory",
    ()=>getMarketPriceHistory,
    "getMarketProduct",
    ()=>getMarketProduct,
    "getMarketProfitability",
    ()=>getMarketProfitability,
    "getMarketRankings",
    ()=>getMarketRankings,
    "getMarketRisk",
    ()=>getMarketRisk,
    "getNetwork",
    ()=>getNetwork,
    "getNimAi",
    ()=>getNimAi,
    "getPendingConnections",
    ()=>getPendingConnections,
    "getProfile",
    ()=>getProfile,
    "getPublicProfiles",
    ()=>getPublicProfiles,
    "getTransactions",
    ()=>getTransactions,
    "login",
    ()=>login,
    "register",
    ()=>register,
    "rejectConnection",
    ()=>rejectConnection,
    "sendConnectionRequest",
    ()=>sendConnectionRequest,
    "upsertProfile",
    ()=>upsertProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE = ("TURBOPACK compile-time value", "") || "";
function getAuthHeaders() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const token = localStorage.getItem("token");
    return token ? {
        Authorization: `Bearer ${token}`
    } : {};
}
async function apiCall(path, method = "GET", body) {
    const headers = {
        "Content-Type": "application/json",
        ...getAuthHeaders()
    };
    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                error: "Error"
            }));
        const details = Array.isArray(error.fieldErrors) ? ": " + error.fieldErrors.map((fe)=>`${fe.field} ${fe.message}`).join(", ") : "";
        throw new Error((error.error || "Error") + details);
    }
    const ct = response.headers.get("Content-Type") || "";
    if (response.status === 204) return undefined;
    if (ct.includes("application/json")) return response.json();
    const text = await response.text();
    return text;
}
async function login(email, password) {
    return apiCall("/api/auth/login", "POST", {
        email: email.trim(),
        password: password.trim()
    });
}
async function register(email, password, username) {
    return apiCall("/api/auth/register", "POST", {
        email: email.trim(),
        password: password.trim(),
        username: username.trim()
    });
}
async function addIncome(payload) {
    return apiCall("/api/finance/incomes", "POST", payload);
}
async function addExpense(payload) {
    return apiCall("/api/finance/expenses", "POST", payload);
}
async function getDashboard(userEmail, year, month) {
    const params = new URLSearchParams({
        userEmail,
        year: String(year),
        month: String(month)
    });
    return apiCall(`/api/finance/dashboard?${params}`, "GET");
}
async function getTransactions(userEmail) {
    const params = new URLSearchParams({
        userEmail
    });
    return apiCall(`/api/finance/transactions?${params}`, "GET");
}
async function getNimAi(userEmail, year, month) {
    const params = new URLSearchParams({
        userEmail,
        year: String(year),
        month: String(month)
    });
    return apiCall(`/api/finance/nimai?${params}`, "GET");
}
async function getMarketProduct(productId, platform) {
    const params = new URLSearchParams({
        platform
    });
    return apiCall(`/api/market/product/${encodeURIComponent(productId)}/overview?${params}`, "GET");
}
async function getMarketPriceHistory(productId, platform, days = 90) {
    const params = new URLSearchParams({
        platform,
        days: String(days)
    });
    return apiCall(`/api/market/product/${encodeURIComponent(productId)}/price-history?${params}`, "GET");
}
async function getMarketRisk(productId, platform) {
    const params = new URLSearchParams({
        platform
    });
    return apiCall(`/api/market/product/${encodeURIComponent(productId)}/risk?${params}`, "GET");
}
async function getMarketProfitability(productId, platform, cost) {
    const params = new URLSearchParams({
        platform
    });
    if (cost) params.append("cost", cost);
    return apiCall(`/api/market/product/${encodeURIComponent(productId)}/profitability?${params}`, "GET");
}
async function getMarketInsights(productId, platform, cost) {
    const params = new URLSearchParams({
        platform
    });
    if (cost) params.append("cost", cost);
    return apiCall(`/api/market/product/${encodeURIComponent(productId)}/insights?${params}`, "GET");
}
async function getMarketRankings(platform) {
    const params = new URLSearchParams();
    if (platform) params.append("platform", platform);
    return apiCall(`/api/market/rankings?${params}`, "GET");
}
async function getProfile() {
    const userEmail = (("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("userEmail") : "TURBOPACK unreachable") || "";
    const params = new URLSearchParams();
    if (userEmail) params.append("userEmail", userEmail);
    const url = params.toString() ? `/api/networking/profile?${params}` : `/api/networking/profile`;
    return apiCall(url, "GET");
}
async function upsertProfile(payload) {
    const userEmail = (("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("userEmail") : "TURBOPACK unreachable") || "";
    const body = {
        bio: payload.bio || "",
        userEmail
    };
    return apiCall(`/api/networking/profile`, "POST", body);
}
async function getPublicProfiles() {
    return apiCall(`/api/networking/profiles`, "GET");
}
async function getAuthUsers(page = 1, perPage = 50) {
    const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage)
    });
    return apiCall(`/api/auth/users?${params}`, "GET");
}
async function sendConnectionRequest(addresseeId, message) {
    const requesterEmail = (("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("userEmail") : "TURBOPACK unreachable") || "";
    return apiCall(`/api/networking/connections`, "POST", {
        addresseeId,
        message,
        requesterEmail
    });
}
async function acceptConnection(connectionId) {
    return apiCall(`/api/networking/connections/${encodeURIComponent(connectionId)}/accept`, "PUT");
}
async function rejectConnection(connectionId) {
    return apiCall(`/api/networking/connections/${encodeURIComponent(connectionId)}/reject`, "PUT");
}
async function getConnections() {
    const userEmail = (("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("userEmail") : "TURBOPACK unreachable") || "";
    const params = new URLSearchParams();
    if (userEmail) params.append("userEmail", userEmail);
    const url = params.toString() ? `/api/networking/connections?${params}` : `/api/networking/connections`;
    return apiCall(url, "GET");
}
async function getPendingConnections() {
    const userEmail = (("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("userEmail") : "TURBOPACK unreachable") || "";
    const params = new URLSearchParams();
    if (userEmail) params.append("userEmail", userEmail);
    const url = params.toString() ? `/api/networking/connections/pending?${params}` : `/api/networking/connections/pending`;
    return apiCall(url, "GET");
}
async function getAcceptedConnections() {
    const userEmail = (("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("userEmail") : "TURBOPACK unreachable") || "";
    const params = new URLSearchParams();
    if (userEmail) params.append("userEmail", userEmail);
    const url = params.toString() ? `/api/networking/connections/accepted?${params}` : `/api/networking/connections/accepted`;
    return apiCall(url, "GET");
}
async function getNetwork() {
    const userEmail = (("TURBOPACK compile-time truthy", 1) ? localStorage.getItem("userEmail") : "TURBOPACK unreachable") || "";
    const params = new URLSearchParams();
    if (userEmail) params.append("userEmail", userEmail);
    const url = params.toString() ? `/api/networking/network?${params}` : `/api/networking/network`;
    return apiCall(url, "GET");
}
async function getConnectionBetweenUsers(userId1, userId2) {
    return apiCall(`/api/networking/connections/${encodeURIComponent(userId1)}/${encodeURIComponent(userId2)}`, "GET");
}
async function deleteTransaction(id, kind) {
    const params = new URLSearchParams({
        kind
    });
    return apiCall(`/api/finance/transactions/${encodeURIComponent(id)}?${params}`, "DELETE");
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(protected)/finance/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FinanceDashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function FinanceDashboardPage() {
    _s();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [transactions, setTransactions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userEmail, setUserEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const now = new Date();
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(now.getMonth() + 1);
    const [year, setYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(now.getFullYear());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FinanceDashboardPage.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const email = localStorage.getItem("userEmail") || "user@example.com";
                setUserEmail(email);
            }
        }
    }["FinanceDashboardPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FinanceDashboardPage.useEffect": ()=>{
            if (!userEmail) return;
            async function loadDashboard() {
                setLoading(true);
                setError(null);
                try {
                    const [dash, txs] = await Promise.all([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDashboard"])(userEmail, year, month),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTransactions"])(userEmail)
                    ]);
                    setData(dash);
                    setTransactions(txs);
                } catch (err) {
                    setError(err.message);
                } finally{
                    setLoading(false);
                }
            }
            loadDashboard();
        }
    }["FinanceDashboardPage.useEffect"], [
        userEmail,
        year,
        month
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 md:p-8 flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "inline-block animate-spin mb-4",
                        children: "⏳"
                    }, void 0, false, {
                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Cargando dashboard..."
                    }, void 0, false, {
                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, this);
    }
    const asNum = (v)=>typeof v === "string" ? Number.parseFloat(v) : typeof v === "number" ? v : 0;
    const totalIncome = asNum(data?.income);
    const totalExpenses = asNum(data?.expense);
    const balance = asNum(data?.balance ?? totalIncome - totalExpenses);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 md:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "prose-title mb-2",
                    children: "Dashboard Financiero"
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "prose-subtitle mb-8",
                    children: "Visualiza tu situación financiera"
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                    lineNumber: 75,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-4 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: month,
                            onChange: (e)=>setMonth(Number.parseInt(e.target.value)),
                            className: "input-field",
                            children: Array.from({
                                length: 12
                            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: i + 1,
                                    children: new Date(2024, i).toLocaleString("es", {
                                        month: "long"
                                    })
                                }, i + 1, false, {
                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                    lineNumber: 84,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                            value: year,
                            onChange: (e)=>setYear(Number.parseInt(e.target.value)),
                            className: "input-field",
                            children: Array.from({
                                length: 5
                            }, (_, i)=>{
                                const y = new Date().getFullYear() - 2 + i;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: y,
                                    children: y
                                }, y, false, {
                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid md:grid-cols-3 gap-6 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-card rounded-lg p-6 border border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground mb-1",
                                    children: "Ingresos"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-3xl font-bold text-green-600",
                                    children: [
                                        "$",
                                        totalIncome.toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-card rounded-lg p-6 border border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground mb-1",
                                    children: "Gastos"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-3xl font-bold text-red-600",
                                    children: [
                                        "$",
                                        totalExpenses.toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-card rounded-lg p-6 border border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground mb-1",
                                    children: "Balance"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                    lineNumber: 112,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-3xl font-bold ${balance >= 0 ? "text-primary" : "text-destructive"}`,
                                    children: [
                                        "$",
                                        balance.toFixed(2)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-card rounded-lg border border-border overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-4 border-b border-border",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-semibold text-foreground",
                                children: "Transacciones Recientes"
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                            lineNumber: 121,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        className: "bg-muted",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                    children: "Fecha"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                    lineNumber: 128,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                    children: "Descripción"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                    lineNumber: 129,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                    children: "Cantidad"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                    lineNumber: 130,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                    children: "Tipo"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                    children: "Acciones"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                            lineNumber: 127,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                        lineNumber: 126,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-border",
                                        children: transactions && transactions.length > 0 ? transactions.map((tx, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                className: "hover:bg-muted/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-3 text-sm text-foreground",
                                                        children: tx.date
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-3 text-sm text-foreground",
                                                        children: tx.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                        lineNumber: 140,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-3 text-sm font-medium",
                                                        children: [
                                                            "$",
                                                            (typeof tx.amount === "string" ? Number.parseFloat(tx.amount) : tx.amount).toFixed(2)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                        lineNumber: 141,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-3 text-sm",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-2 py-1 rounded text-xs font-medium ${tx.kind === "ingreso" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`,
                                                            children: tx.kind === "ingreso" ? "Ingreso" : tx.kind === "microgasto" ? "Microgasto" : "Gasto"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                            lineNumber: 143,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                        lineNumber: 142,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-6 py-3 text-sm",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "btn-primary bg-destructive text-white px-3 py-1 rounded",
                                                            onClick: async ()=>{
                                                                try {
                                                                    setLoading(true);
                                                                    setError(null);
                                                                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteTransaction"])(tx.id, tx.kind);
                                                                    const [dash, txs] = await Promise.all([
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDashboard"])(userEmail, year, month),
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTransactions"])(userEmail)
                                                                    ]);
                                                                    setData(dash);
                                                                    setTransactions(txs);
                                                                } catch (err) {
                                                                    setError(err.message);
                                                                } finally{
                                                                    setLoading(false);
                                                                }
                                                            },
                                                            children: "Eliminar"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                            lineNumber: 152,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                        lineNumber: 151,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, idx, true, {
                                                fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                lineNumber: 138,
                                                columnNumber: 21
                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                colSpan: 5,
                                                className: "px-6 py-8 text-center text-muted-foreground",
                                                children: "No hay transacciones para mostrar"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                                lineNumber: 179,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                            lineNumber: 178,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                                lineNumber: 125,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(protected)/finance/dashboard/page.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(FinanceDashboardPage, "KgBaXf6r4t2nZ4n341RFgLOSPSU=");
_c = FinanceDashboardPage;
var _c;
__turbopack_context__.k.register(_c, "FinanceDashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_1ac4010f._.js.map