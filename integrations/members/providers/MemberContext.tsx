import { createContext, useContext } from "react";
import type { Member } from "../types";

interface MemberContextValue {
  member: Member | null;
  isLoading: boolean;
}

export const MemberContext = createContext<MemberContextValue>({
  member: null,
  isLoading: false,
});

export function useMember() {
  return useContext(MemberContext);
}
