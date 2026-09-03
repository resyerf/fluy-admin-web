export interface UsageMetric {
  metricCode: string;
  metricName: string;
  used: number;
  limit: string | null;
}
