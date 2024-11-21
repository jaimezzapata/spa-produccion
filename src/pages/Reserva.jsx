import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { db } from "../api/firebaseConfig"; // Asegúrate de que esta es tu configuración
import "./Reserva.css";

const Reserva = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [servicioId, setServicioId] = useState("");
  const [servicios, setServicios] = useState([]); // Estado para almacenar los servicios
  const navigate = useNavigate();

  // Obtener los servicios cuando el componente se monta
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const serviciosSnapshot = await getDocs(collection(db, "servicios"));
        const serviciosData = serviciosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setServicios(serviciosData);
      } catch (error) {
        console.error("Error al obtener los servicios:", error);
      }
    };

    fetchServicios();
  }, []);

  const handleReserva = async () => {
    // Capturar el usuario desde localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;

    // Validar que todos los campos estén completos
    if (!userId || !fecha || !hora || !servicioId) {
      alert("Todos los campos son obligatorios. Por favor, complétalos.");
      console.error("Error: Todos los campos son obligatorios");
      return;
    }

    const reservaData = {
      fecha,
      hora,
      servicioId,
      userId,
      timestamp: new Date().toISOString(), // Marca de tiempo para la reserva
    };

    try {
      // Guardar en la colección "reservas"
      await setDoc(
        doc(db, "reservas", `${userId}-${new Date().getTime()}`),
        reservaData
      );
      alert("Reserva realizada exitosamente");

      // Limpiar los campos del formulario
      setFecha("");
      setHora("");
      setServicioId("");
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      alert("Hubo un error al realizar la reserva. Inténtalo de nuevo.");
    }
  };

  const handleCerrarSesion = () => {
    // Limpiar credenciales del localStorage
    localStorage.removeItem("user");
    alert("Sesión cerrada correctamente");
    navigate("/"); // Redirigir al login
  };

  return (
    <section className="content">
      <div className="content__header">
        <img src="/public/logo.jpeg" alt="" />
        <section>
          <h2>Naty Natural Massage</h2>
          <p>Belleza y Bienestar que renueva</p>
        </section>
      </div>
      <form className="content__form" onSubmit={(e) => e.preventDefault()}>
        <button type="button" onClick={handleCerrarSesion}>
          Cerrar Sesión
        </button>
        <h2>Reservar un Servicio</h2>
        <section className="content__form__inputs">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          />
          <select
            value={servicioId}
            onChange={(e) => setServicioId(e.target.value)}
            required
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.id} value={servicio.id}>
                {servicio.nombre}
              </option>
            ))}
          </select>
        </section>
        <button type="button" onClick={handleReserva}>
          Agendar
        </button>
      </form>
    </section>
  );
};

export default Reserva;
