import {
  getGenerationService,
  setGenerationService,
  mockGenerationService,
  createMockDraft,
} from "./mock";
import { httpGenerationService, shouldUseHttpGeneration } from "./http";

// Default to HTTP backend when available; set NEXT_PUBLIC_SOLAI_USE_HTTP_GENERATION=0 for mock.
if (typeof window !== "undefined" && shouldUseHttpGeneration()) {
  setGenerationService(httpGenerationService);
}

export {
  getGenerationService,
  setGenerationService,
  mockGenerationService,
  createMockDraft,
  httpGenerationService,
};
