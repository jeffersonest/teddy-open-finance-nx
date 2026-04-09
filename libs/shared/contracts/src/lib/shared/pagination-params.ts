/**
 * Query-string params accepted by paginated endpoints.
 *
 * Both fields are optional so the back-end can apply sensible defaults
 * (typically `page=1` and `pageSize=20`).
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}
