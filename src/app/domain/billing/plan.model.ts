export interface PlanFeature {
  featureCode: string;
  featureName: string;
  featureType: string;
  value: string;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
  features: PlanFeature[];
}
