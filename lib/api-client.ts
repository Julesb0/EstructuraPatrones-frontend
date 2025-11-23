const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ""

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiCall<T>(path: string, method = "GET", body?: any): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Error" }))
    const details = Array.isArray(error.fieldErrors)
      ? ": " + error.fieldErrors.map((fe: any) => `${fe.field} ${fe.message}`).join(", ")
      : ""
    throw new Error((error.error || "Error") + details)
  }

  const ct = response.headers.get("Content-Type") || ""
  if (response.status === 204) return undefined as unknown as T
  if (ct.includes("application/json")) return response.json()
  const text = await response.text()
  return text as unknown as T
}

export async function login(email: string, password: string) {
  return apiCall<{ token: string; username: string }>("/api/auth/login", "POST", {
    email: email.trim(),
    password: password.trim(),
  })
}

export async function register(email: string, password: string, username: string) {
  return apiCall("/api/auth/register", "POST", {
    email: email.trim(),
    password: password.trim(),
    username: username.trim(),
  })
}

export async function addIncome(payload: { amount: number; date: string; description: string; userEmail: string }) {
  return apiCall("/api/finance/incomes", "POST", payload)
}

export async function addExpense(payload: {
  amount: number
  type: string
  date: string
  description: string
  recurring: boolean
  userEmail: string
}) {
  return apiCall("/api/finance/expenses", "POST", payload)
}

export async function getDashboard(userEmail: string, year: number, month: number) {
  const params = new URLSearchParams({ userEmail, year: String(year), month: String(month) })
  return apiCall(`/api/finance/dashboard?${params}`, "GET")
}

export async function getTransactions(userEmail: string) {
  const params = new URLSearchParams({ userEmail })
  return apiCall(`/api/finance/transactions?${params}`, "GET")
}

export async function getNimAi(userEmail: string, year: number, month: number) {
  const params = new URLSearchParams({ userEmail, year: String(year), month: String(month) })
  return apiCall(`/api/finance/nimai?${params}`, "GET")
}

export async function getMarketProduct(productId: string, platform: string) {
  const params = new URLSearchParams({ platform })
  return apiCall(`/api/market/product/${encodeURIComponent(productId)}/overview?${params}`, "GET")
}

export async function getMarketPriceHistory(productId: string, platform: string, days = 90) {
  const params = new URLSearchParams({ platform, days: String(days) })
  return apiCall(`/api/market/product/${encodeURIComponent(productId)}/price-history?${params}`, "GET")
}

export async function getMarketRisk(productId: string, platform: string) {
  const params = new URLSearchParams({ platform })
  return apiCall(`/api/market/product/${encodeURIComponent(productId)}/risk?${params}`, "GET")
}

export async function getMarketProfitability(productId: string, platform: string, cost?: string) {
  const params = new URLSearchParams({ platform })
  if (cost) params.append("cost", cost)
  return apiCall(`/api/market/product/${encodeURIComponent(productId)}/profitability?${params}`, "GET")
}

export async function getMarketInsights(productId: string, platform: string, cost?: string) {
  const params = new URLSearchParams({ platform })
  if (cost) params.append("cost", cost)
  return apiCall(`/api/market/product/${encodeURIComponent(productId)}/insights?${params}`, "GET")
}

export async function getMarketRankings(platform?: string) {
  const params = new URLSearchParams()
  if (platform) params.append("platform", platform)
  return apiCall(`/api/market/rankings?${params}`, "GET")
}

export async function getProfile() {
  const userEmail = (typeof window !== "undefined" ? localStorage.getItem("userEmail") : null) || ""
  const params = new URLSearchParams()
  if (userEmail) params.append("userEmail", userEmail)
  const url = params.toString() ? `/api/networking/profile?${params}` : `/api/networking/profile`
  return apiCall(url, "GET")
}

export async function upsertProfile(payload: {
  displayName: string
  bio?: string
  location?: string
  company?: string
  role?: string
  linkedinUrl?: string
  website?: string
  isPublic?: boolean
}) {
  const userEmail = (typeof window !== "undefined" ? localStorage.getItem("userEmail") : null) || ""
  const body = { bio: payload.bio || "", userEmail }
  return apiCall(`/api/networking/profile`, "POST", body)
}

export async function getPublicProfiles() {
  return apiCall(`/api/networking/profiles`, "GET")
}

export async function getAuthUsers(page = 1, perPage = 50) {
  const params = new URLSearchParams({ page: String(page), perPage: String(perPage) })
  return apiCall(`/api/auth/users?${params}`, "GET")
}

export async function sendConnectionRequest(addresseeId: string, message?: string) {
  const requesterEmail = (typeof window !== "undefined" ? localStorage.getItem("userEmail") : null) || ""
  return apiCall(`/api/networking/connections`, "POST", { addresseeId, message, requesterEmail })
}

export async function acceptConnection(connectionId: string) {
  return apiCall(`/api/networking/connections/${encodeURIComponent(connectionId)}/accept`, "PUT")
}

export async function rejectConnection(connectionId: string) {
  return apiCall(`/api/networking/connections/${encodeURIComponent(connectionId)}/reject`, "PUT")
}

export async function getConnections() {
  const userEmail = (typeof window !== "undefined" ? localStorage.getItem("userEmail") : null) || ""
  const params = new URLSearchParams()
  if (userEmail) params.append("userEmail", userEmail)
  const url = params.toString() ? `/api/networking/connections?${params}` : `/api/networking/connections`
  return apiCall(url, "GET")
}

export async function getPendingConnections() {
  const userEmail = (typeof window !== "undefined" ? localStorage.getItem("userEmail") : null) || ""
  const params = new URLSearchParams()
  if (userEmail) params.append("userEmail", userEmail)
  const url = params.toString() ? `/api/networking/connections/pending?${params}` : `/api/networking/connections/pending`
  return apiCall(url, "GET")
}

export async function getAcceptedConnections() {
  const userEmail = (typeof window !== "undefined" ? localStorage.getItem("userEmail") : null) || ""
  const params = new URLSearchParams()
  if (userEmail) params.append("userEmail", userEmail)
  const url = params.toString() ? `/api/networking/connections/accepted?${params}` : `/api/networking/connections/accepted`
  return apiCall(url, "GET")
}

export async function getNetwork() {
  const userEmail = (typeof window !== "undefined" ? localStorage.getItem("userEmail") : null) || ""
  const params = new URLSearchParams()
  if (userEmail) params.append("userEmail", userEmail)
  const url = params.toString() ? `/api/networking/network?${params}` : `/api/networking/network`
  return apiCall(url, "GET")
}

export async function getConnectionBetweenUsers(userId1: string, userId2: string) {
  return apiCall(`/api/networking/connections/${encodeURIComponent(userId1)}/${encodeURIComponent(userId2)}`, "GET")
}

export async function deleteTransaction(id: string, kind: "ingreso" | "gasto" | "microgasto") {
  const params = new URLSearchParams({ kind })
  return apiCall(`/api/finance/transactions/${encodeURIComponent(id)}?${params}`, "DELETE")
}
