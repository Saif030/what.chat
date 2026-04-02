import { Routes , Route } from "react-router-dom";
import Home from "../pages/Body/Home";

const UserRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Home />} />
        </Routes>
    );
};

export default UserRoute;