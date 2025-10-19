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

/*
Reading content: 
What this code means

In React Router v6+, a <Route> can have:

<Route element={<SomeLayoutComponent />}>
  <Route path="..." element={<Page />} />
</Route>


That says:

“Render <SomeLayoutComponent> first, and inside it, wherever <Outlet /> appears, render the matching child route.”

So in your file:

<Route element={<Navbar navTitle="" />}>
  <Route path="/" element={<Dashboard />} />
  ...
</Route>


React Router mounts <Navbar navTitle="" />.

Inside Navbar, there must be an <Outlet />.

The current child route (like Dashboard, Homepage, etc.) appears inside that <Outlet />.

If your Navbar does not contain <Outlet />, none of the inner routes will show.
If it does contain <Outlet />, then every time you switch between /, /liked-content, etc., React Router re-mounts the entire <Navbar> tree by design, because Navbar is treated as the parent route element.

Why this is a problem in production

Re-mounting a navigation bar causes:

loss of internal component state (e.g. open menus, input focus)

repeated API calls (if Navbar fetches user or notifications)

unnecessary re-renders that waste CPU/GPU time

Fix: use a persistent layout component

<the current code we have where outlet is outside the navbar>

Now the Navbar mounts once, and only the outlet content switches.
→ smoother transitions, fewer re-renders, better UX.
*/
