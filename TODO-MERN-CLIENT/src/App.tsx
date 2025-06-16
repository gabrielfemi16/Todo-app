import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateTask from "./pages/createTask/CreateTask";
import Login from "./pages/login/Login";
import GetTask from "./pages/getTask/GetTask";
import Settings from "./pages/settings/Settings";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import PublicRoute from "./components/privateRoutes/PublicRoute";
import PrivateRoute from "./components/privateRoutes/PrivateRoute";
import Register from "./pages/signup/Register";
import EditTask from "./pages/editTask/EditTask";
import RequestReset from "./pages/requestReset/RequestReset";
import ResetPassword from "./pages/resetPassword/ResetPassword";
export const URL = import.meta.env.VITE_SERVER_URL;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <GetTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/createTask"
            element={
              <PrivateRoute>
                <CreateTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-task/:id"
            element={
              <PrivateRoute>
                <EditTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          <Route
            path="/request-reset"
            element={
              <PublicRoute>
                <RequestReset />
              </PublicRoute>
            }
          />
          <Route
            path="/user/reset-password/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
