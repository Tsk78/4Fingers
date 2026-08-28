import type { SpeciesResult } from '@/types';
import { getSpeciesById } from '@/data/species';

// Demo AI boundary (design.md §6, Requirement 4.8). UI calls this interface
// and never knows whether it's a demo or a future AWS-backed implementation.
//
// HARD CONSTRAINT: no real image classification, no network call, no AWS SDK.
// A future ProductionAIAnalyzer (Rekognition/Bedrock) would implement the same
// interface — it is intentionally NOT built here.

export interface AIAnalyzer {
  analyze(input: { speciesId?: string; imageDataUrl?: string }): Promise<SpeciesResult>;
}

/** Simulated analysis delay so the scan animation reads as "processing" (Req 4.3). */
export const SCAN_DELAY_MS = 1000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class DemoAIAnalyzer implements AIAnalyzer {
  async analyze(input: { speciesId?: string; imageDataUrl?: string }): Promise<SpeciesResult> {
    // imageDataUrl is intentionally ignored — no classification occurs.
    await delay(SCAN_DELAY_MS);
    if (!input.speciesId) {
      throw new Error('DemoAIAnalyzer requires a speciesId (demo mode has no classifier)');
    }
    const record = getSpeciesById(input.speciesId);
    if (!record) {
      throw new Error(`Unknown species id: ${input.speciesId}`);
    }
    return record;
  }
}

/** Shared singleton used by the Camera tab. */
export const aiAnalyzer: AIAnalyzer = new DemoAIAnalyzer();
