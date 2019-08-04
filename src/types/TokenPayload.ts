export interface TokenPayload {
  tokenId: string;
  userId: string;
  username: string;
  iat: number;
}

export function isTokenPayload(v: any): v is TokenPayload {
  if (typeof v !== "object") return false;
  if (typeof v.tokenId !== "string") return false;
  if (typeof v.userId !== "string") return false;
  if (typeof v.username !== "string") return false;
  if (typeof v.iat !== "number") return false;
  return true;
}
