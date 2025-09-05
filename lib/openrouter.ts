import OpenAI from 'openai';

// Lazy initialization of OpenRouter client
let openrouterInstance: OpenAI | null = null;

// Get or create OpenRouter client (server-side only)
function getOpenRouter(): OpenAI {
  if (typeof window !== 'undefined') {
    throw new Error('OpenRouter cannot be used on the client side for security reasons');
  }
  
  if (!openrouterInstance) {
    openrouterInstance = new OpenAI({
      baseURL: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY || '',
      defaultHeaders: {
        'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'https://genesisreloop.com',
        'X-Title': process.env.OPENROUTER_SITE_NAME || 'Genesis Reloop Platform',
      },
    });
  }
  
  return openrouterInstance;
}

// Export getter instead of instance
export const openrouter = {
  get chat() {
    return getOpenRouter().chat;
  }
};

// Default model configuration
export const DEFAULT_MODEL = process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet';

// Helper function to check if OpenRouter is configured
export function isOpenRouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY && 
    process.env.OPENROUTER_API_KEY.toLowerCase() !== 'sk-or-v1-your_openrouter_key_here';
}

// Model presets for different agent types
export const MODEL_PRESETS = {
  // Fast, economical models for simple tasks
  fast: 'anthropic/claude-3-haiku-20240307',
  
  // Balanced models for most agent tasks
  balanced: 'anthropic/claude-3.5-sonnet',
  
  // Advanced models for complex reasoning
  advanced: 'anthropic/claude-3-opus-20240229',
  
  // Specialized models
  code: 'anthropic/claude-3.5-sonnet',
  analysis: 'anthropic/claude-3-opus-20240229',
  creative: 'anthropic/claude-3-opus-20240229',
} as const;

// Temperature presets for different agent behaviors
export const TEMPERATURE_PRESETS = {
  // Deterministic responses (matching, routing)
  deterministic: 0.1,
  
  // Balanced creativity and consistency
  balanced: 0.5,
  
  // Creative responses (discovery, expansion)
  creative: 0.8,
} as const;

// Common OpenRouter request options
export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// Create a chat completion with error handling
export async function createChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  options: OpenRouterOptions = {}
) {
  if (typeof window !== 'undefined') {
    throw new Error('OpenRouter cannot be used on the client side for security reasons');
  }
  
  if (!isOpenRouterConfigured()) {
    throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your .env.local file.');
  }

  try {
    const response = await getOpenRouter().chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages,
      temperature: options.temperature ?? TEMPERATURE_PRESETS.balanced,
      max_tokens: options.max_tokens || 4096,
      stream: options.stream || false,
    });

    return response;
  } catch (error: any) {
    console.error('OpenRouter API error:', error);
    
    // Handle specific error cases
    if (error?.status === 401) {
      throw new Error('Invalid OpenRouter API key. Please check your OPENROUTER_API_KEY in .env.local');
    } else if (error?.status === 429) {
      throw new Error('OpenRouter rate limit exceeded. Please try again later.');
    } else if (error?.status === 402) {
      throw new Error('OpenRouter credits exhausted. Please add credits to your account.');
    }
    
    throw new Error(`OpenRouter API error: ${error?.message || 'Unknown error'}`);
  }
}

// Export types
export type { OpenAI };
export type ChatCompletionMessageParam = OpenAI.Chat.ChatCompletionMessageParam;
