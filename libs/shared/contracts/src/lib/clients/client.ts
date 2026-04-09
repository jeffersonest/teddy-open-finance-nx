/**
 * Client as exposed over the HTTP API (wire format).
 *
 * The back-end domain entity uses real `Date` objects internally; this
 * contract describes the JSON shape that actually crosses the network,
 * so dates are ISO 8601 strings.
 */
export interface Client {
  id: string;
  name: string;
  /** Monthly salary in BRL. */
  salary: number;
  /** Estimated company valuation in BRL. */
  companyValuation: number;
  /**
   * Number of times this client has been "selected" / accessed.
   * Incremented by the back-end on detail-view interactions.
   */
  accessCount: number;
  /** ISO 8601 timestamp. */
  createdAt: string;
  /** ISO 8601 timestamp. */
  updatedAt: string;
}
