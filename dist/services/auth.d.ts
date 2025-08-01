interface AuthToken {
    accessToken: string;
    walletAddress: string;
    role: string;
    expiresAt: number;
}
declare class AuthService {
    private tokens;
    private baseURL;
    constructor();
    setToken(discordUserId: string, token: AuthToken): void;
    getToken(discordUserId: string): AuthToken | null;
    removeToken(discordUserId: string): void;
    isAuthenticated(discordUserId: string): boolean;
    getAuthHeader(discordUserId: string): string | null;
    login(discordUserId: string, apiKey: string): Promise<boolean>;
    refreshToken(discordUserId: string): Promise<boolean>;
    logout(discordUserId: string): void;
    getAuthenticatedUsers(): string[];
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=auth.d.ts.map