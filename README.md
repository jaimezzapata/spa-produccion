
# **Naty Natural Massage Admin Panel**

## **Descripción**
Este proyecto es un sistema de administración para un SPA que permite gestionar usuarios, servicios y reservas. Los administradores pueden crear, editar y eliminar servicios, así como gestionar usuarios y sus citas.

---

## **Índice**

1. [Características](#características)
2. [Estructura de Carpetas](#estructura-de-carpetas)
3. [Colecciones en Firebase Firestore](#colecciones-en-firebase-firestore)
4. [Rutas del Proyecto](#rutas-del-proyecto)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Funcionamiento](#funcionamiento)
7. [Tecnologías Utilizadas](#tecnologías-utilizadas)
8. [Contribuciones](#contribuciones)

---

## **Características**

- **Gestión de Usuarios:**
  - Listar usuarios registrados (excepto administradores).
  - Eliminar usuarios.

- **Gestión de Servicios:**
  - Crear, editar y eliminar servicios.
  - Validación de datos al momento de registrar o actualizar servicios.

- **Gestión de Reservas:**
  - Confirmar, cancelar o eliminar citas reservadas.
  - Mostrar información detallada de clientes y servicios relacionados.

- **Autenticación:**
  - Acceso limitado a rutas protegidas según el rol (administrador o usuario).

---

## **Estructura de Carpetas**

```
src/
├── api/
│   └── firebaseConfig.js      # Configuración de Firebase Firestore
├── components/
│   ├── ListServicios.jsx      # Gestión de servicios
│   ├── ListUsuarios.jsx       # Gestión de usuarios
│   └── PanelAdmin.jsx         # Panel principal del administrador
├── pages/
│   ├── Login.jsx              # Página de inicio de sesión
│   ├── Register.jsx           # Página de registro de usuarios
│   ├── Reserva.jsx            # Página para que los usuarios reserven
│   └── PanelUser.jsx          # Página de panel para usuarios
├── styles/
│   ├── PanelAdmin.css         # Estilos específicos del panel del administrador
│   └── ListServicios.css      # Estilos específicos de la gestión de servicios
├── App.jsx                    # Configuración principal de la aplicación
├── main.jsx                   # Punto de entrada de la aplicación
└── router/
    └── routerApp.js           # Configuración de rutas
```

---

## **Colecciones en Firebase Firestore**

### **Usuarios (`usuarios`)**
Campos:
- `id` (generado automáticamente por Firebase)
- `nombre` (string)
- `apellido` (string)
- `email` (string, único)
- `contraseña` (string)
- `direccion` (string)
- `telefono` (string)
- `rol` (string, valores posibles: `admin`, `cliente`)

### **Servicios (`servicios`)**
Campos:
- `id` (generado automáticamente por Firebase)
- `nombre` (string)
- `descripcion` (string)
- `precio` (number)

### **Reservas (`reservas`)**
Campos:
- `id` (generado automáticamente por Firebase)
- `userId` (string, referencia al `id` del usuario)
- `servicioId` (string, referencia al `id` del servicio)
- `fecha` (string, formato de fecha)
- `hora` (string, formato de hora)
- `estado` (string, valores posibles: `Pendiente`, `Confirmada`, `Cancelada`)

---

## **Rutas del Proyecto**

### **Rutas Públicas**
- `/`: Página de inicio de sesión (`Login.jsx`).
- `/register`: Página de registro de usuarios (`Register.jsx`).

### **Rutas Protegidas**
- `/reserva`: Página para que los usuarios reserven un servicio (`Reserva.jsx`).
- `/admin`: Panel principal para administradores (`PanelAdmin.jsx`).
- `/servicios`: Gestión de servicios (`ListServicios.jsx`).
- `/usuarios`: Gestión de usuarios (`ListUsuarios.jsx`).

### **Protección de Rutas**
Las rutas protegidas requieren que el usuario haya iniciado sesión y que su rol sea adecuado para acceder a la página.

---

## **Instalación y Configuración**

### **Requisitos Previos**
1. Node.js instalado en tu máquina.
2. Cuenta de Firebase y configuración de un proyecto en Firestore.

### **Pasos de Instalación**
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-repositorio/naty-natural-massage.git
   cd naty-natural-massage
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura Firebase:
   - Crea un archivo `firebaseConfig.js` dentro de la carpeta `api/`.
   - Agrega la configuración de tu proyecto Firebase:
     ```javascript
     import { initializeApp } from "firebase/app";
     import { getFirestore } from "firebase/firestore";

     const firebaseConfig = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_AUTH_DOMAIN",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_STORAGE_BUCKET",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     export const db = getFirestore(app);
     ```

4. Ejecuta el proyecto:
   ```bash
   npm run dev
   ```

---

## **Funcionamiento**

### **Inicio de Sesión**
- Solo usuarios registrados pueden acceder.
- Los administradores serán redirigidos al panel de administración.
- Los clientes serán redirigidos a la página de reservas.

### **Gestión de Usuarios**
- Mostrar solo usuarios que no sean administradores.
- Posibilidad de eliminar usuarios.

### **Gestión de Servicios**
- Crear nuevos servicios.
- Editar información de servicios existentes.
- Eliminar servicios.

### **Gestión de Reservas**
- Confirmar o cancelar reservas.
- Eliminar reservas permanentemente.

---

## **Tecnologías Utilizadas**

1. **Frontend:**
   - React.js
   - React Router DOM
   - SweetAlert2 (para alertas personalizadas)
   - CSS con metodología BEM

2. **Backend:**
   - Firebase Firestore (Base de datos NoSQL)

3. **Otras Herramientas:**
   - Vite (para configuración y desarrollo)
   - Firebase Hosting (opcional)

---

## **Contribuciones**

Si deseas contribuir al proyecto:
1. Realiza un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b mi-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m "Agrego nueva funcionalidad"`).
4. Sube los cambios a tu rama (`git push origin mi-funcionalidad`).
5. Abre un Pull Request en el repositorio original.

---

¡Gracias por utilizar Naty Natural Massage Admin Panel! 😊
