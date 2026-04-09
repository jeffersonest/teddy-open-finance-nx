/**
 * Standard envelope returned by every paginated endpoint.
 *
 * @template T - The type of each item in the page.
 */
export interface Paginated<T> {
  data: T[];
  /** Total number of items across all pages. */
  total: number;
  /** Current page (1-based). */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of pages, derived from `total` and `pageSize`. */
  totalPages: number;
}
