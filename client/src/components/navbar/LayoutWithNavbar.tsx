import { Outlet } from "react-router-dom";
import Navbar from "../../pages/Navbar";
import useAuth from "../../hooks/useAuth";
import NotLoggedIn from "../../pages/NotLoggedIn";
import { Main } from "../ui-components/NavbarStyledComponents";

export default function LayoutWithNavbar() {
  const { user, loading } = useAuth();
  return (
    <>
      <Navbar />
      <Main>{!user && !loading ? <NotLoggedIn /> : <Outlet />}</Main>
    </>
  );
}
