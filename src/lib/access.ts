// Centralized role-based access and feature gating

export type Role = "admin" | "user";

export type FeatureKey =
  | "viewDashboard"
  | "viewResults"
  | "viewReports"
  | "usePrompt"
  | "managePlan"
  | "useUploads"
  | "useAccountList";

export type SubscriptionTier =
  | "FREE"
  | "STARTER"
  | "PROFESSIONAL"
  | "ENTERPRISE";

export type AccessContext = {
  isAuthenticated: boolean;
  role: Role;
  subscriptionType?: SubscriptionTier | null;
  subscribedAt?: string | null;
  isYearly?: boolean;
};

// Feature matrix per role
const roleFeatureMatrix: Record<Role, Partial<Record<FeatureKey, boolean>>> = {
  admin: {
    viewDashboard: true,
    viewResults: true,
    viewReports: true,
    usePrompt: true,
    managePlan: false, // admins do not see plan & payments in current UX
    useUploads: true,
    useAccountList: true,
  },
  user: {
    viewDashboard: true,
    viewResults: true,
    viewReports: true,
    usePrompt: false,
    managePlan: true,
    useUploads: true,
    useAccountList: false,
  },
};

// Subscription gating for features that depend on plan/validity
// true => allowed, false => blocked
const subscriptionGates: Partial<
  Record<FeatureKey, (ctx: AccessContext) => boolean>
> = {
  useUploads: (ctx) => isSubscriptionActive(ctx),
};

export function deriveRole(isAdmin?: boolean | null): Role {
  return isAdmin ? "admin" : "user";
}

export function isSubscriptionActive(ctx: AccessContext): boolean {
  const { role, subscriptionType, subscribedAt, isYearly } = ctx;
  if (role === "admin") return true;
  if (!subscriptionType || subscriptionType === "FREE") return false;
  if (!subscribedAt) return false;
  const start = new Date(String(subscribedAt));
  const durationDays = isYearly ? 360 : 30;
  const expiry = new Date(start);
  expiry.setDate(start.getDate() + durationDays);
  return new Date() <= expiry;
}

export function canUseFeature(
  feature: FeatureKey,
  ctx: AccessContext
): boolean {
  if (!ctx.isAuthenticated) return false;
  const base = !!roleFeatureMatrix[ctx.role]?.[feature];
  if (!base) return false;
  const gate = subscriptionGates[feature];
  return gate ? gate(ctx) : true;
}

export function shouldShowNavItem(name: string, ctx: AccessContext): boolean {
  // Map nav labels to features
  switch (name) {
    case "Overview":
      return canUseFeature("viewDashboard", ctx);
    case "Results":
      return canUseFeature("viewResults", ctx);
    case "Reports":
      return canUseFeature("viewReports", ctx);
    case "Prompt":
      return canUseFeature("usePrompt", ctx);
    case "Plan & Payments":
      return canUseFeature("managePlan", ctx);
    case "Accounts":
      return canUseFeature("useAccountList", ctx);
    default:
      return true;
  }
}

export function buildAccessContext(params: {
  isAuthenticated: boolean;
  isAdmin?: boolean | null;
  subscriptionType?: string | null;
  subscribedAt?: string | null;
  isYearly?: boolean;
}): AccessContext {
  return {
    isAuthenticated: params.isAuthenticated,
    role: deriveRole(params.isAdmin ?? false),
    subscriptionType:
      (params.subscriptionType as SubscriptionTier | undefined) ?? null,
    subscribedAt: params.subscribedAt ?? null,
    isYearly: params.isYearly,
  };
}

// ----------------------------
// Upload limits per subscription
// ----------------------------

const perPlanMaxFiles: Partial<Record<SubscriptionTier, number>> = {
  FREE: 0,
  STARTER: 5,
  PROFESSIONAL: 10,
  //   ENTERPRISE: unlimited
};

export function getMaxFilesPerUpload(ctx: AccessContext): number | null {
  if (ctx.role === "admin") return null; // unlimited
  if (!ctx.subscriptionType) return 0;
  if (ctx.subscriptionType === "ENTERPRISE") return null; // unlimited
  return perPlanMaxFiles[ctx.subscriptionType] ?? 0;
}

export function isUploadCountAllowed(
  count: number,
  ctx: AccessContext
): boolean {
  const max = getMaxFilesPerUpload(ctx);
  if (max === null) return true; // unlimited
  return count <= max;
}

export function buildUploadLimitError(
  count: number,
  ctx: AccessContext
): string | null {
  if (ctx.role === "admin") return null;
  const tier = ctx.subscriptionType ?? "STARTER";
  if (tier === "ENTERPRISE") return null;
  const max = getMaxFilesPerUpload(ctx);
  if (max === null || count <= (max ?? 0)) return null;
  if (tier === "FREE")
    return "You can't upload charts on the FREE plan. Please upgrade your plan.";
  return `You can't upload more than ${max} charts. Please upgrade your plan.`;
}
