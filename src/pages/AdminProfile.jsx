import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebaseConfig"; // Ruta de configuración de Firebase
import "./AdminProfile.css";

const AdminProfile = () => {
  const [adminInfo, setAdminInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener el ID del administrador desde localStorage
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

  if (loading) {
    return <p>Cargando información del administrador...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="admin-profile">
      <h2>Información del Administrador</h2>
      {adminInfo ? (
        <div className="profile-card">
          <p>
            <strong>Nombre:</strong> {adminInfo.nombre}
          </p>
          <p>
            <strong>Apellido:</strong> {adminInfo.apellido}
          </p>
          <p>
            <strong>Correo Electrónico:</strong> {adminInfo.email}
          </p>
          <p>
            <strong>Dirección:</strong> {adminInfo.direccion}
          </p>
          <p>
            <strong>Teléfono:</strong> {adminInfo.telefono}
          </p>
          <p>
            <strong>Documento de Identidad:</strong>{" "}
            {adminInfo.documentoIdentidad}
          </p>
          <p>
            <strong>Rol:</strong> {adminInfo.rol}
          </p>
        </div>
      ) : (
        <p>No se pudo cargar la información del administrador.</p>
      )}
    </div>
  );
};

export default AdminProfile;
