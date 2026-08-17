/**
 * Voice Architecture Interfaces
 * 
 * Defines the contract for the voice-driven founder interaction system.
 */

export type Language = 'en' | 'te' | 'hi';

export interface VoiceIntent {
  intent: string;
  confidence: number;
  entities: Record<string, unknown>;
}

export interface BusinessContext {
  industry: string;
  companySize: number;
  buyingStage: 'discovery' | 'evaluation' | 'decision';
  automationOpportunities: string[];
}

export interface AIResponse {
  text: string;
  audioUrl: string;
  visualCue: string; // Triggers specific founder expression/action
}

export interface VoiceInterface {
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  processAudio: (audioBlob: Blob) => Promise<AIResponse>;
  setLanguage: (lang: Language) => void;
}
