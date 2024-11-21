import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../api/firebaseConfig"; // Configuración de Firebase
import Swal from "sweetalert2";
import "./ListUsuarios.css";

const ListUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        // Consultar la colección de usuarios
        const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosData = usuariosSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((usuario) => usuario.rol !== "admin"); // Filtrar usuarios que no son admin

        // Actualizar el estado con los usuarios obtenidos
        setUsuarios(usuariosData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  // Función para eliminar un usuario
  const eliminarUsuario = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#70a1fe",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const usuarioRef = doc(db, "usuarios", id);
        await deleteDoc(usuarioRef);

        Swal.fire({
          title: "Éxito",
          text: "Usuario eliminado correctamente",
          icon: "success",
        });

        // Actualizar el estado local
        setUsuarios((prevUsuarios) =>
          prevUsuarios.filter((usuario) => usuario.id !== id)
        );
      } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="admin-panel">
      {/* Menú Lateral */}
      <aside className="admin-panel__sidebar">
        <h3 className="admin-panel__sidebar-title">Menú</h3>
        <ul className="admin-panel__sidebar-list">
          <li className="admin-panel__sidebar-item">
            <Link className="admin-panel__sidebar-link" to="/admin">
              Inicio
            </Link>
          </li>
          <li className="admin-panel__sidebar-item">
            <Link className="admin-panel__sidebar-link" to="/usuarios">
              Usuarios
            </Link>
          </li>
          <li className="admin-panel__sidebar-item">
            <Link className="admin-panel__sidebar-link" to="/servicios">
              Servicios
            </Link>
          </li>
          <li className="admin-panel__sidebar-item">
            <Link className="admin-panel__sidebar-link" to="/">
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      </aside>

      {/* Contenido Principal */}
      <div className="admin-panel__content">
        <h2 className="admin-panel__content-title">Usuarios Registrados</h2>

        {/* Estado de carga */}
        {loading ? (
          <p className="admin-panel__content-loading">Cargando usuarios...</p>
        ) : (
          <div className="admin-panel__cards-container">
            {/* Renderizado dinámico de usuarios */}
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <div className="admin-panel__card" key={usuario.id}>
                  <h3 className="admin-panel__card-title">
                    {usuario.nombre} {usuario.apellido}
                  </h3>
                  <p className="admin-panel__card-text">Correo: {usuario.email}</p>
                  <p className="admin-panel__card-text">
                    Teléfono: {usuario.telefono}
                  </p>
                  <p className="admin-panel__card-text">
                    Dirección: {usuario.direccion}
                  </p>
                  <p className="admin-panel__card-text">
                    Rol: {usuario.rol || "Sin Rol"}
                  </p>
                  <div className="admin-panel__card-actions">
                    <button
                      onClick={() => eliminarUsuario(usuario.id)}
                      className="admin-panel__button--delete"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay usuarios registrados</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListUsuarios;
