import Login from "./components/Login";
import Signup from "./components/Signup";
import Homepage from "./components/Homepage";
import ForgetPassword from "./components/ForgetPassword";
import { Route, Routes, BrowserRouter, Navigate } from "react-router";

import { useSelector} from "react-redux";

function App() {
  const { isAuthenticated } = useSelector((state) => state.authSlice);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />}
          ></Route>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          ></Route>
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
          ></Route>
          <Route
            path="/homepage"
            element={isAuthenticated ? <Homepage /> : <Navigate to="/login" />}
          ></Route>
          <Route path="/reset-password" element={<ForgetPassword />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
