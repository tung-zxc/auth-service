import { AuthServiceError } from ".";

export const UnknownErrorCode = 0;
export const UnknownError = () =>
  new AuthServiceError(UnknownErrorCode, "Unknown Error");
