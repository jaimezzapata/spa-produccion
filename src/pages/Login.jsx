import { db } from "../api/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./Login.css";
import { useState, useEffect } from "react";
import logo from "../assets/logo.jpeg";

const Login = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  let redireccion = useNavigate();

  // Obtener la colección de usuarios al cargar el componente
  async function getUsuarios() {
    const collectionUsuarios = collection(db, "usuarios");
    const resultado = await getDocs(collectionUsuarios);
    setUsuarios(resultado.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); 
  }

  useEffect(() => {
    getUsuarios();
  }, []);

  // Buscar el usuario por email y contraseña
  const buscarUsuario = () => {
    return usuarios.find(
      (usuario) => usuario.email === email && usuario.contraseña === contraseña
    );
  };

  // Iniciar sesión
  const iniciarSesion = () => {
    const usuarioEncontrado = buscarUsuario();
    if (usuarioEncontrado) {
      // Almacenar el usuario en localStorage
      localStorage.setItem("user", JSON.stringify(usuarioEncontrado));

      // Redirigir según el rol
      if (usuarioEncontrado.rol === "admin") {
        redireccion("/admin"); // Redirigir a la página de administración
      } else if (usuarioEncontrado.rol === "cliente") {
        let timerInterval;
        Swal.fire({
          title: "Bievenido..",
          html: "Será redireccionado en <b></b> millisegundos.",
          timer: 2000,
          timerProgressBar: true,
          icon: "success",
          didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
        redireccion("/reserva"); // Redirigir a la página de reservas
      } else {
        alert("Rol no reconocido. Contacta al administrador.");
      }
    } else {
      Swal.fire({
        title: "Error",
        text: "Usuario y/o contraseña incorrecto",
        icon: "error",
      });
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
        <h2>Bienvenido</h2>
        <section className="content__form__inputs">
          <input
            placeholder="Correo Electrónico"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Contraseña"
            type="password"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
          />
        </section>
        <button onClick={iniciarSesion} type="button">
          Ingresar
        </button>
        <Link to="/register">
          ¿No tienes una cuenta? <span>Regístrate</span>
        </Link>
      </form>
    </section>
  );
};

export default Login;
