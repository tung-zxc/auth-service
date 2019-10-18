export interface TokenPayload {
  tokenId: string;
}

export function isTokenPayload(v: any): v is TokenPayload {
  if (typeof v !== "object") return false;
  if (typeof v.tokenId !== "string") return false;
  return true;
}
