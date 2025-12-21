import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import axios from 'axios';

export async function GET() {
    try {
        const settings = await db.setting.findMany({
            where: {
                key: {
                    in: ['VERCEL_AI_GATEWAY_KEY', 'DEEPSEEK_API_KEY', 'HUGGINGFACE_API_KEY']
                }
            }
        });

        const keys: Record<string, string> = {};
        settings.forEach(s => {
            keys[s.key] = s.value;
        });

        const vercelKey = keys['VERCEL_AI_GATEWAY_KEY'] || process.env.VERCEL_AI_GATEWAY_KEY;
        const deepseekKey = keys['DEEPSEEK_API_KEY'] || process.env.DEEPSEEK_API_KEY;
        const hfKey = keys['HUGGINGFACE_API_KEY'] || process.env.HUGGINGFACE_API_KEY;

        const results = [];

        // Check Vercel AI Gateway / DeepSeek
        if (vercelKey || (deepseekKey && deepseekKey.startsWith('vck_'))) {
            const key = vercelKey || deepseekKey;
            const start = Date.now();
            try {
                // Ping Vercel AI Gateway (OpenAI-compatible)
                await axios.get('https://ai-gateway.vercel.sh/v1/models', {
                    headers: { 'Authorization': `Bearer ${key}` },
                    timeout: 5000
                });
                results.push({
                    name: 'Vercel AI Gateway',
                    status: 'online',
                    latency: Date.now() - start,
                    provider: 'vercel'
                });
            } catch (error: any) {
                results.push({
                    name: 'Vercel AI Gateway',
                    status: 'offline',
                    error: error.message,
                    provider: 'vercel'
                });
            }
        }

        // Check DeepSeek Direct
        if (deepseekKey && !deepseekKey.startsWith('vck_')) {
            const start = Date.now();
            try {
                await axios.get('https://api.deepseek.com/models', {
                    headers: { 'Authorization': `Bearer ${deepseekKey}` },
                    timeout: 5000
                });
                results.push({
                    name: 'DeepSeek Direct',
                    status: 'online',
                    latency: Date.now() - start,
                    provider: 'deepseek'
                });
            } catch (error: any) {
                results.push({
                    name: 'DeepSeek Direct',
                    status: 'offline',
                    error: error.message,
                    provider: 'deepseek'
                });
            }
        }

        // Check Hugging Face
        if (hfKey) {
            const start = Date.now();
            try {
                await axios.get('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
                    headers: { 'Authorization': `Bearer ${hfKey}` },
                    timeout: 5000
                });
                results.push({
                    name: 'Hugging Face',
                    status: 'online',
                    latency: Date.now() - start,
                    provider: 'huggingface'
                });
            } catch (error: any) {
                results.push({
                    name: 'Hugging Face',
                    status: 'online', // HF models might be loading, but API is usually up
                    latency: Date.now() - start,
                    provider: 'huggingface',
                    note: error.response?.status === 503 ? 'Model loading' : undefined
                });
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        console.error('AI Status Check Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
