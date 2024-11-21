import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../api/firebaseConfig";
import "./AdminProfileEdit.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminProfileEdit = () => {
  const [adminInfo, setAdminInfo] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    telefono: "",
    documentoIdentidad: "",
    contraseña: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Redirección
  const adminId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (!adminId) {
        setError("No se encontró información del administrador.");
        setLoading(false);
        return;
      }

      try {
        const adminRef = doc(db, "usuarios", adminId);
        const adminSnapshot = await getDoc(adminRef);

        if (adminSnapshot.exists()) {
          setAdminInfo(adminSnapshot.data());
        } else {
          setError("No se encontró el perfil del administrador.");
        }
      } catch (err) {
        console.error(
          "Error al obtener la información del administrador:",
          err
        );
        setError("Error al obtener la información del administrador.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminInfo();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo({ ...adminInfo, [name]: value });
  };

  const validateFields = () => {
    const {
      nombre,
      apellido,
      email,
      direccion,
      telefono,
      documentoIdentidad,
      contraseña,
    } = adminInfo;

    if (
      !nombre ||
      !apellido ||
      !email ||
      !direccion ||
      !telefono ||
      !documentoIdentidad ||
      !contraseña
    ) {
      return "Todos los campos son obligatorios.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "El correo electrónico no es válido.";
    }

    if (telefono.length < 7) {
      return "El teléfono debe tener al menos 7 caracteres.";
    }

    if (contraseña.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres.";
    }

    return null;
  };

  function cancelar () {
    navigate('/')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateFields();
    if (validationError) {
      Swal.fire({
        title: "Error",
        text: validationError,
        icon: "error",
      });
      return;
    }

    try {
      const adminRef = doc(db, "usuarios", adminId);
      await updateDoc(adminRef, adminInfo);

      Swal.fire({
        title: "Éxito",
        text: "Información actualizada correctamente. Por seguridad, por favor inicie sesión nuevamente.",
        icon: "success",
      });

      // Limpiar credenciales del localStorage
      localStorage.removeItem("user");

      // Redirigir al login
      navigate("/");
    } catch (err) {
      console.error("Error al actualizar la información:", err);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la información.",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <p>Cargando información del administrador...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <section className="section-profile">
      <div className="admin-profile-edit">
        <h2>Editar Información Personal</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={adminInfo.nombre}
              onChange={handleChange}
            />
          </label>
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={adminInfo.apellido}
              onChange={handleChange}
            />
          </label>
          <label>
            Correo Electrónico:
            <input
              type="email"
              name="email"
              value={adminInfo.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              name="direccion"
              value={adminInfo.direccion}
              onChange={handleChange}
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              name="telefono"
              value={adminInfo.telefono}
              onChange={handleChange}
            />
          </label>
          <label>
            Documento de Identidad:
            <input
              type="text"
              name="documentoIdentidad"
              value={adminInfo.documentoIdentidad}
              onChange={handleChange}
            />
          </label>
          <label>
            Contraseña:
            <input
              type="password"
              name="contraseña"
              value={adminInfo.contraseña}
              onChange={handleChange}
            />
          </label>
          <button type="submit" className="save-button">
            Guardar Cambios
          </button>
          <button onClick={cancelar} type="submit" className="save-button">
            Cancelar
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminProfileEdit;
