// Enhanced MCP Communication Protocol with Remote Server Support
import { EventEmitter } from 'events';

export interface MCPMessage {
    id: string;
    type: 'request' | 'response' | 'notification' | 'command';
    method: string;
    params?: any;
    result?: any;
    error?: any;
    from?: string;
    to?: string;
    priority?: number;
    timestamp?: Date;
}

export interface AIAgent {
    id: string;
    name: string;
    role: string;
    capabilities: string[];
    status: 'active' | 'inactive' | 'busy' | 'online' | 'offline';
    masterId?: string;
    knowledge?: any;
    payload?: any;
}

export interface MCPConnection {
    id: string;
    status: 'connected' | 'disconnected';
    createdAt: Date;
}

export interface MCPServerConfig {
    url: string;
    transport: 'sse' | 'websocket' | 'http';
    headers?: Record<string, string>;
    auth?: {
        type: 'bearer' | 'api-key' | 'basic';
        token?: string;
        username?: string;
        password?: string;
    };
}

export interface RemoteMCPServer {
    name: string;
    config: MCPServerConfig;
    connection?: EventSource | WebSocket;
    status: 'disconnected' | 'connecting' | 'connected' | 'error';
    lastPing?: Date;
}

export class MCPCommunicationProtocol extends EventEmitter {
    private connections: Map<string, MCPConnection> = new Map();
    private messageQueue: MCPMessage[] = [];
    private remoteServers: Map<string, RemoteMCPServer> = new Map();
    private eventSources: Map<string, EventSource> = new Map();
    private webSockets: Map<string, WebSocket> = new Map();

    constructor() {
        super();
        console.log('🔗 Enhanced MCP Communication Protocol initialized');
        this.initializeRemoteServers();
    }

    // ===== REMOTE SERVER CONFIGURATION =====
    private async initializeRemoteServers(): Promise<void> {
        // Configure the stormmcp.ai server
        const stormMcpConfig: MCPServerConfig = {
            url: 'https://stormmcp.ai/gateway/28e95af3-3e3d-474a-a2dc-b1f1b3ca3799/mcp',
            transport: 'sse',
            headers: {
                'X-API-Key': 'ag_tDVti5OwZUKWBWrIlXl8niyepGZktBiGyZlBo/AzXvg=',
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        await this.registerRemoteServer('myapp', stormMcpConfig);

        // Auto-connect to remote servers
        setTimeout(() => {
            this.connectToRemoteServer('myapp').catch(err => {
                console.error('Failed to auto-connect to myapp server:', err);
            });
        }, 1000);
    }

    async registerRemoteServer(name: string, config: MCPServerConfig): Promise<void> {
        const server: RemoteMCPServer = {
            name,
            config,
            status: 'disconnected'
        };

        this.remoteServers.set(name, server);
        console.log(`🌐 Registered remote MCP server: ${name} (${config.url})`);
        this.emit('serverRegistered', { name, config });
    }

    async connectToRemoteServer(serverName: string): Promise<void> {
        const server = this.remoteServers.get(serverName);
        if (!server) {
            throw new Error(`Remote server '${serverName}' not found`);
        }

        try {
            server.status = 'connecting';
            console.log(`🔄 Connecting to remote MCP server: ${serverName}`);

            if (server.config.transport === 'sse') {
                await this.connectSSE(serverName, server.config);
            } else if (server.config.transport === 'websocket') {
                await this.connectWebSocket(serverName, server.config);
            } else if (server.config.transport === 'http') {
                await this.connectHTTP(serverName, server.config);
            }

            server.status = 'connected';
            server.lastPing = new Date();
            console.log(`✅ Connected to remote MCP server: ${serverName}`);
            this.emit('serverConnected', { name: serverName, server });

        } catch (error) {
            server.status = 'error';
            console.error(`❌ Failed to connect to remote MCP server ${serverName}:`, error);
            this.emit('serverError', { name: serverName, error });
            throw error;
        }
    }

    private async connectSSE(serverName: string, config: MCPServerConfig): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const eventSource = new EventSource(config.url, {
                    withCredentials: false
                });

                // Set up event listeners
                eventSource.onopen = () => {
                    console.log(`📡 SSE connection opened to ${serverName}`);
                    this.eventSources.set(serverName, eventSource);
                    resolve();
                };

                eventSource.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        console.log(`📨 Received SSE message from ${serverName}:`, message);
                        this.handleRemoteMessage(serverName, message);
                    } catch (parseError) {
                        console.error(`Failed to parse SSE message from ${serverName}:`, parseError);
                    }
                };

                eventSource.onerror = (error) => {
                    console.error(`SSE connection error for ${serverName}:`, error);
                    eventSource.close();
                    this.eventSources.delete(serverName);
                    reject(error);
                };

                // Add authentication headers if provided
                if (config.headers) {
                    // Note: EventSource doesn't support custom headers directly
                    // This would require a proxy or different approach in a real implementation
                    console.log(`🔐 SSE headers configured for ${serverName}:`, Object.keys(config.headers));
                }

            } catch (error) {
                reject(error);
            }
        });
    }

    private async connectWebSocket(serverName: string, config: MCPServerConfig): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const ws = new WebSocket(config.url);

                ws.onopen = () => {
                    console.log(`🔌 WebSocket connection opened to ${serverName}`);
                    this.webSockets.set(serverName, ws);
                    resolve();
                };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        console.log(`📨 Received WebSocket message from ${serverName}:`, message);
                        this.handleRemoteMessage(serverName, message);
                    } catch (parseError) {
                        console.error(`Failed to parse WebSocket message from ${serverName}:`, parseError);
                    }
                };

                ws.onerror = (error) => {
                    console.error(`WebSocket connection error for ${serverName}:`, error);
                    reject(error);
                };

                ws.onclose = () => {
                    console.log(`🔌 WebSocket connection closed for ${serverName}`);
                    this.webSockets.delete(serverName);
                };

            } catch (error) {
                reject(error);
            }
        });
    }

    private async connectHTTP(serverName: string, config: MCPServerConfig): Promise<void> {
        // HTTP polling implementation
        console.log(`📡 Setting up HTTP polling for ${serverName}`);

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(config.url, {
                    method: 'GET',
                    headers: config.headers || {}
                });

                if (response.ok) {
                    const data = await response.json();
                    this.handleRemoteMessage(serverName, data);
                }
            } catch (error) {
                console.error(`HTTP polling error for ${serverName}:`, error);
            }
        }, 5000); // Poll every 5 seconds

        // Store the interval for cleanup
        this.eventSources.set(serverName, { close: () => clearInterval(pollInterval) } as any);
    }

    // ===== MESSAGE HANDLING =====
    private handleRemoteMessage(serverName: string, message: any): void {
        // Process incoming messages from remote servers
        const mcpMessage: MCPMessage = {
            id: message.id || `remote_${Date.now()}`,
            type: message.type || 'notification',
            method: message.method || 'unknown',
            params: message.params,
            result: message.result,
            error: message.error,
            from: serverName,
            to: 'local',
            timestamp: new Date()
        };

        this.messageQueue.push(mcpMessage);
        this.emit('remoteMessage', { serverName, message: mcpMessage });
    }

    async sendToRemoteServer(serverName: string, message: Partial<MCPMessage>): Promise<void> {
        const server = this.remoteServers.get(serverName);
        if (!server || server.status !== 'connected') {
            throw new Error(`Remote server '${serverName}' is not connected`);
        }

        try {
            const fullMessage = {
                jsonrpc: '2.0',
                id: message.id || `msg_${Date.now()}`,
                method: message.method,
                params: message.params
            };

            if (server.config.transport === 'sse') {
                // SSE is primarily for receiving, so we'll use HTTP POST for sending
                await fetch(server.config.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...server.config.headers
                    },
                    body: JSON.stringify(fullMessage)
                });
            } else if (server.config.transport === 'websocket') {
                const ws = this.webSockets.get(serverName);
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(fullMessage));
                }
            }

            console.log(`📤 Sent message to remote server ${serverName}:`, fullMessage);
            this.emit('messageSent', { serverName, message: fullMessage });

        } catch (error) {
            console.error(`Failed to send message to remote server ${serverName}:`, error);
            throw error;
        }
    }

    // ===== LOCAL CONNECTION METHODS =====
    async connect(config: any): Promise<MCPConnection> {
        const connection: MCPConnection = {
            id: `mcp_${Date.now()}`,
            status: 'connected',
            createdAt: new Date()
        };
        this.connections.set(connection.id, connection);
        this.emit('connected', connection);
        return connection;
    }

    async disconnect(connectionId: string): Promise<boolean> {
        const connection = this.connections.get(connectionId);
        if (!connection) return false;
        connection.status = 'disconnected';
        this.emit('disconnected', connection);
        return true;
    }

    async sendMessage(connectionId: string, message: Partial<MCPMessage>): Promise<MCPMessage> {
        const msg: MCPMessage = {
            id: `msg_${Date.now()}`,
            type: message.type || 'request',
            method: message.method || 'unknown',
            params: message.params
        };
        this.messageQueue.push(msg);
        this.emit('message', msg);
        return msg;
    }

    async receiveMessage(connectionId: string): Promise<MCPMessage | null> {
        return this.messageQueue.shift() || null;
    }

    getConnections(): MCPConnection[] {
        return Array.from(this.connections.values());
    }

    getMessageQueue(): MCPMessage[] {
        return [...this.messageQueue];
    }

    // ===== AGENT MANAGEMENT =====
    private agents: Map<string, AIAgent> = new Map();

    registerAgent(agent: AIAgent): void {
        this.agents.set(agent.id, agent);
        this.emit('agentRegistered', agent);
    }

    getAgents(): AIAgent[] {
        return Array.from(this.agents.values());
    }

    // Flexible sendMessage that accepts just message
    async send(message: Partial<MCPMessage>): Promise<MCPMessage> {
        return this.sendMessage('default', message);
    }

    // ===== REMOTE SERVER MANAGEMENT =====
    getRemoteServers(): RemoteMCPServer[] {
        return Array.from(this.remoteServers.values());
    }

    async disconnectRemoteServer(serverName: string): Promise<void> {
        const server = this.remoteServers.get(serverName);
        if (!server) return;

        // Close SSE connection
        const eventSource = this.eventSources.get(serverName);
        if (eventSource) {
            eventSource.close();
            this.eventSources.delete(serverName);
        }

        // Close WebSocket connection
        const webSocket = this.webSockets.get(serverName);
        if (webSocket) {
            webSocket.close();
            this.webSockets.delete(serverName);
        }

        server.status = 'disconnected';
        console.log(`🔌 Disconnected from remote MCP server: ${serverName}`);
        this.emit('serverDisconnected', { name: serverName });
    }

    async pingRemoteServer(serverName: string): Promise<boolean> {
        try {
            const server = this.remoteServers.get(serverName);
            if (!server || server.status !== 'connected') {
                return false;
            }

            // Send a ping message
            await this.sendToRemoteServer(serverName, {
                method: 'ping',
                params: { timestamp: Date.now() }
            });

            server.lastPing = new Date();
            return true;
        } catch (error) {
            console.error(`Ping failed for remote server ${serverName}:`, error);
            return false;
        }
    }

    // ===== HEALTH CHECK =====
    async performHealthCheck(): Promise<{
        localConnections: number;
        remoteServers: number;
        connectedServers: number;
        agents: number;
        messageQueue: number;
    }> {
        const health = {
            localConnections: this.connections.size,
            remoteServers: this.remoteServers.size,
            connectedServers: Array.from(this.remoteServers.values()).filter(s => s.status === 'connected').length,
            agents: this.agents.size,
            messageQueue: this.messageQueue.length
        };

        console.log('🏥 MCP Protocol Health Check:', health);
        this.emit('healthCheck', health);

        return health;
    }
}

export const mcpProtocol = new MCPCommunicationProtocol();
