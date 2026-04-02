import AuthRoute from "./routes/AuthRoute";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import Loading from "./components/Loding";
import UserRoute from "./routes/UserRoute";
import { useNavigate } from "react-router-dom";

const App = () => {
  const { getUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getUser();

        if (userData) {
          setIsAuthenticated(true);
          navigate("/");
        } else {
          setIsAuthenticated(false);
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth error:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [getUser]);

  // Prevent UI flicker while checking auth
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      {isAuthenticated ? <UserRoute /> : <AuthRoute />}
    </div>
  );
};

export default App;