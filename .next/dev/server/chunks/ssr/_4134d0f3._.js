module.exports = [
"[project]/lib/api-client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
const API_BASE = ("TURBOPACK compile-time value", "") || "";
function getAuthHeaders() {
    if ("TURBOPACK compile-time truthy", 1) return {};
    //TURBOPACK unreachable
    ;
    const token = undefined;
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
    const userEmail = (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null) || "";
    const params = new URLSearchParams();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const url = params.toString() ? `/api/networking/profile?${params}` : `/api/networking/profile`;
    return apiCall(url, "GET");
}
async function upsertProfile(payload) {
    const userEmail = (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null) || "";
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
    const requesterEmail = (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null) || "";
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
    const userEmail = (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null) || "";
    const params = new URLSearchParams();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const url = params.toString() ? `/api/networking/connections?${params}` : `/api/networking/connections`;
    return apiCall(url, "GET");
}
async function getPendingConnections() {
    const userEmail = (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null) || "";
    const params = new URLSearchParams();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const url = params.toString() ? `/api/networking/connections/pending?${params}` : `/api/networking/connections/pending`;
    return apiCall(url, "GET");
}
async function getAcceptedConnections() {
    const userEmail = (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null) || "";
    const params = new URLSearchParams();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const url = params.toString() ? `/api/networking/connections/accepted?${params}` : `/api/networking/connections/accepted`;
    return apiCall(url, "GET");
}
async function getNetwork() {
    const userEmail = (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null) || "";
    const params = new URLSearchParams();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
}),
"[project]/app/(protected)/networking/profiles/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NetworkingProfilesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-client.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function NetworkingProfilesPage() {
    const [profiles, setProfiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sendingId, setSendingId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [profilesRes, usersResRaw] = await Promise.all([
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPublicProfiles"])(),
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthUsers"])(1, 100)
                ]);
                const pList = profilesRes || [];
                const uRoot = typeof usersResRaw === "string" ? JSON.parse(usersResRaw) : usersResRaw;
                const uList = Array.isArray(uRoot) ? uRoot : Array.isArray(uRoot?.users) ? uRoot.users : [];
                const merged = [];
                for (const u of uList){
                    const email = u?.email || u?.user?.email || u?.user_metadata?.email;
                    const id = u?.id || u?.user?.id || u?.uid;
                    if (email && id) merged.push({
                        id,
                        userId: email,
                        email
                    });
                }
                for (const p of pList){
                    if (p?.userId) {
                        const existing = merged.find((m)=>m.userId === p.userId);
                        if (!existing) merged.push({
                            id: p.id,
                            userId: p.userId,
                            bio: p.bio,
                            role: p.role
                        });
                        else {
                            existing.bio = p.bio ?? existing.bio;
                            existing.role = p.role ?? existing.role;
                        }
                    }
                }
                setProfiles(merged);
            } catch (e) {
                setError(e.message);
            } finally{
                setLoading(false);
            }
        }
        load();
    }, []);
    async function onConnect(userId) {
        setSendingId(userId);
        setError(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sendConnectionRequest"])(userId);
        } catch (e) {
            setError(e.message);
        } finally{
            setSendingId(null);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-6 md:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "prose-title mb-2",
                    children: "Perfiles Públicos"
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "prose-subtitle mb-6",
                    children: "Explora y conecta con otros usuarios"
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                    lineNumber: 77,
                    columnNumber: 11
                }, this),
                loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-muted-foreground",
                        children: "Cargando perfiles..."
                    }, void 0, false, {
                        fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                        lineNumber: 84,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                    lineNumber: 83,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                    children: profiles.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-muted-foreground",
                        children: "No hay perfiles disponibles"
                    }, void 0, false, {
                        fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                        lineNumber: 89,
                        columnNumber: 15
                    }, this) : profiles.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-card rounded-lg border border-border p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-semibold mb-1",
                                    children: p.email || p.userId
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 19
                                }, this),
                                p.bio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-muted-foreground mb-2",
                                    children: p.bio
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                                    lineNumber: 94,
                                    columnNumber: 29
                                }, this),
                                p.role && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xs text-muted-foreground mb-4",
                                    children: p.role
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                                    lineNumber: 95,
                                    columnNumber: 30
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>onConnect(p.userId),
                                        disabled: sendingId === p.userId,
                                        className: "btn-primary text-sm",
                                        children: sendingId === p.userId ? "Enviando..." : "Conectar"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                                        lineNumber: 97,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                                    lineNumber: 96,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, p.id, true, {
                            fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                            lineNumber: 92,
                            columnNumber: 17
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
                    lineNumber: 87,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
            lineNumber: 72,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(protected)/networking/profiles/page.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_4134d0f3._.js.map