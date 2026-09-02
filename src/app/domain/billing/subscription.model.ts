export interface Subscription {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantSubdomain: string;
  planCode: string;
  planName: string;
  status: string;
  startDate: string;
  trialEndsAt: string | null;
  endDate: string | null;
}
