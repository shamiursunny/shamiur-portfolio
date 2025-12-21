import { NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { db } from '@/lib/db';

export async function POST(req: Request) {
    try {
        const { action, repoName, path, content, description, isPrivate, token } = await req.json();

        // Fetch GitHub token from settings if not provided
        let githubToken = token;
        if (!githubToken) {
            const setting = await db.setting.findUnique({
                where: { key: 'GITHUB_TOKEN' }
            });
            githubToken = setting?.value || process.env.GITHUB_TOKEN;
        }

        if (!githubToken) {
            return NextResponse.json({
                success: false,
                error: 'GitHub token not configured. Please add GITHUB_TOKEN in Settings.'
            }, { status: 400 });
        }

        const octokit = new Octokit({ auth: githubToken });

        // Get authenticated user
        const { data: user } = await octokit.rest.users.getAuthenticated();
        const owner = user.login;

        switch (action) {
            case 'create_repo': {
                if (!repoName) {
                    return NextResponse.json({ success: false, error: 'Repository name is required' }, { status: 400 });
                }

                const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
                    name: repoName,
                    description: description || '',
                    private: isPrivate || false,
                    auto_init: true,
                });

                // Log the action
                await db.aiLog.create({
                    data: {
                        action: 'GITHUB_CREATE_REPO',
                        details: `Created repository: ${repo.full_name}`,
                        status: 'SUCCESS'
                    }
                });

                return NextResponse.json({
                    success: true,
                    message: `Repository '${repo.full_name}' created successfully!`,
                    data: {
                        name: repo.name,
                        fullName: repo.full_name,
                        url: repo.html_url,
                        cloneUrl: repo.clone_url,
                        private: repo.private
                    }
                });
            }

            case 'create_file': {
                if (!repoName || !path || !content) {
                    return NextResponse.json({
                        success: false,
                        error: 'Repository name, file path, and content are required'
                    }, { status: 400 });
                }

                const { data: file } = await octokit.rest.repos.createOrUpdateFileContents({
                    owner,
                    repo: repoName,
                    path,
                    message: `Create ${path}`,
                    content: Buffer.from(content).toString('base64'),
                });

                await db.aiLog.create({
                    data: {
                        action: 'GITHUB_CREATE_FILE',
                        details: `Created file: ${path} in ${owner}/${repoName}`,
                        status: 'SUCCESS'
                    }
                });

                return NextResponse.json({
                    success: true,
                    message: `File '${path}' created successfully!`,
                    data: {
                        path: file.content?.path,
                        sha: file.content?.sha,
                        url: file.content?.html_url
                    }
                });
            }

            case 'update_file': {
                if (!repoName || !path || !content) {
                    return NextResponse.json({
                        success: false,
                        error: 'Repository name, file path, and content are required'
                    }, { status: 400 });
                }

                // Get the current file to get its SHA
                let sha: string | undefined;
                try {
                    const { data: existingFile } = await octokit.rest.repos.getContent({
                        owner,
                        repo: repoName,
                        path,
                    });
                    if (!Array.isArray(existingFile) && existingFile.type === 'file') {
                        sha = existingFile.sha;
                    }
                } catch (e) {
                    // File doesn't exist, will create new
                }

                const { data: file } = await octokit.rest.repos.createOrUpdateFileContents({
                    owner,
                    repo: repoName,
                    path,
                    message: sha ? `Update ${path}` : `Create ${path}`,
                    content: Buffer.from(content).toString('base64'),
                    sha,
                });

                await db.aiLog.create({
                    data: {
                        action: 'GITHUB_UPDATE_FILE',
                        details: `Updated file: ${path} in ${owner}/${repoName}`,
                        status: 'SUCCESS'
                    }
                });

                return NextResponse.json({
                    success: true,
                    message: `File '${path}' updated successfully!`,
                    data: {
                        path: file.content?.path,
                        sha: file.content?.sha,
                        url: file.content?.html_url
                    }
                });
            }

            case 'list_repos': {
                const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
                    sort: 'updated',
                    per_page: 20,
                });

                return NextResponse.json({
                    success: true,
                    message: `Found ${repos.length} repositories`,
                    data: repos.map(repo => ({
                        name: repo.name,
                        fullName: repo.full_name,
                        url: repo.html_url,
                        description: repo.description,
                        private: repo.private,
                        updatedAt: repo.updated_at
                    }))
                });
            }

            default:
                return NextResponse.json({
                    success: false,
                    error: `Unknown action: ${action}`
                }, { status: 400 });
        }
    } catch (error: any) {
        console.error('GitHub API Error:', error);

        await db.aiLog.create({
            data: {
                action: 'GITHUB_ERROR',
                details: error.message || 'Unknown error',
                status: 'ERROR'
            }
        });

        return NextResponse.json({
            success: false,
            error: error.message || 'GitHub operation failed'
        }, { status: 500 });
    }
}
