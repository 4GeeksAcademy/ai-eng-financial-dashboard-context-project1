# Verificación del handover (Fase 1)

Leyenda: ✅ verificada en código · ❌ incorrecta (corregida) · ❓ sin verificar

## A. Resumen generado por el agent

| ID | Afirmación del agent (resumen) | Estado |
|----|--------------------------------|--------|
| A5, A6 | Archivos de `backend/app` y `backend/tests` | ✅ |
| A7, A8 | Estructura de carpetas del frontend | ✅ (verificado con `ls`) |
| A9, A10, A13 | Dos servicios en Compose, puertos 8000, 5678 y 5173 | ✅ |
| A11, A14 | `CMD` de backend (Uvicorn + debugpy) y frontend (`npm run dev`) | ✅ contenido · ❌ cita: es la línea 12, no la 10 |
| A12, A20 | `app` en `main.py`; CORS con `allow_origins=["*"]` | ✅ |
| A16 | `docker compose up --build` | ✅ · ❌ cita: línea 42 de ambos README, no la 38 |
| A17, A18, A19 | Peticiones a `/api/metrics`, proxy de Vite a `backend:8000`, red bridge por defecto | ✅ |
| A21 a A27 | Rutas `/health`, `/api/metrics`, `facets`, `summary`, `categories/top`, `comparison`, `alerts` | ✅ existen · ❌ citas: reales 243, 248, 262, 268, 287, 305, 342 · ❓ comportamiento sin revisar |
| A28 | Datos mock con `seed=42` | ✅ semilla fija; fechas relativas a hoy (`date.today()`) |
| A29 | `mock-data.ts` no se usa | ✅ ningún archivo lo importa |
| A30, A42 | Sin base de datos ni Makefile | ✅ |
| A31 a A37 | Scripts de `package.json` | ✅ |
| A38 | Tests de `financial-utils` con Vitest | ✅ |
| A41 | `conftest.py` con "fixtures" | ✅ existe · ❌ solo configura `sys.path`, no hay fixtures |
| A4 | Estructura del backend según `README.md:27-38` | ✅ contenido · ❌ la cita no lo respalda |
| A39 | Dependencias de test: `pytest`, `pytest-cov`, `httpx` | ✅ `requirements.txt` las incluye (primera lectura incorrecta por salida de terminal incompleta; corregida) |
| A1, A2, A3, A15, A40 | Contenido de `App.tsx`, `financial-utils.ts`, `main.tsx`, `test_routes.py` | ❓ sin verificar |

## B. Verificaciones ya realizadas

| Afirmación | Cómo se verificó | Estado |
|------------|------------------|--------|
| Hay dos servicios: frontend (Vite, :5173) y backend (FastAPI/Uvicorn, :8000) | `docker-compose.yml`, `CMD` de ambos Dockerfile, logs de arranque | ✅ |
| El puerto 5678 es Debugpy (no n8n) | `CMD` de `backend/Dockerfile` | ✅ |
| No hay base de datos | Compose solo define 2 servicios; datos de ejemplo del backend | ✅ |
| `.env.example` no existe | `Ctrl+P` lo encontró en `frontend/.env.example` | ❌ Corregida: existe en `frontend/` |
| `VITE_API_BASE_URL` no está documentada | El propio `.env.example` y el README la documentan (opcional, vacía = usa proxy) | ❌ Corregida |
| `.agents/rules`, `.agents/skills` y `memory-bank` existen | El agent no los encontró; `AGENTS.md` los pide | ✅ No existen |
| Existe `GET /health` y devuelve `{"status":"ok"}` | Navegador y `curl` | ✅ |
| README: "funciona sin variables extra en local y Codespaces" | `docker compose up` → dashboard con error, `/api/metrics` da 504 | ❌ No se cumple en este Codespace sin el ajuste de la sección C |
| La etiqueta "2024 - Full Year" está escrita a mano | `grep`: `App.tsx:49` y `dashboard-header.tsx:7` | ✅ |
| Los datos del backend cubren 2025-10 a 2026-09 | JSON de la API | ✅ |
| Los datos se generan relativos a la fecha actual | `backend/app/routes.py`: `generate_mock_movements` usa `date.today()` | ✅ |
| Existen tests con Vitest para `financial-utils` | `financial-utils.test.ts` | ✅ |

## C. Incidente de entorno: 504 frontend → backend

- Síntoma: dashboard con "No se pudo cargar la informacion financiera"; `/api/metrics` devuelve 504 tras ~2 min.
- Evidencia: ambos contenedores `Up`; `getent hosts backend` → `172.18.0.2`; desde el frontend, `wget` a `backend:8000` y a `172.18.0.2:8000` da timeout; desde el backend, `localhost:8000` y su IP responden 200; `docker compose down && up --build` no lo resolvió.
- Causa (diagnóstico del agent, con prueba empírica): política `FORWARD` en `DROP` en `iptables-legacy` del host de Codespaces. Con `FORWARD ACCEPT` el `wget` respondió `{"status":"ok"}`.
- Solución aplicada: `sudo iptables-legacy -P FORWARD ACCEPT`. No toca el repo y no persiste al reiniciar el Codespace.
- Observación: el agent cambió la política de iptables como experimento sin pedir permiso explícito.
- No verificado: que `docker0` sea la única interfaz con reglas ACCEPT (afirmación del agent).

## D. Hallazgo de ingeniería (para Fase 2)

- El periodo del header está fijo en dos sitios y no refleja el rango de los datos.
- Corrección (tras el commit de la Fase 1): A39 estaba mal marcada; `cat -A backend/requirements.txt` confirma las seis dependencias. La causa fue una salida de terminal incompleta, no un error del agent.
