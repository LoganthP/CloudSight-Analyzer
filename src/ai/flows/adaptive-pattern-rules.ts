'use server';

/**
 * @fileOverview A flow to automatically update pattern detection rules based on generative AI analysis of new traffic data.
 *
 * - updatePatternRules - A function that handles the pattern rule update process.
 * - UpdatePatternRulesInput - The input type for the updatePatternRules function.
 * - UpdatePatternRulesOutput - The return type for the updatePatternRules function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdatePatternRulesInputSchema = z.object({
  trafficDataSummary: z
    .string()
    .describe(
      'A summary of recent network traffic data, including volume, source, destination, and type.'
    ),
  currentRules: z.string().describe('The current set of pattern detection rules.'),
});
export type UpdatePatternRulesInput = z.infer<typeof UpdatePatternRulesInputSchema>;

const UpdatePatternRulesOutputSchema = z.object({
  updatedRules: z
    .string()
    .describe('The updated set of pattern detection rules, based on the traffic data summary.'),
  explanation: z
    .string()
    .describe('An explanation of why the rules were updated and what new patterns they are designed to detect.'),
});
export type UpdatePatternRulesOutput = z.infer<typeof UpdatePatternRulesOutputSchema>;

export async function updatePatternRules(
  input: UpdatePatternRulesInput
): Promise<UpdatePatternRulesOutput> {
  return updatePatternRulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'updatePatternRulesPrompt',
  input: {schema: UpdatePatternRulesInputSchema},
  output: {schema: UpdatePatternRulesOutputSchema},
  prompt: `You are an expert security analyst tasked with updating network traffic pattern detection rules.

You will analyze the provided network traffic data summary and identify potential new patterns or anomalies that are not currently covered by the existing rules.

Based on your analysis, you will generate an updated set of rules and provide a detailed explanation of the changes and their purpose.

Traffic Data Summary: {{{trafficDataSummary}}}
Current Rules: {{{currentRules}}}

Updated Rules: 
Explanation: `,
});

const updatePatternRulesFlow = ai.defineFlow(
  {
    name: 'updatePatternRulesFlow',
    inputSchema: UpdatePatternRulesInputSchema,
    outputSchema: UpdatePatternRulesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
