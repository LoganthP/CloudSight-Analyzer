'use client';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { analyzeAnomalyAction, type AnomalyAnalysisState } from '@/app/alerts/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import { getSeverityBadge } from './anomaly-list';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Bot className="mr-2 h-4 w-4" />
      )}
      Analyze with AI
    </Button>
  );
}

export default function AnomalyAnalysis() {
  const { toast } = useToast();
  const initialState: AnomalyAnalysisState = { data: null, error: null };
  const [state, formAction] = useActionState(analyzeAnomalyAction, initialState);

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
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Analyze Anomaly</CardTitle>
            <CardDescription>
              Paste or describe an anomaly to get an AI-powered analysis and mitigation steps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Label htmlFor="anomaly-data">Anomaly Data</Label>
            <Textarea
              id="anomaly-data"
              name="anomalyData"
              placeholder="e.g., Port scan detected from 198.51.100.12 across a range of ports."
              className="min-h-[120px] font-code"
              required
            />
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-primary" />
            AI Analysis
          </CardTitle>
          <CardDescription>The AI's assessment will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.data ? (
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Suggested Severity
                </Label>
                <Badge
                  variant={getSeverityBadge(state.data.suggestedSeverity)}
                  className="mt-2 text-sm"
                >
                  {state.data.suggestedSeverity}
                </Badge>
              </div>
              <div>
                <Label>Analysis</Label>
                <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                  {state.data.analysis.trim()}
                </div>
              </div>
              <div>
                <Label>Recommended Actions</Label>
                <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                  {state.data.recommendedActions.trim()}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
              <Bot className="h-12 w-12" />
              <p className="mt-4 max-w-sm">
                Your analysis will appear here once you submit an anomaly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
