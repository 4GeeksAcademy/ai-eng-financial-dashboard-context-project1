export interface FacetsResponse {
  /** Available operation types: `income` or `outcome`. */
  operation_types: ('income' | 'outcome')[]
  /** Available business segments: `B2B` or `B2C`. */
  business_types: ('B2B' | 'B2C')[]
  /** Available category values returned by the API. */
  categories: ('suppliers' | 'sales' | 'operational' | 'administrative' | 'others')[]
  /** Earliest available movement date, formatted as `YYYY-MM-DD`. */
  min_date: string
  /** Latest available movement date, formatted as `YYYY-MM-DD`. */
  max_date: string
}

export interface AlertEntry {
  /** Alert period; formatted as `YYYY-MM-DD` (day), `YYYY-Www` (week), or `YYYY-MM` (month). */
  period: string
  /** Outcome amount recorded for the alert period. */
  outcome_total: number
  /** Average outcome amount for preceding periods. */
  baseline_average: number
  /** Relative increase over the baseline, represented as a number. */
  increase_ratio: number
}

export type AlertsResponse = AlertEntry[]

export interface CategoryEntry {
  /** Category associated with the aggregated amount. */
  category: 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'
  /** Operation type used for the aggregation: `income` or `outcome`. */
  operation_type: 'income' | 'outcome'
  /** Sum of amounts for this category and operation type. */
  total_amount: number
}

export type TopCategoriesResponse = CategoryEntry[]

export interface FinancialMovement {
  /** Movement date, formatted as `YYYY-MM-DD`. */
  create_date: string
  /** Movement amount. */
  amount: number
  /** Movement type: `income` or `outcome`. */
  operation_type: 'income' | 'outcome'
  /** Category assigned to the movement. */
  category: 'suppliers' | 'sales' | 'operational' | 'administrative' | 'others'
  /** Business segment assigned to the movement: `B2B` or `B2C`. */
  business_type: 'B2B' | 'B2C'
}
