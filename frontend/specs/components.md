# Especificación de componentes

Tipos de referencia:

- Respuestas: `./api-types.ts`
- Parámetros: `./param-types.ts`

Los nombres de propiedades de los datos de respuesta deben conservarse tal como aparecen en esos tipos. Al formar las peticiones HTTP, `startDate` y `endDate` se mapean a `start_date` y `end_date`; `operation` se mapea a `operation_type`.

## `DateRangeFilter`

Control para seleccionar un intervalo de fechas y mostrar los límites disponibles.

### Props

- `value: DateRangeFilter` — **obligatoria**. Selección actual; `startDate` y `endDate` pueden estar sin definir.
- `facets: FacetsResponse` — **obligatoria**. Usa `min_date` y `max_date` (`YYYY-MM-DD`) como límites disponibles.
- `onChange: (value: DateRangeFilter) => void` — **obligatoria**. Notifica una nueva selección usando los nombres `startDate` y `endDate`.

### Comportamiento y renderizado condicional

- Con ambas fechas definidas, muestra el intervalo seleccionado y aplica ambos límites.
- Si el usuario ingresa **solo la fecha de inicio**, muestra: **“Sin fecha de fin: se mostrarán resultados desde {startDate} en adelante.”** Omite `end_date` al construir la petición.
- Si el usuario ingresa **solo la fecha de fin**, muestra: **“Sin fecha de inicio: se mostrarán resultados hasta {endDate}.”** Omite `start_date` al construir la petición.
- Si no hay ninguna fecha seleccionada, no aplica filtro de fechas.

## `AnomaliesTable`

Tabla de alertas de anomalías agrupadas por período.

### Props

- `alerts: AlertsResponse` — **obligatoria**. Lista de entradas `AlertEntry`.
- `params?: AlertsParams` — **opcional**. Parámetros activos para identificar el intervalo, agrupación y segmento aplicados.

### Comportamiento y renderizado condicional

- Para cada alerta muestra `period`, `outcome_total`, `baseline_average` e `increase_ratio`. Puede presentar `increase_ratio` como porcentaje, multiplicándolo por 100 para su visualización; el dato recibido sigue siendo una proporción numérica.
- Si `alerts` está vacío, muestra textualmente: **“No se detectaron anomalías para el rango y los filtros seleccionados.”**
- Si `params` no está definido, muestra la tabla sin resumen de filtros.
- `threshold` debe validarse en la UI entre `0.01` y `1.0`, con valor predeterminado `0.3`, según el brief del PM.

## `B2BvsB2CPanels`

Vista comparativa con un panel de categorías top para cada segmento.

### Props

- `b2bCategories: TopCategoriesResponse` — **obligatoria**. Lista de categorías para B2B.
- `b2cCategories: TopCategoriesResponse` — **obligatoria**. Lista de categorías para B2C.
- `params?: TopCategoriesParams` — **opcional**. Parámetros compartidos de período, operación y límite.

### Comportamiento y renderizado condicional

- Renderiza ambos paneles, B2B y B2C, y muestra en cada entrada `category`, `operation_type` y `total_amount`.
- La comparativa debe usar `income`: si no se especifica `params.operation`, el frontend lo fuerza a `income`. En la petición al backend se envía como `operation_type=income`.
- Si `b2bCategories` está vacía, mantiene visible el panel B2B y muestra en él: **“No hay categorías para B2B en el rango seleccionado.”** El panel B2C se renderiza normalmente si tiene datos.
- Si `b2cCategories` está vacía, mantiene visible el panel B2C y muestra en él: **“No hay categorías para B2C en el rango seleccionado.”** El panel B2B se renderiza normalmente si tiene datos.
- Si ambas listas están vacías, muestra el estado vacío correspondiente dentro de cada panel; no oculta ni elimina la comparación.
- `TopCategoriesParams.operation` usa `income` según el brief; el backend actual recibe `operation_type` y su valor predeterminado es `outcome`, por lo que la petición debe enviar `operation_type=income` explícitamente para esta vista.
