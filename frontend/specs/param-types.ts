/** Date range fields requested by the PM brief. */
export interface DateRangeFilter {
  /** Inclusive start date in `YYYY-MM-DD` format. */
  startDate?: string
  /** Inclusive end date in `YYYY-MM-DD` format. */
  endDate?: string
}

/** Query parameters for filtering anomaly alerts. */
export interface AlertsParams extends DateRangeFilter {
  /** Minimum increase ratio, from 0.01 to 1.0; defaults to `0.3`. */
  threshold?: number
  /** Period grouping for alerts. */
  group_by?: 'day' | 'week' | 'month'
  /** Business segment to filter by. */
  business_type?: 'B2B' | 'B2C'
}

/** Query parameters for retrieving top categories. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Operation to rank; defaults to `income` per the PM brief. */
  operation?: string
  /** Maximum number of categories; defaults to `5`. */
  limit?: number
  /** Business segment to filter by: `B2B` or `B2C`. */
  business_type?: 'B2B' | 'B2C'
}
