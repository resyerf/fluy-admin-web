export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  status: string;
  createdAt: string;
}

export interface ProvisionTenantResult {
  tenantId: string;
  masterUserId: string;
  activationEmailSent: boolean;
  subscriptionId: string;
  planCode: string;
  trialEndsAt: string;
}
