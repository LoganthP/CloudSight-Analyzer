'use server';

import {
  updatePatternRules,
  type UpdatePatternRulesOutput,
} from '@/ai/flows/adaptive-pattern-rules';
import { z } from 'zod';

const schema = z.object({
  trafficDataSummary: z.string().min(10, { message: 'Summary must be at least 10 characters.' }),
  currentRules: z.string(),
});

type State = {
  data: UpdatePatternRulesOutput | null;
  error: string | null;
};

export async function getUpdatedRulesAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = schema.safeParse({
    trafficDataSummary: formData.get('trafficDataSummary'),
    currentRules: formData.get('currentRules'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors.trafficDataSummary?.[0] ?? 'Invalid input.',
    };
  }

  try {
    const result = await updatePatternRules({
      trafficDataSummary: validatedFields.data.trafficDataSummary,
      currentRules: validatedFields.data.currentRules,
    });
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'Failed to get updated rules from AI. Please try again.' };
  }
}
