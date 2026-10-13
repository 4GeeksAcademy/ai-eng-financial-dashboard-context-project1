# Hallazgos de ingeniería y reglas propuestas (Fase 2)

Estado: ✅ verificado · ❌ afirmación incorrecta · ❓ por verificar

## Hallazgos por categoría

### Arquitectura
| ID | Hallazgo | Evidencia | Estado |
|----|----------|-----------|--------|
| H1 | Todas las rutas de la API y el generador de datos mock viven en un solo archivo | `backend/app/routes.py` (rutas desde la línea 243; `generate_mock_movements` en la 94) | ✅ |
| H2 | `generate_mock_movements(seed=42)` se vuelve a llamar en cada ruta | `routes.py` líneas 255, 264, 277, 295, 311, 350, 370, 386 | ✅ |
| H3 | La semilla es fija, pero las fechas dependen de `date.today()`: importes repetibles, rango de fechas móvil | `routes.py:94-104` | ✅ |
| H4 | CORS permite todos los orígenes junto con credenciales | `backend/app/main.py` | ✅ |
| H5 | Los Dockerfiles solo corren en modo desarrollo (`--reload`, `npm run dev`) y exponen debugpy en `0.0.0.0:5678` | `backend/Dockerfile:12`, `frontend/Dockerfile:12` | ✅ |
| H6 | El proxy de Vite apunta fijo a `http://backend:8000` | `frontend/vite.config.ts:13` | ✅ |

### Documentación
| ID | Hallazgo | Evidencia | Estado |
|----|----------|-----------|--------|
| H7 | `AGENTS.md` ordena revisar `.agents/rules`, `.agents/skills` y `memory-bank`, y ninguna existía | `AGENTS.md`, búsqueda en el workspace | ✅ |
| H8 | El README dice que no hace falta configuración extra, pero en Codespaces el proxy dio 504 por `FORWARD DROP` en `iptables-legacy` | `README.md`, `verification.md` sección C | ✅ |
| H9 | El periodo "2024 - Full Year" está escrito a mano en dos sitios, con guiones distintos, y no coincide con los datos | `frontend/src/App.tsx:49`, `frontend/src/components/dashboard/dashboard-header.tsx:7` | ✅ |
| H10 | `GET /api/metrics/b2b` y `/b2c` existen pero no estaban en el resumen del agent | `routes.py:362`, `routes.py:378` | ✅ |

### Testing
| ID | Hallazgo | Evidencia | Estado |
|----|----------|-----------|--------|
| H11 | Vitest solo cubre `financial-utils` | `frontend/src/lib/financial-utils.test.ts` | ✅ |
| H12 | La afirmación inicial de que faltaban dependencias de test era incorrecta: `pytest-cov` y `httpx` sí están declaradas | `backend/requirements.txt`, líneas 4-6 | ❌ |
| H13 | Los tests del backend usan `TestClient`, que depende de `httpx`, y la suite pasa | `docker compose run --rm backend python -m pytest -q` → `15 passed, 1 warning in 0.52s` | ✅ |
| H14 | `conftest.py` solo ajusta `sys.path`, no define fixtures | `backend/tests/conftest.py` | ✅ |
| H20 | La ejecución de `pytest` terminó con una advertencia de obsolescencia relacionada con `httpx` y `starlette.testclient`; no se modifican dependencias en esta fase | `docker compose run --rm backend python -m pytest -q` → `15 passed, 1 warning in 0.52s`; conservar el texto exacto del warning en la evidencia de ejecución | ✅ |

### DX
| ID | Hallazgo | Evidencia | Estado |
|----|----------|-----------|--------|
| H15 | `mock-data.ts` no es importado por ningún archivo | `grep -rn "mock-data" frontend/src` vacío | ✅ |
| H16 | Las citas de línea del agent fueron incorrectas en varias afirmaciones | `verification.md` sección A | ✅ |
| H17 | El agent cambió la política de `iptables` del host sin pedir permiso | `verification.md` sección C | ✅ |
| H18 | El agent modificó archivos aunque se le pidió no hacerlo | `git diff` de `verification.md` (+29 líneas) | ✅ |
| H19 | El agent creó `.agents/rules/phase-2.md` en la fase equivocada (corresponde a la Fase 3) | `git status` lo mostró sin seguimiento | ✅ |

## Reglas propuestas

| Regla | Texto | Hecho que la respalda |
|-------|-------|-----------------------|
| R1 | Antes de depender de `.agents/rules` o `memory-bank` según `AGENTS.md`, comprobar que existen | H7 |
| R2 | No usar la configuración de los Dockerfiles ni de CORS para despliegue sin revisarla | H4, H5 |
| R3 | Al añadir rutas, reutilizar una única fuente de datos en vez de volver a llamar a `generate_mock_movements` | H2 |
| R4 | Toda etiqueta de periodo debe salir de los datos o de una constante única | H9 |
| R5 | Si el proxy da 504 en Codespaces, revisar la política `FORWARD` antes de tocar código | H8 |
| R6 | Verificar cada cita archivo:línea del agent con `grep -n` antes de aceptarla | H16 |
| R7 | El agent debe pedir permiso antes de cambiar configuración del sistema o archivos fuera de la tarea | H17, H18 |
| R8 | Tras cambiar `financial-utils.ts`, ejecutar `npm run test` en `frontend` | H11 |
| R9 | No conservar código sin referencias (como `mock-data.ts`) sin confirmarlo | H15 |
| R10 | Mantener cada fase en su propio commit y no crear archivos de una fase posterior | H19 |
