interface DecodedToken {
  sub: string;
  email: string;
  exp: number;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    return decoded;
  } catch {
    return null;
  }
}

export function isExpired(decoded: DecodedToken | null): boolean {
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now(); // exp is in seconds, Date.now() in ms
}
