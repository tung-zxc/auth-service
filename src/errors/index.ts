import { AuthServiceError } from "./AuthServiceError";

export const ErrorCodes = {
  UnknownError: 0,
  AuthenticationError: 1
};

export const UnknownError = () =>
  new AuthServiceError(ErrorCodes.UnknownError, "Unknown Error");
export const AuthenticationError = () =>
  new AuthServiceError(ErrorCodes.AuthenticationError, "Authentication Error");

export { AuthServiceError };
