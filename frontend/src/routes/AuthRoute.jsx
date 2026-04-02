import { Routes , Route } from "react-router-dom";
import Login from "../pages/AuthPages/Login.jsx";
import Signup from "../pages/AuthPages/Signup.jsx";

const AuthRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
        </Routes>
    );
};

export default AuthRoute;