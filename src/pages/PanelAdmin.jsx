import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../api/firebaseConfig"; // Asegúrate de que esta es tu configuración
import Swal from "sweetalert2";
import "./PanelAdmin.css";

const PanelAdmin = () => {
  const [citas, setCitas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Consultar la colección de reservas
        const citasSnapshot = await getDocs(collection(db, "reservas"));
        const citasData = citasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Consultar la colección de usuarios
        const usuariosSnapshot = await getDocs(collection(db, "usuarios"));
        const usuariosData = usuariosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Consultar la colección de servicios
        const serviciosSnapshot = await getDocs(collection(db, "servicios"));
        const serviciosData = serviciosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Actualizar los estados
        setCitas(citasData);
        setUsuarios(usuariosData);
        setServicios(serviciosData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Buscar el nombre del cliente basado en el userId
  const getNombreCliente = (userId) => {
    const usuario = usuarios.find((usuario) => usuario.id === userId);
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : "Sin Cliente";
  };

  // Buscar el nombre del servicio basado en el servicioId
  const getNombreServicio = (servicioId) => {
    const servicio = servicios.find((servicio) => servicio.id === servicioId);
    return servicio ? servicio.nombre : "Sin Servicio";
  };

  // Confirmar una cita
  const confirmarCita = async (id) => {
    try {
      const citaRef = doc(db, "reservas", id);
      await updateDoc(citaRef, { estado: "Confirmada" });
      Swal.fire({
        title: "Éxito",
        text: "Cita confirmada correctamente",
        icon: "success",
      });

      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === id ? { ...cita, estado: "Confirmada" } : cita
        )
      );
    } catch (error) {
      console.error("Error al confirmar la cita:", error);
      Swal.fire({
        title: "Error",
        text: "Error al confirmar la cita",
        icon: "error",
      });
    }
  };

  // Cancelar una cita
  const cancelarCita = async (id) => {
    try {
      const citaRef = doc(db, "reservas", id);
      await updateDoc(citaRef, { estado: "Cancelada" });
      Swal.fire({
        title: "Éxito",
        text: "Cita cancelada de forma exitosa",
        icon: "success",
      });

      setCitas((prevCitas) =>
        prevCitas.map((cita) =>
          cita.id === id ? { ...cita, estado: "Cancelada" } : cita
        )
      );
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      Swal.fire({
        title: "Error",
        text: "Error al cancelar la cita",
        icon: "error",
      });
    }
  };

  // Eliminar una reserva
  const eliminarReserva = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la reserva permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#70a1fe",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const citaRef = doc(db, "reservas", id);
        await deleteDoc(citaRef);

        Swal.fire({
          title: "Éxito",
          text: "Reserva eliminada correctamente",
          icon: "success",
        });

        setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== id));
      } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la reserva.",
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
              Citas
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
        <h2 className="admin-panel__content-title">
          Panel de Control - Citas Reservadas
        </h2>

        {/* Estado de carga */}
        {loading ? (
          <p className="admin-panel__content-loading">Cargando citas...</p>
        ) : (
          <div className="admin-panel__cards-container">
            {/* Renderizado dinámico de citas */}
            {citas.length > 0 ? (
              citas.map((cita) => (
                <div className="admin-panel__card" key={cita.id}>
                  <h3 className="admin-panel__card-title">Cita #{cita.id}</h3>
                  <p className="admin-panel__card-text">Fecha: {cita.fecha}</p>
                  <p className="admin-panel__card-text">Hora: {cita.hora}</p>
                  <p className="admin-panel__card-text">
                    Cliente: {getNombreCliente(cita.userId)}
                  </p>
                  <p className="admin-panel__card-text">
                    Servicio: {getNombreServicio(cita.servicioId)}
                  </p>
                  <p className="admin-panel__card-status">
                    Estado: {cita.estado || "Pendiente"}
                  </p>
                  <div className="admin-panel__card-actions">
                    {cita.estado !== "Confirmada" && (
                      <button
                        onClick={() => confirmarCita(cita.id)}
                        className="admin-panel__button--confirm"
                      >
                        Confirmar
                      </button>
                    )}
                    {cita.estado !== "Cancelada" && (
                      <button
                        onClick={() => cancelarCita(cita.id)}
                        className="admin-panel__button--cancel"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      onClick={() => eliminarReserva(cita.id)}
                      className="admin-panel__button--delete"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay citas registradas</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAdmin;
