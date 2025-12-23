// AI Models API Endpoints
// RESTful API for AI models management and SUPER AI REG TEAM integration

import { NextRequest, NextResponse } from 'next/server';
import { AIModelsRolesIntegration } from '../../../lib/ai-models-roles-integration';
import { AIModelRequest } from '../../../lib/jarvis-ai-models-manager';

// Initialize the AI Models Roles Integration
const aiTeam = new AIModelsRolesIntegration();

// GET /api/ai-models - Get all models and roles overview
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        const modelId = searchParams.get('model');
        const roleId = searchParams.get('role');
        const taskType = searchParams.get('task');

        switch (action) {
            case 'overview':
                const overview = aiTeam.getTeamOverview();
                return NextResponse.json({
                    success: true,
                    data: overview
                });

            case 'roles':
                const roles = aiTeam.getAllRoles();
                return NextResponse.json({
                    success: true,
                    data: roles
                });

            case 'role':
                if (!roleId) {
                    return NextResponse.json(
                        { success: false, error: 'Role ID is required' },
                        { status: 400 }
                    );
                }
                const role = aiTeam.getRole(roleId);
                if (!role) {
                    return NextResponse.json(
                        { success: false, error: 'Role not found' },
                        { status: 404 }
                    );
                }
                return NextResponse.json({
                    success: true,
                    data: role
                });

            case 'models-for-role':
                if (!roleId) {
                    return NextResponse.json(
                        { success: false, error: 'Role ID is required' },
                        { status: 400 }
                    );
                }
                const modelsForRole = aiTeam.getModelsForRole(roleId);
                return NextResponse.json({
                    success: true,
                    data: modelsForRole
                });

            case 'best-model':
                if (!taskType) {
                    return NextResponse.json(
                        { success: false, error: 'Task type is required' },
                        { status: 400 }
                    );
                }
                const bestModel = aiTeam.getBestModelForTask(taskType);
                return NextResponse.json({
                    success: true,
                    data: bestModel
                });

            case 'health':
                const healthCheck = await aiTeam.runHealthCheck();
                return NextResponse.json({
                    success: true,
                    data: healthCheck
                });

            case 'assignments':
                const assignments = aiTeam.getModelAssignments();
                return NextResponse.json({
                    success: true,
                    data: assignments
                });

            default:
                // Default: return all models
                const allModels = aiTeam['modelsManager'].getAllModels();
                return NextResponse.json({
                    success: true,
                    data: allModels
                });
        }
    } catch (error) {
        console.error('AI Models API error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// POST /api/ai-models - Query AI models with role-based selection
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { taskType, messages, options } = body;

        if (!taskType || !messages) {
            return NextResponse.json(
                { success: false, error: 'Task type and messages are required' },
                { status: 400 }
            );
        }

        // Use role-based query
        const response = await aiTeam.queryWithRole(taskType, messages, options);

        return NextResponse.json({
            success: true,
            data: {
                response,
                taskType,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('AI Models query error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Query failed'
            },
            { status: 500 }
        );
    }
}

// PUT /api/ai-models - Update model configurations
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { modelId, action, ...params } = body;

        if (!modelId || !action) {
            return NextResponse.json(
                { success: false, error: 'Model ID and action are required' },
                { status: 400 }
            );
        }

        const modelsManager = aiTeam['modelsManager'];
        let result;

        switch (action) {
            case 'activate':
                result = modelsManager.activateModel(modelId);
                break;
            case 'deactivate':
                result = modelsManager.deactivateModel(modelId);
                break;
            default:
                return NextResponse.json(
                    { success: false, error: 'Invalid action' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            data: {
                modelId,
                action,
                result
            }
        });

    } catch (error) {
        console.error('AI Models update error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Update failed'
            },
            { status: 500 }
        );
    }
}
