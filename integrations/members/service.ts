/** Auth stub — Wix member auth removed. Extend this if custom auth is needed later. */
export const MemberService = {
  getCurrentMember: async () => null,
  login: async () => { throw new Error("Auth not implemented"); },
  logout: async () => {},
};
