import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";

const Messages = () => {
  const { user, loading } = useAuth();
  if (!user && !loading) return <NotLoggedIn />;
  return <div>Messages</div>;
};

export default Messages;
