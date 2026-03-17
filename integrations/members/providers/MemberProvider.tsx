import type { ReactNode } from "react";
import { MemberContext } from "./MemberContext";

interface Props {
  children: ReactNode;
}

/**
 * MemberProvider — Wix auth removed.
 * This is now a simple passthrough that provides a null member context.
 * The Router wraps the app in this provider; removing it would require
 * editing Router.tsx, so we keep the shape identical.
 */
export function MemberProvider({ children }: Props) {
  return (
    <MemberContext.Provider value={{ member: null, isLoading: false }}>
      {children}
    </MemberContext.Provider>
  );
}
