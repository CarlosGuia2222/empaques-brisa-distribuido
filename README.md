# Empaques Brisa - Sistema Distribuido

Proyecto React + Firebase + Middleware Express + nodos procesadores para cotizaciones de empaques.

## Puertos

- Frontend: http://localhost:5173
- Middleware: http://localhost:4000
- Nodo 1: http://localhost:4001
- Nodo 2: http://localhost:4002
- Nodo 3: http://localhost:4003

## Instalación

Antes de instalar, usa el registro público de npm:

```bash
npm config set registry https://registry.npmjs.org/
```

Después, desde la raíz del proyecto:

```bash
npm run install:all
```

## Ejecutar todo

```bash
npm run dev:all
```

## Ejecutar por separado para demo

Terminal 1:

```bash
cd frontend
npm run dev
```

Terminal 2:

```bash
cd middleware
npm run dev
```

Terminal 3:

```bash
cd nodos
npm run nodo1
```

Terminal 4:

```bash
cd nodos
npm run nodo2
```

Terminal 5:

```bash
cd nodos
npm run nodo3
```

Para demostrar tolerancia a fallos, cierra solo la terminal del nodo 3 con `Ctrl + C`, actualiza Monitoreo y genera una nueva cotización.

## Firebase necesario

En Firebase Authentication crea usuarios con correo y contraseña.

En Firestore crea la colección `users`. Lo recomendable es que el ID del documento sea el UID del usuario.

Ejemplo admin:

```js
{
  nombre: "Administrador",
  email: "admin@brisa.com",
  role: "admin",
  activo: true
}
```

Ejemplo empleado:

```js
{
  nombre: "Empleado Demo",
  email: "empleado1@brisa.com",
  role: "empleado",
  activo: true
}
```

Roles válidos: `admin` y `empleado`.

## Mejoras incluidas

- Diseño premium renovado.
- Logo animado de Empaques Brisa.
- Login con panel visual de sistema distribuido.
- Animaciones suaves en tarjetas, nodos, botones y métricas.
- Navbar con estado activo.
- Dashboards mejorados para admin y empleado.
- Middleware con Round Robin y failover.
- Monitoreo real de nodos.
- Cotizaciones procesadas por nodos disponibles.
