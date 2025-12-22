// MCP Remote Server Management API
import { NextRequest, NextResponse } from 'next/server';
import { mcpProtocol, RemoteMCPServer, MCPServerConfig } from '@/lib/mcp-communication-protocol';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action') || 'status';

        switch (action) {
            case 'status':
                return await getRemoteServerStatus();

            case 'health':
                return await performHealthCheck();

            case 'servers':
                return await listRemoteServers();

            case 'ping':
                const serverName = searchParams.get('server');
                if (!serverName) {
                    return NextResponse.json(
                        { error: 'Server name is required for ping' },
                        { status: 400 }
                    );
                }
                return await pingRemoteServer(serverName);

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Supported actions: status, health, servers, ping' },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('MCP Remote API Error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error.message,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, serverName, config } = body;

        switch (action) {
            case 'connect':
                return await connectToRemoteServer(serverName);

            case 'disconnect':
                return await disconnectFromRemoteServer(serverName);

            case 'register':
                return await registerRemoteServer(serverName, config);

            case 'send':
                return await sendMessageToRemoteServer(serverName, body.message);

            case 'test':
                return await testRemoteServerConnection(serverName);

            default:
                return NextResponse.json(
                    { error: 'Invalid action. Supported actions: connect, disconnect, register, send, test' },
                    { status: 400 }
                );
        }

    } catch (error) {
        console.error('MCP Remote API Error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error.message,
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}

// ===== HELPER FUNCTIONS =====

async function getRemoteServerStatus() {
    try {
        const servers = mcpProtocol.getRemoteServers();
        const health = await mcpProtocol.performHealthCheck();

        const status = {
            protocol: 'Enhanced MCP Communication Protocol v2.0',
            timestamp: new Date().toISOString(),
            remoteServers: servers.map(server => ({
                name: server.name,
                url: server.config.url,
                transport: server.config.transport,
                status: server.status,
                lastPing: server.lastPing,
                connected: server.status === 'connected'
            })),
            health,
            capabilities: {
                sse: true,
                websocket: true,
                http: true,
                autoConnect: true,
                healthMonitoring: true,
                messageRouting: true
            }
        };

        return NextResponse.json({
            success: true,
            data: status
        });

    } catch (error) {
        throw new Error(`Failed to get remote server status: ${error.message}`);
    }
}

async function performHealthCheck() {
    try {
        const health = await mcpProtocol.performHealthCheck();

        return NextResponse.json({
            success: true,
            data: {
                ...health,
                timestamp: new Date().toISOString(),
                status: 'healthy'
            }
        });

    } catch (error) {
        throw new Error(`Health check failed: ${error.message}`);
    }
}

async function listRemoteServers() {
    try {
        const servers = mcpProtocol.getRemoteServers();

        return NextResponse.json({
            success: true,
            data: {
                servers,
                count: servers.length,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        throw new Error(`Failed to list remote servers: ${error.message}`);
    }
}

async function connectToRemoteServer(serverName: string) {
    try {
        await mcpProtocol.connectToRemoteServer(serverName);

        return NextResponse.json({
            success: true,
            message: `Successfully connected to remote server: ${serverName}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        throw new Error(`Failed to connect to remote server ${serverName}: ${error.message}`);
    }
}

async function disconnectFromRemoteServer(serverName: string) {
    try {
        await mcpProtocol.disconnectRemoteServer(serverName);

        return NextResponse.json({
            success: true,
            message: `Successfully disconnected from remote server: ${serverName}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        throw new Error(`Failed to disconnect from remote server ${serverName}: ${error.message}`);
    }
}

async function registerRemoteServer(serverName: string, config: MCPServerConfig) {
    try {
        if (!serverName || !config || !config.url || !config.transport) {
            return NextResponse.json(
                { error: 'Server name, URL, and transport are required' },
                { status: 400 }
            );
        }

        await mcpProtocol.registerRemoteServer(serverName, config);

        return NextResponse.json({
            success: true,
            message: `Successfully registered remote server: ${serverName}`,
            data: {
                name: serverName,
                url: config.url,
                transport: config.transport
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        throw new Error(`Failed to register remote server ${serverName}: ${error.message}`);
    }
}

async function sendMessageToRemoteServer(serverName: string, message: any) {
    try {
        if (!serverName || !message) {
            return NextResponse.json(
                { error: 'Server name and message are required' },
                { status: 400 }
            );
        }

        await mcpProtocol.sendToRemoteServer(serverName, message);

        return NextResponse.json({
            success: true,
            message: `Message sent to remote server: ${serverName}`,
            data: {
                serverName,
                message
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        throw new Error(`Failed to send message to remote server ${serverName}: ${error.message}`);
    }
}

async function pingRemoteServer(serverName: string) {
    try {
        const success = await mcpProtocol.pingRemoteServer(serverName);

        return NextResponse.json({
            success: true,
            data: {
                serverName,
                pingSuccess: success,
                timestamp: new Date().toISOString()
            },
            message: success ? `Ping successful to ${serverName}` : `Ping failed to ${serverName}`
        });

    } catch (error) {
        throw new Error(`Failed to ping remote server ${serverName}: ${error.message}`);
    }
}

async function testRemoteServerConnection(serverName: string) {
    try {
        const startTime = Date.now();

        // Test connection
        await mcpProtocol.connectToRemoteServer(serverName);

        // Test ping
        const pingSuccess = await mcpProtocol.pingRemoteServer(serverName);

        // Test message sending
        await mcpProtocol.sendToRemoteServer(serverName, {
            method: 'test_connection',
            params: {
                timestamp: Date.now(),
                testType: 'comprehensive'
            }
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const testResults = {
            serverName,
            connection: 'success',
            ping: pingSuccess ? 'success' : 'failed',
            messageSending: 'success',
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString(),
            overall: 'success'
        };

        return NextResponse.json({
            success: true,
            data: testResults,
            message: `Comprehensive test completed for ${serverName}`
        });

    } catch (error) {
        const testResults = {
            serverName,
            connection: 'failed',
            ping: 'failed',
            messageSending: 'failed',
            error: error.message,
            timestamp: new Date().toISOString(),
            overall: 'failed'
        };

        return NextResponse.json({
            success: false,
            data: testResults,
            message: `Test failed for ${serverName}: ${error.message}`
        }, { status: 500 });
    }
}
