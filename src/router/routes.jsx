import AdminProfile from "../pages/AdminProfile";
import AdminProfileEdit from "../pages/AdminProfileEdit";
import ListServicios from "../pages/ListServicios";
import ListUsuarios from "../pages/ListUsuarios";
import Login from "../pages/Login";
import PanelAdmin from "../pages/PanelAdmin";
import PanelUser from "../pages/PanelUser";
import Register from "../pages/Register";
import Reserva from "../pages/Reserva";

export let routerApp = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/admin/",
    element: <PanelAdmin />,
  },
  {
    path: "/usuarios",
    element: <ListUsuarios />,
  },
  {
    path: "/servicios",
    element: <ListServicios />,
  },
  {
    path: "/admin-profile",
    element: <AdminProfile />,
  },
  {
    path: "/admin-profile-edit",
    element: <AdminProfileEdit />,
  },
  {
    path: "/user",
    element: <PanelUser />,
  },
  {
    path: "/reserva",
    element: <Reserva />,
  },
];
