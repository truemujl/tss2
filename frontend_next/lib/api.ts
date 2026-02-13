"use client";

const API_BASE = "/api";

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface UserProfile {
    id: number;
    username: string;
    balance: number;
    status: string;
    keys_count: number;
    is_admin: boolean;
    avatar_url?: string;
    first_name?: string;
    last_name?: string;
}

export interface VPNPlan {
    id: string;
    name: string;
    duration_days: number;
    price: number;
    description: string;
}

export interface AdminStats {
    total_users: number;
    active_subscriptions: number;
    total_revenue: number;
}

export interface SiteConfig {
    bot_welcome_message: string;
    site_title: string;
    site_announcement?: string;
    support_link: string;
}

// Token management
export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

export function setToken(token: string): void {
    localStorage.setItem("token", token);
}

export function clearToken(): void {
    localStorage.removeItem("token");
}

export function isLoggedIn(): boolean {
    return !!getToken();
}

// API helper
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `Request failed: ${response.status}`);
    }

    return response.json();
}

// Auth API
export async function login(username: string, password: string): Promise<AuthResponse> {
    const data = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
    setToken(data.access_token);
    return data;
}

export async function register(username: string, password: string): Promise<{ message: string }> {
    return apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });
}

export function logout(): void {
    clearToken();
    window.location.href = "/";
}

// User API
export async function getProfile(): Promise<UserProfile> {
    return apiRequest("/users/me");
}

// Admin API
export async function getAdminStats(): Promise<AdminStats> {
    return apiRequest("/admin/stats");
}

export async function getAdminUsers(): Promise<UserProfile[]> {
    return apiRequest("/admin/users");
}

export async function getSiteConfig(): Promise<SiteConfig> {
    return apiRequest("/admin/config");
}

export async function updateSiteConfig(config: Partial<SiteConfig>): Promise<{ message: string }> {
    return apiRequest("/admin/config", {
        method: "POST",
        body: JSON.stringify(config),
    });
}

// Shop API
export async function getPlans(): Promise<VPNPlan[]> {
    return apiRequest("/shop/plans");
}

export async function purchasePlan(planId: string): Promise<{ message: string }> {
    return apiRequest("/shop/buy", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId }),
    });
}

export interface VPNKey {
    id: string;
    name: string;
    status: string;
    expires_at: string;
}

export async function getKeys(): Promise<VPNKey[]> {
    return apiRequest("/users/keys");
}

// Payment API
export interface CreatePaymentRequest {
    user_id: number;
    plan_id: string;
    amount: number;
    location: string;
    currency: string;
    source: string;
}

export interface CreatePaymentResponse {
    payment_url: string;
    transaction_id: string;
    amount: number;
}

export interface PaymentStatusResponse {
    status: string; // PENDING | CONFIRMED | CANCELED | FAIL
    plan_id: string;
}

export async function createPayment(
    userId: number,
    planId: string,
    amount: number,
    location: string
): Promise<CreatePaymentResponse> {
    return apiRequest("/payments/create", {
        method: "POST",
        body: JSON.stringify({
            user_id: userId,
            plan_id: planId,
            amount,
            location,
            currency: "RUB",
            source: "web",
        }),
    });
}

export async function checkPaymentStatus(
    transactionId: string
): Promise<PaymentStatusResponse> {
    return apiRequest(`/payments/status/${transactionId}`);
}
