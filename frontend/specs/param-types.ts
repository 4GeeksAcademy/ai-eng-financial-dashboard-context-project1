/** Date range fields requested by the PM brief. */
export interface DateRangeFilter {
  /** Inclusive start date in `YYYY-MM-DD` format. Nota: Mapear a start_date y end_date en la petición HTTP al backend. */
  startDate?: string
  /** Inclusive end date in `YYYY-MM-DD` format. Nota: Mapear a start_date y end_date en la petición HTTP al backend. */
  endDate?: string
}

/** Query parameters for filtering anomaly alerts. */
export interface AlertsParams extends DateRangeFilter {
  /** Minimum increase ratio, from 0.01 to 1.0; defaults to `0.3`. La UI limitará el valor entre 0.01 y 1.0 (por defecto 0.3) según los requisitos del PM. La API acepta valores más amplios, pero la validación de la UI restringe el rango. */
  threshold?: number
  /** Period grouping for alerts. */
  group_by?: 'day' | 'week' | 'month'
  /** Business segment to filter by. */
  business_type?: 'B2B' | 'B2C'
}

/** Query parameters for retrieving top categories. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Operation to rank; defaults to `income` per the PM brief. Se envía al backend como operation_type. Ojo: el backend por defecto usa outcome, pero nuestro frontend debe forzar income para la comparativa B2B/B2C. */
  operation?: string
  /** Maximum number of categories; defaults to `5`. */
  limit?: number
  /** Business segment to filter by: `B2B` or `B2C`. */
  business_type?: 'B2B' | 'B2C'
}
