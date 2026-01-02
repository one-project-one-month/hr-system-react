export interface ApiResponse<T> {
  isSuccess: boolean;
  isError: boolean;
  isValidationError: boolean;
  isSystemError: boolean;
  isDataError: boolean;
  isNotFound: boolean;
  isDuplicateRecord: boolean;
  isInvalidData: boolean;
  data: T;
  message: string;
}
