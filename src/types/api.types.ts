export interface ApiSuccessResponse<TData = unknown> {
 success : boolean;
  message: string;
  data: TData;
}

export interface ApiErrorResponse {
  success : boolean;
  message: string;
}
