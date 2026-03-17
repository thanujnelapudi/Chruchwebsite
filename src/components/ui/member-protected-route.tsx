/**
 * MemberProtectedRoute — auth removed, always renders children.
 * Kept so any future import of this component doesn't break.
 */
import type { ReactNode } from "react";

interface MemberProtectedRouteProps {
  children: ReactNode;
  messageToSignIn?: string;
  messageToLoading?: string;
  signInTitle?: string;
  signInClassName?: string;
  loadingClassName?: string;
  signInProps?: object;
  loadingSpinnerProps?: object;
}

export function MemberProtectedRoute({ children }: MemberProtectedRouteProps) {
  return <>{children}</>;
}
