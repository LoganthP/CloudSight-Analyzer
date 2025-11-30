'use server';

import { analyzeAnomaly, type AnalyzeAnomalyOutput } from '@/ai/flows/analyze-anomaly-flow';
import { z } from 'zod';

const schema = z.object({
  anomalyData: z.string().min(10, { message: 'Anomaly description must be at least 10 characters.' }),
});

export type AnomalyAnalysisState = {
  data: AnalyzeAnomalyOutput | null;
  error: string | null;
};

export async function analyzeAnomalyAction(
  prevState: AnomalyAnalysisState,
  formData: FormData
): Promise<AnomalyAnalysisState> {
  const validatedFields = schema.safeParse({
    anomalyData: formData.get('anomalyData'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors.anomalyData?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await analyzeAnomaly({
      anomalyData: validatedFields.data.anomalyData,
    });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Failed to get analysis from AI. Please try again.' };
  }
}
