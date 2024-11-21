import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../api/firebaseConfig"; // Configuración de Firebase
import Swal from "sweetalert2";
import "./ListServicios.css";

const ListServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        // Consultar la colección de servicios
        const serviciosSnapshot = await getDocs(collection(db, "servicios"));
        const serviciosData = serviciosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Actualizar el estado con los servicios obtenidos
        setServicios(serviciosData);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  // Función para eliminar un servicio
  const eliminarServicio = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el servicio permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#70a1fe",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const servicioRef = doc(db, "servicios", id);
        await deleteDoc(servicioRef);

        Swal.fire({
          title: "Éxito",
          text: "Servicio eliminado correctamente",
          icon: "success",
        });

        // Actualizar el estado local
        setServicios((prevServicios) =>
          prevServicios.filter((servicio) => servicio.id !== id)
        );
      } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el servicio.",
          icon: "error",
        });
      }
    }
  };

  // Función para editar un servicio
  const editarServicio = async (id, servicioActual) => {
    const { value: formValues } = await Swal.fire({
      title: "Editar Servicio",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${servicioActual.nombre}" />
        <input id="descripcion" class="swal2-input" placeholder="Descripción" value="${servicioActual.descripcion}" />
        <input id="precio" type="number" class="swal2-input" placeholder="Precio" value="${servicioActual.precio}" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value;
        const precio = parseFloat(document.getElementById("precio").value);

        if (!nombre || !descripcion || isNaN(precio)) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return { nombre, descripcion, precio };
      },
    });

    if (formValues) {
      try {
        const servicioRef = doc(db, "servicios", id);
        await updateDoc(servicioRef, formValues);

        Swal.fire({
          title: "Éxito",
          text: "Servicio actualizado correctamente",
          icon: "success",
        });

        // Actualizar el estado local
        setServicios((prevServicios) =>
          prevServicios.map((servicio) =>
            servicio.id === id ? { ...servicio, ...formValues } : servicio
          )
        );
      } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo actualizar el servicio.",
          icon: "error",
        });
      }
    }
  };

  // Función para crear un nuevo servicio
  const crearServicio = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Crear Nuevo Servicio",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" />
        <input id="descripcion" class="swal2-input" placeholder="Descripción" />
        <input id="precio" type="number" class="swal2-input" placeholder="Precio" />
      `,
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value;
        const descripcion = document.getElementById("descripcion").value;
        const precio = parseFloat(document.getElementById("precio").value);

        if (!nombre || !descripcion || isNaN(precio)) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return { nombre, descripcion, precio };
      },
    });

    if (formValues) {
      try {
        const nuevoServicio = await addDoc(collection(db, "servicios"), formValues);

        Swal.fire({
          title: "Éxito",
          text: "Servicio creado correctamente",
          icon: "success",
        });

        // Actualizar el estado local con el nuevo servicio
        setServicios((prevServicios) => [
          ...prevServicios,
          { id: nuevoServicio.id, ...formValues },
        ]);
      } catch (error) {
        console.error("Error al crear el servicio:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo crear el servicio.",
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
        <h2 className="admin-panel__content-title">Servicios Registrados</h2>
        <button
          className="admin-panel__button--create"
          onClick={crearServicio}
        >
          Crear Servicio
        </button>

        {/* Estado de carga */}
        {loading ? (
          <p className="admin-panel__content-loading">Cargando servicios...</p>
        ) : (
          <div className="admin-panel__cards-container">
            {/* Renderizado dinámico de servicios */}
            {servicios.length > 0 ? (
              servicios.map((servicio) => (
                <div className="admin-panel__card" key={servicio.id}>
                  <h3 className="admin-panel__card-title">{servicio.nombre}</h3>
                  <p className="admin-panel__card-text">
                    Descripción: {servicio.descripcion}
                  </p>
                  <p className="admin-panel__card-text">
                    Precio: ${servicio.precio}
                  </p>
                  <div className="admin-panel__card-actions">
                    <button
                      onClick={() => editarServicio(servicio.id, servicio)}
                      className="admin-panel__button--edit"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarServicio(servicio.id)}
                      className="admin-panel__button--delete"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay servicios registrados</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListServicios;
