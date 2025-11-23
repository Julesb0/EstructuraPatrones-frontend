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
"[project]/app/(protected)/market/rankings/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MarketRankingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function MarketRankingsPage() {
    _s();
    const [rankings, setRankings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [platform, setPlatform] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("mercadolibre");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MarketRankingsPage.useEffect": ()=>{
            async function loadRankings() {
                setLoading(true);
                setError(null);
                try {
                    const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMarketRankings"])(platform);
                    setRankings(data);
                } catch (err) {
                    setError(err.message);
                } finally{
                    setLoading(false);
                }
            }
            loadRankings();
        }
    }["MarketRankingsPage.useEffect"], [
        platform
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 md:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "prose-title mb-2",
                    children: "Rankings de Mercado"
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "prose-subtitle mb-8",
                    children: "Descubre los productos más vendidos"
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                    lineNumber: 42,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-card rounded-lg p-6 border border-border mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-foreground mb-2",
                            children: "Filtrar por plataforma"
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: platform,
                            onChange: (e)=>setPlatform(e.target.value),
                            className: "input-field w-full md:w-64",
                            placeholder: "mercadolibre"
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6",
                    children: [
                        "Error: ",
                        error
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Cargando rankings..."
                    }, void 0, false, {
                        fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                        lineNumber: 63,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-card rounded-lg border border-border overflow-hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                children: "Posición"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                lineNumber: 71,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                children: "Nombre"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                lineNumber: 72,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                children: "Precio Promedio"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                lineNumber: 73,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                children: "Rating"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                lineNumber: 74,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-3 text-left text-sm font-semibold text-foreground",
                                                children: "Ventas"
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                lineNumber: 75,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                        lineNumber: 70,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                    lineNumber: 69,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-border",
                                    children: rankings.length > 0 ? rankings.map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "hover:bg-muted/50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-3",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm",
                                                        children: idx + 1
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                        lineNumber: 83,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                    lineNumber: 82,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-3 text-sm font-medium text-foreground",
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                    lineNumber: 87,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-3 text-sm text-foreground",
                                                    children: [
                                                        "$",
                                                        Number(item.price).toFixed(2)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-3 text-sm",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "flex items-center gap-1",
                                                        children: [
                                                            "⭐ ",
                                                            Number(item.rating).toFixed(1)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                    lineNumber: 89,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-3 text-sm font-semibold text-foreground",
                                                    children: item.sales
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                                    lineNumber: 92,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, item.id, true, {
                                            fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                            lineNumber: 81,
                                            columnNumber: 23
                                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 5,
                                            className: "px-6 py-8 text-center text-muted-foreground",
                                            children: "No hay datos disponibles"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                            lineNumber: 97,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                        lineNumber: 96,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                                    lineNumber: 78,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                            lineNumber: 68,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                        lineNumber: 67,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/market/rankings/page.tsx",
                    lineNumber: 66,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(protected)/market/rankings/page.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(protected)/market/rankings/page.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_s(MarketRankingsPage, "lAUPhvPAidmrNfWOefr19oChno8=");
_c = MarketRankingsPage;
var _c;
__turbopack_context__.k.register(_c, "MarketRankingsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_c5c8de7f._.js.map