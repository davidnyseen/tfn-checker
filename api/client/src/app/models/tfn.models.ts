export interface TfnValidationRequest {
  tfn: string;
}

export interface TfnValidationResponse {
  tfn: string;
  isValid: boolean;
  errors: string[];
  validatedAt: string;
}

export interface ValidationRecord {
  id: number;
  maskedTfn: string;
  isValid: boolean;
  errors: string;
  validatedAt: string;
}
