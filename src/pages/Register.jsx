import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../api/firebaseConfig"; // Asegúrate de que esta ruta apunte a tu configuración de Firebase
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import Swal from "sweetalert2";
import logo from "../assets/logo.jpeg";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");
  const [documentoIdentidad, setDocumentoIdentidad] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState(null);
  const auth = useNavigate();

  const handleRegister = async () => {
    if (
      !nombre ||
      !apellido ||
      !email ||
      !contraseña ||
      !direccion ||
      !documentoIdentidad ||
      !telefono
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      // Verificar si el usuario ya existe en la colección "usuarios"
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("email", "==", email));
      const existingUsersSnapshot = await getDocs(q);

      if (!existingUsersSnapshot.empty) {
        setError("El usuario ya está registrado con este correo electrónico.");
        Swal.fire({
          title: "Error",
          text: "El usuario ya existe.",
          icon: "error",
        });
        return;
      }

      // Crear el nuevo usuario en Firebase
      const userData = {
        nombre,
        apellido,
        email,
        contraseña,
        direccion,
        documentoIdentidad,
        telefono,
        rol: "cliente", // Por defecto, asignar rol de cliente
      };

      await addDoc(usuariosRef, userData);

      Swal.fire({
        title: "Éxito",
        text: "Usuario registrado exitosamente.",
        icon: "success",
      });

      auth("/"); // Redirigir al login
    } catch (error) {
      console.error("Error en el registro:", error);
      setError("Error en la conexión al servidor");
    }
  };

  return (
    <section className="content">
      <div className="content__header">
        <img src={logo} alt="" />
        <section>
          <h2>Naty Natural Massage</h2>
          <p>Belleza y Bienestar que renueva</p>
        </section>
      </div>
      <form className="content__form" onSubmit={(e) => e.preventDefault()}>
        <h2>Registro de Usuario</h2>
        <section className="content__form__inputs">
          <input
            placeholder="Nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <input
            placeholder="Apellido"
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
          <input
            placeholder="Correo Electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Dirección"
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <input
            placeholder="Documento de Identidad"
            type="text"
            value={documentoIdentidad}
            onChange={(e) => setDocumentoIdentidad(e.target.value)}
          />
          <input
            placeholder="Teléfono"
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </section>
        {error && <p className="error-message">{error}</p>}
        <button type="button" onClick={handleRegister}>
          Registrarse
        </button>
        <Link to="/">
          ¿Ya tienes una cuenta? <span>Login</span>
        </Link>
      </form>
    </section>
  );
};

export default Register;
