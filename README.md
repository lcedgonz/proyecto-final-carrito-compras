# Carrito de compras usando Node.js, Express.js y PostgreSQL

Este es el proyecto final para la asignatura de Programación Web en la PUCMM. 
El objetivo del proyecto es implementar una aplicación de carro de compras utilizando PostgreSQL y Express.js para el backend.


## Autores

- Nayely Domínguez
- Laura Cedano

## Requisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)

## Instalación

### Clonar el repositorio:
```bash
git clone https://github.com/lcedgonz/proyecto-final-carrito-compras.git
cd proyecto-final-carrito-compras
```
### Instala las dependencias necesarias:
```bash
npm install
```
### Configura el entorno:
Crea un archivo .env en la raíz del proyecto con las siguientes variables de entorno:
```bash
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_psswrd_de_postgres
DB_NAME=shopping_cart
DB_PORT=5432
SESSION_SECRET=tu_session_secret
```
Puedes generar un session secret usando node.js si quieres con el siguiente código:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
```

La cadena de caracteres que te devuelva sería tu session_secret.
Esto servirá para que Express.js firme y asegure las sesiones de usuario en la web app, y que así se evite manipular estas sesiones de usuario, dando mayor seguridad.

### Configuración de la base de datos

1. Inicia sesión en PostgreSQL:

```bash
psql -U postgres
```
2. Crea la base de datos:

```bash
CREATE DATABASE shopping_cart;
\c shopping_cart
```

3. Crea las tablas necesarias:

```bash
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL
);
```
Hay más tablas, pero esas se irán creando con la necesidad.

4. Inicia la web app.

## Comentarios de los autores
### ¡Hola, soy Laura!
Hey, eh. Este proyecto tomó algo de tiempo y esfuerzo.
Sin embargo, esperamos seguir trabajando en él, puesto que aún hay trabajo por hacer. 
Bastante trabajo. 
Pero ha sido hecho con amor y empeño.
Thanks for reading this!
Au revouir. 
