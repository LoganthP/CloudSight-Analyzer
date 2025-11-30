'use client';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getUpdatedRulesAction } from '@/app/actions';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { currentRules as initialRules } from '@/lib/mock-data';
import { Bot, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Bot className="mr-2 h-4 w-4" />
      )}
      Update Rules with AI
    </Button>
  );
}

export default function RulesPage() {
  const { toast } = useToast();
  const initialState = { data: null, error: null };
  const [state, formAction] = useActionState(getUpdatedRulesAction, initialState);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      <Header
        title="Pattern Detection Rule Engine"
        description="Leverage AI to adapt your security rules based on traffic analysis."
      />
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Ruleset</CardTitle>
            <CardDescription>This is the active set of detection rules.</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-code text-sm">
              {initialRules.trim()}
            </pre>
          </CardContent>
        </Card>

        <form action={formAction} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Traffic & Update Rules</CardTitle>
              <CardDescription>
                Provide a summary of recent traffic data to generate new rule suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="traffic-summary">Traffic Data Summary</Label>
                <Textarea
                  id="traffic-summary"
                  name="trafficDataSummary"
                  placeholder="e.g., High volume of traffic from new IP range 123.45.67.0/24 to port 8080..."
                  className="min-h-[120px] font-code"
                  required
                />
                <input type="hidden" name="currentRules" value={initialRules} />
              </div>
              <SubmitButton />
            </CardContent>
          </Card>

          {state.data && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary" />
                  AI-Generated Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Suggested Updated Rules</Label>
                  <pre className="whitespace-pre-wrap rounded-md bg-muted p-4 font-code text-sm">
                    {state.data.updatedRules.trim()}
                  </pre>
                </div>
                <div>
                  <Label>Explanation</Label>
                  <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                    {state.data.explanation.trim()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
