// Declaraciones de tipos para auth-test
export declare const testConnections: () => Promise<void>;
export declare const testSupabaseRegister: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string; data?: any }>;
export declare const testSupabaseLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string; data?: any }>;