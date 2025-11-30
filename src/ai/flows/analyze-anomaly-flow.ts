'use server';

/**
 * @fileOverview An AI flow to analyze a given anomaly and provide a security assessment.
 *
 * - analyzeAnomaly - A function that handles the anomaly analysis process.
 * - AnalyzeAnomalyInput - The input type for the analyzeAnomaly function.
 * - AnalyzeAnomalyOutput - The return type for the analyzeAnomaly function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeAnomalyInputSchema = z.object({
  anomalyData: z.string().describe('A description of the security anomaly to be analyzed.'),
});
export type AnalyzeAnomalyInput = z.infer<typeof AnalyzeAnomalyInputSchema>;

const AnalyzeAnomalyOutputSchema = z.object({
  analysis: z.string().describe('A detailed explanation of the potential threat and its implications.'),
  suggestedSeverity: z.enum(['Critical', 'High', 'Medium', 'Low']).describe('The suggested severity level for the anomaly.'),
  recommendedActions: z.string().describe('A list of recommended actions to mitigate the threat.'),
});
export type AnalyzeAnomalyOutput = z.infer<typeof AnalyzeAnomalyOutputSchema>;

export async function analyzeAnomaly(input: AnalyzeAnomalyInput): Promise<AnalyzeAnomalyOutput> {
  return analyzeAnomalyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAnomalyPrompt',
  input: { schema: AnalyzeAnomalyInputSchema },
  output: { schema: AnalyzeAnomalyOutputSchema },
  prompt: `You are a senior cybersecurity analyst. Your task is to analyze the provided anomaly description and provide a detailed security assessment.

Analyze the following anomaly data:
"{{{anomalyData}}}"

Based on your analysis, provide:
1.  A detailed analysis of what this anomaly could mean.
2.  A suggested severity level (Critical, High, Medium, or Low).
3.  A clear, actionable list of recommended steps to investigate and mitigate this anomaly.`,
});

const analyzeAnomalyFlow = ai.defineFlow(
  {
    name: 'analyzeAnomalyFlow',
    inputSchema: AnalyzeAnomalyInputSchema,
    outputSchema: AnalyzeAnomalyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
