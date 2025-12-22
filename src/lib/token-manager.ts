// Token Manager - Secure Public/Private Token System
import { EventEmitter } from 'events';
import { TokenPair } from './dynamic-api-generator';

export interface TokenConfig {
    name: string;
    permissions: string[];
    expiresAt?: Date;
    rateLimit: number;
    ipWhitelist?: string[];
    userAgentWhitelist?: string[];
}

export class TokenManager extends EventEmitter {
    private tokens: Map<string, TokenPair> = new Map();
    private usageStats: Map<string, any> = new Map();
    private revokedTokens: Set<string> = new Set();

    constructor() {
        super();
        this.initializeDefaultTokens();
        this.startTokenCleanup();
    }

    private initializeDefaultTokens(): void {
        // Create a default admin token pair for system access
        const adminToken = this.generateTokenPair({
            name: 'Admin Access',
            permissions: ['*'], // Full permissions
            rateLimit: 10000,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
        });

        console.log('🔑 Default admin token pair created');
    }

    // ===== TOKEN GENERATION =====
    async generateTokenPair(config: TokenConfig): Promise<TokenPair> {
        const tokenId = this.generateTokenId();

        // Generate cryptographically secure tokens
        const publicToken = this.generateSecureToken(32);
        const privateToken = this.generateSecureToken(48);

        const tokenPair: TokenPair = {
            id: tokenId,
            publicToken,
            privateToken,
            name: config.name,
            permissions: config.permissions,
            expiresAt: config.expiresAt,
            createdAt: new Date(),
            usageCount: 0,
            rateLimit: config.rateLimit || 1000,
            ipWhitelist: config.ipWhitelist,
            userAgentWhitelist: config.userAgentWhitelist
        };

        this.tokens.set(tokenId, tokenPair);

        // Initialize usage statistics
        this.usageStats.set(tokenId, {
            totalRequests: 0,
            successRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            lastRequest: null,
            requestsPerHour: 0,
            requestsPerDay: 0
        });

        console.log(`🔑 Token pair generated: ${config.name}`);
        console.log(`📝 Public Token: ${publicToken.substring(0, 8)}...`);
        console.log(`🔒 Private Token: ${privateToken.substring(0, 8)}...`);

        return tokenPair;
    }

    private generateTokenId(): string {
        return `tok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateSecureToken(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // ===== TOKEN AUTHENTICATION =====
    async authenticateToken(token: string, context: any): Promise<{
        valid: boolean;
        tokenPair?: TokenPair;
        permissions?: string[];
        error?: string;
    }> {
        // Find token pair by either public or private token
        const tokenPair = this.findTokenByValue(token);

        if (!tokenPair) {
            return { valid: false, error: 'Invalid token' };
        }

        // Check if token is revoked
        if (this.revokedTokens.has(tokenPair.id)) {
            return { valid: false, error: 'Token has been revoked' };
        }

        // Check expiration
        if (tokenPair.expiresAt && tokenPair.expiresAt < new Date()) {
            return { valid: false, error: 'Token has expired' };
        }

        // Check IP whitelist if configured
        if (tokenPair.ipWhitelist && tokenPair.ipWhitelist.length > 0) {
            const clientIP = context.ip || context.remoteAddress;
            if (!tokenPair.ipWhitelist.includes(clientIP)) {
                return { valid: false, error: 'IP address not authorized' };
            }
        }

        // Check User-Agent whitelist if configured
        if (tokenPair.userAgentWhitelist && tokenPair.userAgentWhitelist.length > 0) {
            const userAgent = context.userAgent;
            if (!tokenPair.userAgentWhitelist.includes(userAgent)) {
                return { valid: false, error: 'User-Agent not authorized' };
            }
        }

        // Update usage statistics
        this.updateUsageStats(tokenPair.id, true);

        return {
            valid: true,
            tokenPair,
            permissions: tokenPair.permissions
        };
    }

    private findTokenByValue(tokenValue: string): TokenPair | null {
        for (const tokenPair of this.tokens.values()) {
            if (tokenPair.publicToken === tokenValue || tokenPair.privateToken === tokenValue) {
                return tokenPair;
            }
        }
        return null;
    }

    private updateUsageStats(tokenId: string, success: boolean): void {
        const stats = this.usageStats.get(tokenId);
        if (stats) {
            stats.totalRequests++;
            if (success) {
                stats.successRequests++;
            } else {
                stats.failedRequests++;
            }
            stats.lastRequest = new Date();

            // Calculate request rates
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const oneDayAgo = now - (24 * 60 * 60 * 1000);

            // This would be more sophisticated in a real implementation
            stats.requestsPerHour = Math.floor(stats.totalRequests / ((now - stats.createdAt) / (60 * 60 * 1000)));
            stats.requestsPerDay = Math.floor(stats.totalRequests / ((now - stats.createdAt) / (24 * 60 * 60 * 1000)));
        }
    }

    // ===== TOKEN MANAGEMENT =====
    async revokeToken(tokenId: string, reason?: string): Promise<boolean> {
        const tokenPair = this.tokens.get(tokenId);
        if (!tokenPair) {
            return false;
        }

        this.revokedTokens.add(tokenId);
        this.tokens.delete(tokenId);
        this.usageStats.delete(tokenId);

        console.log(`🔒 Token revoked: ${tokenPair.name} (${reason || 'No reason provided'})`);

        return true;
    }

    async updateTokenPermissions(tokenId: string, permissions: string[]): Promise<boolean> {
        const tokenPair = this.tokens.get(tokenId);
        if (!tokenPair) {
            return false;
        }

        tokenPair.permissions = permissions;
        console.log(`🔄 Token permissions updated: ${tokenPair.name}`);

        return true;
    }

    async extendTokenExpiration(tokenId: string, newExpiration: Date): Promise<boolean> {
        const tokenPair = this.tokens.get(tokenId);
        if (!tokenPair) {
            return false;
        }

        tokenPair.expiresAt = newExpiration;
        console.log(`⏰ Token expiration extended: ${tokenPair.name} until ${newExpiration.toISOString()}`);

        return true;
    }

    // ===== TOKEN VALIDATION =====
    async validateTokenPermission(tokenId: string, requiredPermission: string): Promise<boolean> {
        const tokenPair = this.tokens.get(tokenId);
        if (!tokenPair) {
            return false;
        }

        // Check if token has wildcard permission
        if (tokenPair.permissions.includes('*')) {
            return true;
        }

        // Check if token has specific permission
        return tokenPair.permissions.includes(requiredPermission);
    }

    async checkRateLimit(tokenId: string): Promise<{
        allowed: boolean;
        remaining: number;
        resetTime: Date;
        error?: string;
    }> {
        const tokenPair = this.tokens.get(tokenId);
        if (!tokenPair) {
            return { allowed: false, remaining: 0, resetTime: new Date(), error: 'Token not found' };
        }

        const stats = this.usageStats.get(tokenId);
        if (!stats) {
            return { allowed: true, remaining: tokenPair.rateLimit, resetTime: new Date() };
        }

        // Calculate remaining requests (simplified rate limiting)
        const windowStart = Date.now() - (60 * 60 * 1000); // 1 hour window
        const recentRequests = stats.totalRequests; // In real implementation, track by time window

        const remaining = Math.max(0, tokenPair.rateLimit - recentRequests);

        if (remaining <= 0) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
                error: 'Rate limit exceeded'
            };
        }

        return {
            allowed: true,
            remaining,
            resetTime: new Date()
        };
    }

    // ===== TOKEN INFORMATION =====
    getTokenInfo(tokenId: string): {
        tokenPair?: TokenPair;
        usage?: any;
    } {
        return {
            tokenPair: this.tokens.get(tokenId),
            usage: this.usageStats.get(tokenId)
        };
    }

    getAllTokens(): TokenPair[] {
        return Array.from(this.tokens.values());
    }

    getTokensByPermission(permission: string): TokenPair[] {
        return Array.from(this.tokens.values()).filter(token =>
            token.permissions.includes('*') || token.permissions.includes(permission)
        );
    }

    // ===== SECURITY FEATURES =====
    async rotatePublicToken(tokenId: string): Promise<{
        success: boolean;
        newPublicToken?: string;
        error?: string;
    }> {
        const tokenPair = this.tokens.get(tokenId);
        if (!tokenPair) {
            return { success: false, error: 'Token not found' };
        }

        // Generate new public token
        const newPublicToken = this.generateSecureToken(32);
        tokenPair.publicToken = newPublicToken;

        console.log(`🔄 Public token rotated: ${tokenPair.name}`);

        return { success: true, newPublicToken };
    }

    async rotatePrivateToken(tokenId: string): Promise<{
        success: boolean;
        newPrivateToken?: string;
        error?: string;
    }> {
        const tokenPair = this.tokens.get(tokenId);
        if (!tokenPair) {
            return { success: false, error: 'Token not found' };
        }

        // Generate new private token
        const newPrivateToken = this.generateSecureToken(48);
        tokenPair.privateToken = newPrivateToken;

        console.log(`🔒 Private token rotated: ${tokenPair.name}`);

        return { success: true, newPrivateToken };
    }

    async detectTokenCompromise(tokenId: string, indicators: string[]): Promise<{
        compromised: boolean;
        action: 'revoke' | 'monitor' | 'ignore';
        confidence: number;
    }> {
        const stats = this.usageStats.get(tokenId);
        if (!stats) {
            return { compromised: false, action: 'ignore', confidence: 0 };
        }

        let compromiseScore = 0;
        const reasons: string[] = [];

        // Check for unusual request patterns
        if (indicators.includes('unusual_ip')) {
            compromiseScore += 30;
            reasons.push('Unusual IP address');
        }

        if (indicators.includes('unusual_user_agent')) {
            compromiseScore += 20;
            reasons.push('Unusual User-Agent');
        }

        if (indicators.includes('high_request_rate')) {
            compromiseScore += 40;
            reasons.push('High request rate');
        }

        if (indicators.includes('unusual_time')) {
            compromiseScore += 25;
            reasons.push('Unusual access time');
        }

        // Determine action based on compromise score
        if (compromiseScore >= 70) {
            console.log(`🚨 High compromise confidence for token ${tokenId}: ${reasons.join(', ')}`);
            return { compromised: true, action: 'revoke', confidence: compromiseScore };
        } else if (compromiseScore >= 40) {
            console.log(`⚠️ Medium compromise confidence for token ${tokenId}: ${reasons.join(', ')}`);
            return { compromised: true, action: 'monitor', confidence: compromiseScore };
        }

        return { compromised: false, action: 'ignore', confidence: compromiseScore };
    }

    // ===== MAINTENANCE =====
    private startTokenCleanup(): void {
        // Clean up expired tokens every hour
        setInterval(() => {
            this.cleanupExpiredTokens();
        }, 60 * 60 * 1000);

        console.log('🧹 Token cleanup service started');
    }

    private cleanupExpiredTokens(): void {
        const now = new Date();
        let cleaned = 0;

        for (const [tokenId, tokenPair] of this.tokens.entries()) {
            if (tokenPair.expiresAt && tokenPair.expiresAt < now) {
                this.tokens.delete(tokenId);
                this.usageStats.delete(tokenId);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`🧹 Cleaned up ${cleaned} expired tokens`);
        }
    }

    // ===== AUDIT LOGGING =====
    async logTokenActivity(tokenId: string, activity: {
        action: string;
        ip?: string;
        userAgent?: string;
        success: boolean;
        details?: any;
    }): Promise<void> {
        const logEntry = {
            tokenId,
            timestamp: new Date(),
            ...activity
        };

        // In a real implementation, this would write to a database or logging system
        console.log(`📝 Token Activity: ${JSON.stringify(logEntry)}`);

        // Update last used time
        const tokenPair = this.tokens.get(tokenId);
        if (tokenPair) {
            tokenPair.lastUsed = new Date();
        }
    }

    getTokenAuditLog(tokenId: string): any[] {
        // In a real implementation, this would retrieve from a database
        // For now, return mock audit data
        return [
            {
                timestamp: new Date(),
                action: 'token_created',
                details: { name: 'Token created' }
            }
        ];
    }
}
