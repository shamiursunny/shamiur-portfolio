// JARVIS AI Integrated Voice Cloning & Video Avatar System
// Complete system integrating voice cloning, video avatars, and social media automation

import { EventEmitter } from 'events';
import { JarvisVoiceCloning } from './jarvis-voice-cloning';
import { JarvisVideoAvatar } from './jarvis-video-avatar';
import { JarvisSocialMediaAutomation } from './jarvis-social-media-automation';

export interface IntegratedSystemConfig {
    enableVoiceCloning: boolean;
    enableVideoAvatars: boolean;
    enableSocialMedia: boolean;
    enableRealTimeProcessing: boolean;
    maxConcurrentProcesses: number;
    qualitySettings: {
        voiceQuality: number; // 0-100
        videoQuality: number; // 0-100
        processingSpeed: 'fast' | 'balanced' | 'quality';
    };
}

export interface UnifiedRequest {
    type: 'voice_clone' | 'video_avatar' | 'social_content' | 'full_pipeline';
    payload: any;
    priority: 'low' | 'medium' | 'high';
    callback?: (result: any) => void;
}

export interface SystemStatus {
    isInitialized: boolean;
    isProcessing: boolean;
    activeProcesses: number;
    queueLength: number;
    components: {
        voiceCloning: boolean;
        videoAvatar: boolean;
        socialMedia: boolean;
    };
    performance: {
        averageProcessingTime: number;
        successRate: number;
        totalProcessed: number;
    };
}

export class JarvisIntegratedVoiceVideoSystem extends EventEmitter {
    private voiceCloning: JarvisVoiceCloning;
    private videoAvatar: JarvisVideoAvatar;
    private socialMedia: JarvisSocialMediaAutomation;
    private config: IntegratedSystemConfig;
    private requestQueue: UnifiedRequest[] = [];
    private activeProcesses: Set<string> = new Set();
    private processHistory: any[] = [];
    private isProcessing: boolean = false;

    constructor(config?: Partial<IntegratedSystemConfig>) {
        super();

        this.config = {
            enableVoiceCloning: true,
            enableVideoAvatars: true,
            enableSocialMedia: true,
            enableRealTimeProcessing: true,
            maxConcurrentProcesses: 3,
            qualitySettings: {
                voiceQuality: 90,
                videoQuality: 90,
                processingSpeed: 'balanced'
            },
            ...config
        };

        this.initializeSystem();
        console.log('🤖 JARVIS Integrated Voice/Video System initialized');
    }

    private async initializeSystem(): Promise<void> {
        try {
            // Initialize components
            if (this.config.enableVoiceCloning) {
                this.voiceCloning = new JarvisVoiceCloning();
                console.log('✅ Voice cloning system ready');
            }

            if (this.config.enableVideoAvatars) {
                this.videoAvatar = new JarvisVideoAvatar();
                console.log('✅ Video avatar system ready');
            }

            if (this.config.enableSocialMedia && this.voiceCloning && this.videoAvatar) {
                this.socialMedia = new JarvisSocialMediaAutomation(this.voiceCloning, this.videoAvatar);
                console.log('✅ Social media automation ready');
            }

            // Start processing queue
            this.startQueueProcessor();

            // Set up event forwarding
            this.setupEventForwarding();

            this.emit('systemInitialized');
            console.log('🎉 All systems operational');

        } catch (error) {
            console.error('System initialization failed:', error);
            this.emit('systemError', { error: error.message });
        }
    }

    // ===== UNIFIED PROCESSING API =====

    async processRequest(request: UnifiedRequest): Promise<{
        success: boolean;
        result?: any;
        error?: string;
        processingTime: number;
    }> {
        console.log(`🔄 Processing ${request.type} request`);
        const startTime = Date.now();

        try {
            // Add to queue
            this.requestQueue.push(request);
            this.processQueue();

            // Wait for processing
            const result = await this.waitForProcessing(request);

            const processingTime = Date.now() - startTime;
            console.log(`✅ Request processed in ${processingTime}ms`);

            return {
                success: true,
                result,
                processingTime
            };

        } catch (error) {
            console.error('Request processing failed:', error);
            return {
                success: false,
                error: error.message,
                processingTime: Date.now() - startTime
            };
        }
    }

    // ===== VOICE CLONING INTEGRATION =====

    async createVoiceClone(
        name: string,
        description: string,
        audioSamples: File[],
        language: 'en' | 'bn' | 'multi' = 'en'
    ): Promise<{
        success: boolean;
        voiceClone?: any;
        error?: string;
    }> {
        if (!this.voiceCloning) {
            throw new Error('Voice cloning system not enabled');
        }

        console.log(`🎭 Creating voice clone: ${name}`);

        const result = await this.voiceCloning.createVoiceClone({
            name,
            description,
            language,
            audioSamples
        });

        return result;
    }

    async synthesizeSpeech(
        text: string,
        voiceCloneId: string,
        options?: {
            emotion?: string;
            speed?: number;
            pitch?: number;
        }
    ): Promise<{
        success: boolean;
        audioUrl?: string;
        duration?: number;
        error?: string;
    }> {
        if (!this.voiceCloning) {
            throw new Error('Voice cloning system not enabled');
        }

        console.log(`🔊 Synthesizing speech with voice: ${voiceCloneId}`);

        const result = await this.voiceCloning.synthesizeSpeech({
            text,
            voiceCloneId,
            emotion: options?.emotion,
            speed: options?.speed,
            pitch: options?.pitch
        });

        return result;
    }

    // ===== VIDEO AVATAR INTEGRATION =====

    async createVideoAvatar(
        name: string,
        description: string,
        sourceType: 'photo' | 'video' | 'live-capture',
        sourceFiles?: File[]
    ): Promise<{
        success: boolean;
        avatar?: any;
        error?: string;
    }> {
        if (!this.videoAvatar) {
            throw new Error('Video avatar system not enabled');
        }

        console.log(`🎭 Creating video avatar: ${name}`);

        const result = await this.videoAvatar.createAvatar({
            name,
            description,
            sourceType,
            sourceFiles
        });

        return result;
    }

    async generateVideo(
        text: string,
        avatarId: string,
        voiceCloneId?: string,
        options?: {
            emotion?: string;
            duration?: number;
            background?: string;
        }
    ): Promise<{
        success: boolean;
        videoUrl?: string;
        duration?: number;
        error?: string;
    }> {
        if (!this.videoAvatar) {
            throw new Error('Video avatar system not enabled');
        }

        console.log(`🎬 Generating video with avatar: ${avatarId}`);

        const result = await this.videoAvatar.generateVideo({
            text,
            avatarId,
            voiceCloneId,
            emotion: options?.emotion,
            duration: options?.duration,
            background: options?.background
        });

        return result;
    }

    // ===== SOCIAL MEDIA AUTOMATION INTEGRATION =====

    async generateSocialContent(
        type: 'video' | 'audio' | 'text' | 'image',
        platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'facebook',
        topic: string,
        options?: {
            tone?: string;
            duration?: number;
            voiceCloneId?: string;
            avatarId?: string;
            scheduleAt?: Date;
        }
    ): Promise<{
        success: boolean;
        content?: any;
        error?: string;
    }> {
        if (!this.socialMedia) {
            throw new Error('Social media system not enabled');
        }

        console.log(`📱 Generating ${type} content for ${platform}`);

        const result = await this.socialMedia.generateContent({
            type,
            platform,
            topic,
            tone: options?.tone,
            duration: options?.duration,
            voiceCloneId: options?.voiceCloneId,
            avatarId: options?.avatarId,
            scheduleAt: options?.scheduleAt
        });

        return result;
    }

    async publishSocialContent(contentId: string): Promise<{
        success: boolean;
        publishedAt?: Date;
        platformPostId?: string;
        error?: string;
    }> {
        if (!this.socialMedia) {
            throw new Error('Social media system not enabled');
        }

        console.log(`🚀 Publishing content: ${contentId}`);

        const result = await this.socialMedia.publishContent(contentId);
        return result;
    }

    // ===== FULL PIPELINE OPERATIONS =====

    async createCompleteAvatarPresentation(
        topic: string,
        platform: 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'twitter' | 'facebook',
        voiceCloneId: string,
        avatarId: string,
        options?: {
            tone?: string;
            duration?: number;
            publishImmediately?: boolean;
        }
    ): Promise<{
        success: boolean;
        content?: any;
        publishedAt?: Date;
        error?: string;
    }> {
        console.log(`🎯 Creating complete avatar presentation for ${platform}`);

        try {
            // Step 1: Generate video content with avatar and voice
            const videoResult = await this.generateVideo(topic, avatarId, voiceCloneId, {
                emotion: options?.tone,
                duration: options?.duration
            });

            if (!videoResult.success) {
                throw new Error(videoResult.error);
            }

            // Step 2: Create social media content
            const contentResult = await this.generateSocialContent(
                'video',
                platform,
                topic,
                {
                    voiceCloneId,
                    avatarId,
                    tone: options?.tone,
                    duration: options?.duration
                }
            );

            if (!contentResult.success) {
                throw new Error(contentResult.error);
            }

            // Step 3: Publish immediately if requested
            let publishedAt: Date | undefined;
            if (options?.publishImmediately && contentResult.content) {
                const publishResult = await this.publishSocialContent(contentResult.content.id);
                if (publishResult.success) {
                    publishedAt = publishResult.publishedAt;
                }
            }

            return {
                success: true,
                content: contentResult.content,
                publishedAt
            };

        } catch (error) {
            console.error('Complete presentation creation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async batchCreateContent(
        requests: {
            topic: string;
            platform: string;
            type: string;
            voiceCloneId?: string;
            avatarId?: string;
        }[]
    ): Promise<{
        success: boolean;
        created: any[];
        failed: { request: any; error: string }[];
    }> {
        console.log(`🚀 Creating batch content for ${requests.length} items`);

        const created: any[] = [];
        const failed: { request: any; error: string }[] = [];

        for (const request of requests) {
            try {
                const result = await this.generateSocialContent(
                    request.type as any,
                    request.platform as any,
                    request.topic,
                    {
                        voiceCloneId: request.voiceCloneId,
                        avatarId: request.avatarId
                    }
                );

                if (result.success && result.content) {
                    created.push(result.content);
                } else {
                    failed.push({ request, error: result.error || 'Unknown error' });
                }

                // Delay between requests
                await new Promise(resolve => setTimeout(resolve, 1000));

            } catch (error) {
                failed.push({ request, error: error.message });
            }
        }

        return { success: true, created, failed };
    }

    // ===== REAL-TIME PROCESSING =====

    async startRealTimeVoiceCloning(
        stream: MediaStream,
        onAudioChunk: (audioData: ArrayBuffer) => void
    ): Promise<boolean> {
        if (!this.voiceCloning) {
            throw new Error('Voice cloning system not enabled');
        }

        console.log('🎤 Starting real-time voice cloning...');
        return await this.voiceCloning.startRealTimeCloning(stream, onAudioChunk);
    }

    async startRealTimeAvatar(
        avatarId: string,
        voiceCloneId: string,
        canvasId: string
    ): Promise<{
        success: boolean;
        sessionId?: string;
        error?: string;
    }> {
        if (!this.videoAvatar) {
            throw new Error('Video avatar system not enabled');
        }

        console.log(`🎥 Starting real-time avatar: ${avatarId}`);

        const result = await this.videoAvatar.startRealTimeAvatar({
            avatarId,
            voiceCloneId,
            canvasId,
            quality: 'high',
            enableLipSync: true,
            enableExpressions: true,
            enableGestures: true
        });

        return result;
    }

    // ===== SYSTEM MONITORING =====

    getSystemStatus(): SystemStatus {
        return {
            isInitialized: this.voiceCloning !== undefined || this.videoAvatar !== undefined,
            isProcessing: this.isProcessing,
            activeProcesses: this.activeProcesses.size,
            queueLength: this.requestQueue.length,
            components: {
                voiceCloning: this.voiceCloning !== undefined,
                videoAvatar: this.videoAvatar !== undefined,
                socialMedia: this.socialMedia !== undefined
            },
            performance: this.calculatePerformanceMetrics()
        };
    }

    async getSystemAnalytics(): Promise<{
        success: boolean;
        analytics: any;
        timestamp: Date;
    }> {
        const status = this.getSystemStatus();

        const analytics = {
            systemStatus: status,
            voiceClones: this.voiceCloning ? this.voiceCloning.getVoiceClones().length : 0,
            videoAvatars: this.videoAvatar ? this.videoAvatar.getAvatars().length : 0,
            socialContent: this.socialMedia ? this.socialMedia.getContentQueue().length : 0,
            platformConnections: this.socialMedia ? this.socialMedia.getPlatformConfigs().length : 0,
            processingHistory: this.processHistory.slice(-10) // Last 10 processes
        };

        return {
            success: true,
            analytics,
            timestamp: new Date()
        };
    }

    // ===== PRIVATE METHODS =====

    private processQueue(): void {
        if (this.isProcessing || this.activeProcesses.size >= this.config.maxConcurrentProcesses) {
            return;
        }

        const nextRequest = this.requestQueue.shift();
        if (!nextRequest) return;

        this.isProcessing = true;
        this.activeProcesses.add(nextRequest.type);

        this.processRequestInternal(nextRequest)
            .then(() => {
                this.activeProcesses.delete(nextRequest.type);
                this.isProcessing = false;

                // Process next request
                this.processQueue();
            })
            .catch(error => {
                console.error('Request processing failed:', error);
                this.activeProcesses.delete(nextRequest.type);
                this.isProcessing = false;
                this.processQueue();
            });
    }

    private async processRequestInternal(request: UnifiedRequest): Promise<any> {
        const processId = this.generateId();
        const startTime = Date.now();

        try {
            let result;

            switch (request.type) {
                case 'voice_clone':
                    result = await this.voiceCloning?.createVoiceClone(request.payload);
                    break;
                case 'video_avatar':
                    result = await this.videoAvatar?.createAvatar(request.payload);
                    break;
                case 'social_content':
                    result = await this.socialMedia?.generateContent(request.payload);
                    break;
                case 'full_pipeline':
                    result = await this.createCompleteAvatarPresentation(
                        request.payload.topic,
                        request.payload.platform,
                        request.payload.voiceCloneId,
                        request.payload.avatarId
                    );
                    break;
                default:
                    throw new Error(`Unknown request type: ${request.type}`);
            }

            // Record process history
            this.processHistory.push({
                processId,
                type: request.type,
                success: true,
                processingTime: Date.now() - startTime,
                timestamp: new Date()
            });

            // Call callback if provided
            if (request.callback) {
                request.callback(result);
            }

            this.emit('requestCompleted', { processId, result });
            return result;

        } catch (error) {
            // Record failed process
            this.processHistory.push({
                processId,
                type: request.type,
                success: false,
                error: error.message,
                processingTime: Date.now() - startTime,
                timestamp: new Date()
            });

            this.emit('requestFailed', { processId, error });
            throw error;
        }
    }

    private waitForProcessing(request: UnifiedRequest): Promise<any> {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Request timeout'));
            }, 30000); // 30 second timeout

            request.callback = (result) => {
                clearTimeout(timeout);
                resolve(result);
            };
        });
    }

    private setupEventForwarding(): void {
        if (this.voiceCloning) {
            this.voiceCloning.on('cloneCompleted', (data) => {
                this.emit('voiceCloneCompleted', data);
            });

            this.voiceCloning.on('synthesisCompleted', (data) => {
                this.emit('voiceSynthesisCompleted', data);
            });
        }

        if (this.videoAvatar) {
            this.videoAvatar.on('avatarCreationCompleted', (data) => {
                this.emit('videoAvatarCompleted', data);
            });

            this.videoAvatar.on('videoGenerationCompleted', (data) => {
                this.emit('videoGenerationCompleted', data);
            });
        }

        if (this.socialMedia) {
            this.socialMedia.on('contentGenerationCompleted', (data) => {
                this.emit('socialContentCompleted', data);
            });

            this.socialMedia.on('contentPublished', (data) => {
                this.emit('socialContentPublished', data);
            });
        }
    }

    private calculatePerformanceMetrics(): any {
        if (this.processHistory.length === 0) {
            return {
                averageProcessingTime: 0,
                successRate: 0,
                totalProcessed: 0
            };
        }

        const recent = this.processHistory.slice(-20); // Last 20 processes
