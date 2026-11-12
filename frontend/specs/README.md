# Contrato de datos del frontend

Este documento describe las tres funcionalidades del dashboard: selección de
intervalo de fechas, alertas de anomalías y comparación de categorías B2B/B2C.
Los endpoints pertenecen a la API FastAPI y se pueden consultar en Swagger en
`http://localhost:8000/docs` cuando el backend está en ejecución. Los tipos
TypeScript de este contrato están en [api-types.ts](./api-types.ts) y
[param-types.ts](./param-types.ts).

## 1. Intervalo de fechas

`DateRangeFilter` permite seleccionar fechas dentro de los límites disponibles
y compartirlas como filtro en las consultas de alertas y categorías.

### API y tipos

- `GET /api/metrics/facets` — obtiene las opciones y límites disponibles.
- Petición: `DateRangeFilter` en `param-types.ts`. `startDate` y `endDate` son
  opcionales y se convierten en parámetros de consulta al llamar a los
  endpoints filtrables.
- Respuesta: `FacetsResponse` en `api-types.ts`, con `operation_types`,
  `business_types`, `categories`, `min_date` y `max_date`.

### Valores y restricciones

- Las fechas usan `YYYY-MM-DD` y son inclusivas.
- `min_date` y `max_date` de la respuesta delimitan el intervalo disponible
  en el selector.
- Se puede enviar solo una fecha. Si no se selecciona ninguna, se omiten ambos
  parámetros y no se aplica filtro temporal.

### Casos límite

- Sin fecha de inicio ni de fin, no se envía filtro de fechas.
- Con solo una fecha, se filtra desde esa fecha o hasta esa fecha,
  respectivamente; se omite el parámetro ausente.
- Si la fecha inicial es posterior a la final, la UI debe marcar el intervalo
  como inválido y no enviarlo. Si aun así se consulta la API, el filtro
  inclusivo no encontrará movimientos que satisfagan ambos límites.
- Si falla `GET /api/metrics/facets`, mostrar un error de carga; no sustituir
  silenciosamente los límites por fechas inventadas.

## 2. Alertas de anomalías

`AnomaliesTable` presenta alertas de aumentos de gastos agregados por día,
semana o mes.

### API y tipos

- `GET /api/metrics/alerts`
- Petición: `AlertsParams` en `param-types.ts`. Acepta fechas, `threshold`,
  `group_by` y `business_type`.
- Respuesta: `AlertsResponse` (lista de `AlertEntry`) en `api-types.ts`. Cada
  alerta incluye `period`, `outcome_total`, `baseline_average` e
  `increase_ratio`. `increase_ratio` es una proporción numérica; multiplícala
  por 100 solo para mostrar un porcentaje.

### Valores y restricciones

- `group_by`: `day`, `week` o `month`; predeterminado `month`.
- `business_type`: `B2B` o `B2C`; es opcional.
- La UI limita `threshold` al intervalo `0.01`–`1.0`, con valor predeterminado
  `0.3`. La API establece `0` como mínimo, pero no aplica el máximo ni el
  mínimo de la interfaz.
- Las fechas son opcionales, inclusivas y usan `YYYY-MM-DD`.

### Casos límite

- Una respuesta vacía (`[]`) significa que no se detectaron anomalías; mostrar
  **“No se detectaron anomalías para el rango y los filtros seleccionados.”**
- Si falla la petición, mostrar un error diferenciado del estado sin
  anomalías; no presentar el fallo como una lista vacía.
- El backend no genera una alerta cuando el promedio de referencia es cero.
- Si el usuario ingresa un `threshold` fuera del intervalo de la UI, validarlo
  antes de enviar la consulta.

## 3. Comparación de categorías B2B/B2C

`B2BvsB2CPanels` muestra las categorías con mayor importe de cada segmento.
La interfaz hace una consulta por segmento para mantener estados y resultados
independientes.

### API y tipos

- `GET /api/metrics/categories/top` — llamar una vez con
  `business_type=B2B` y otra con `business_type=B2C`.
- Petición: `TopCategoriesParams` en `param-types.ts`; comparte el intervalo
  de fechas y admite `operation`, `limit` y `business_type`.
- Respuesta: `TopCategoriesResponse` (lista de `CategoryEntry`) en
  `api-types.ts`. Cada elemento contiene `category`, `operation_type` y
  `total_amount`.

### Valores y restricciones

- Para esta comparación, enviar siempre `operation_type=income` en ambas
  consultas. Aunque el tipo de petición del frontend usa `operation`, la API
  espera `operation_type` y su valor predeterminado es `outcome`.
- El backend admite `income` o `outcome`; `limit` es un entero entre `1` y
  `20`, predeterminado `5`.
- `business_type` admite `B2B` o `B2C`. Las fechas opcionales usan
  `YYYY-MM-DD` y son inclusivas.
- Las categorías devueltas son `suppliers`, `sales`, `operational`,
  `administrative` y `others`.

### Casos límite

- Si una respuesta es `[]`, conservar su panel y mostrar el mensaje de vacío
  de ese segmento: **“No hay categorías para B2B en el rango seleccionado.”**
  o **“No hay categorías para B2C en el rango seleccionado.”**
- Si ambas respuestas están vacías, conservar los dos paneles y mostrar el
  mensaje correspondiente en cada uno.
- Si falla la consulta de un segmento, mostrar el error en ese panel y
  conservar el resultado del otro si su consulta tuvo éxito; no confundir un
  error con una lista vacía.
- Si `limit` queda fuera del intervalo `1`–`20`, validarlo antes de la
  petición; la API rechaza valores fuera de ese rango.

## Notas de integración con el backend

- **Fechas:** convertir `startDate` y `endDate` a los parámetros HTTP
  `start_date` y `end_date`. Omitir los que no estén definidos; no enviar
  cadenas vacías.
- **Operación:** convertir `operation` a `operation_type`. Para la vista
  comparativa, forzar y enviar `income` explícitamente, ya que el backend
  predetermina `outcome`.
- **Threshold:** validar en la UI que el valor esté entre `0.01` y `1.0`
  (incluidos) y usar `0.3` como predeterminado. El backend solo impone
  `threshold >= 0`, por lo que la restricción del producto debe aplicarse en
  el frontend.
