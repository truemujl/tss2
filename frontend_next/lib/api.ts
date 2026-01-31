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
}

export interface VPNPlan {
    id: string;
    name: string;
    duration_days: number;
    price: number;
    description: string;
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
