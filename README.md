# Food Store

Trabajo Práctico Integrador · Programación 4 · Tecnicatura Universitaria en Programación a Distancia (UTN)

Aplicación web de pedidos de comida. Backend con FastAPI + SQLModel y frontend con React + TypeScript.

- **Autor:** Cornejo Diego
- **Repositorio:** - https://github.com/Docogdiego21/food-store-tpi
- **Video de demostración:** https://youtu.be/bb_zjuaVfk4

## Qué incluye

- Autenticación con JWT en cookie HttpOnly y dos roles (`user` y `admin`).
- Catálogo con categorías y productos, búsqueda, filtro por categoría y paginación en el servidor.
- Carrito persistido en el navegador y checkout con dirección de entrega y forma de pago.
- Pedidos con máquina de 4 estados (`PENDIENTE`, `EN_PREPARACION`, `ENTREGADO`, `CANCELADO`), descuento de stock al crear el pedido y restitución al cancelar, todo dentro de una única transacción (Unit of Work).
- Panel de administración: resumen, ABM de categorías y productos (con cambio de stock y disponibilidad), gestión de pedidos y de usuarios.
- API documentada en `/docs` y `/redoc`.

## Requisitos

- Python 3.11 a 3.13 (SQLModel 0.0.22 no funciona con 3.14)
- PostgreSQL 15 o superior (para desarrollo local también se puede usar SQLite)
- Node.js 20.19 o superior
- pnpm 9 o superior (`npm install -g pnpm`)

## Backend

Desde la carpeta `backend/`:

```bash
python -m venv venv
# Windows (PowerShell)
venv\Scripts\Activate.ps1
# Windows (cmd): venv\Scripts\activate.bat
# Linux / macOS: source venv/bin/activate

pip install -r requirements.txt
```

Crear el archivo `.env` a partir del ejemplo:

```bash
# Windows
copy .env.example .env
# Linux / macOS
cp .env.example .env
```

Crear la base en PostgreSQL (por ejemplo `foodstore_db`) y ajustar `DATABASE_URL` en `.env`. Para probar rápido sin PostgreSQL se puede usar `DATABASE_URL=sqlite:///./foodstore.db`.

Cargar los datos iniciales (es idempotente, se puede correr varias veces) y levantar la API:

```bash
python -m app.db.seed
uvicorn app.main:app --reload
```

La API queda en `http://localhost:8000/api/v1` y la documentación en `http://localhost:8000/docs` y `http://localhost:8000/redoc`. Las tablas se crean automáticamente al iniciar.

### Variables de entorno del backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `DATABASE_URL` | Conexión a la base | `postgresql://user:pass@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Firma del JWT (mínimo 32 caracteres) | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración de la cookie y del token | `30` |
| `FRONTEND_ORIGIN` | Origen permitido en CORS | `http://localhost:5173` |

## Frontend

Desde la carpeta `frontend/`:

```bash
pnpm install
# Windows: copy .env.example .env   |   Linux / macOS: cp .env.example .env
pnpm build   # verifica los tipos y genera el build
pnpm dev
```

La aplicación queda en `http://localhost:5173`.

### Variables de entorno del frontend (`frontend/.env`)

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api/v1` |

## Usuario del seed

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin` | `Admin1234!` | `admin` |

El seed también carga 4 categorías y 12 productos con stock. Los clientes se crean desde la pantalla de registro (rol `user`).

## Estructura

```
backend/
  app/
    main.py
    core/            config, database, security, deps, unit_of_work, base_repository
    modules/
      auth/          router, service, schemas
      usuarios/      models, schemas, repository, unit_of_work, service, router
      categorias/    models, schemas, repository, unit_of_work, service, router
      productos/     models, schemas, repository, unit_of_work, service, router
      pedidos/       models, schemas, repository, unit_of_work, service, router
    db/seed.py
frontend/
  src/
    shared/          api, ui, components, layout, utils
    features/        auth, categorias, productos, usuarios, pedidos
    store/           authStore, cartStore
    routes/          AppRouter, ProtectedRoute
```

## Endpoints principales (`/api/v1`)

| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/auth/register`, `/auth/token`, `/auth/logout` | Público |
| GET | `/auth/me` | Sesión |
| GET | `/admin/usuarios` | admin |
| POST | `/admin/usuarios/{id}/activar`, `/admin/usuarios/{id}/desactivar` | admin |
| GET | `/categorias`, `/categorias/{id}` | Público |
| POST, PUT, DELETE | `/categorias`, `/categorias/{id}` | admin |
| GET | `/productos` (`skip`, `limit`, `search`, `categoria_id`, `disponible`), `/productos/{id}` | Público |
| POST, PUT, DELETE | `/productos`, `/productos/{id}` | admin |
| PATCH | `/productos/{id}/stock` | admin |
| POST, GET | `/pedidos` | Sesión |
| GET | `/pedidos/resumen` | admin |
| GET | `/pedidos/{id}` | Dueño o admin |
| PATCH | `/pedidos/{id}/estado` | admin |
| PATCH | `/pedidos/{id}/cancelar` | Dueño |
