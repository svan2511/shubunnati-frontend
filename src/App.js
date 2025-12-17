import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import { setAuthFromStorage } from "./features/users/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ProtectedRoute from "./utils/ProtectedRoute";
import UserListPage from "./pages/UserListPage";
import RolePage from "./pages/RolePage";
import PermissionPage from "./pages/PermissionPage";
import CentersPage from "./pages/CentersPage";
import MembersPage from "./pages/MembersPage";

function App() {

  const dispatch = useDispatch();

   useEffect(() => {
    const token = sessionStorage.getItem("auth_token");

    if (token) {
      dispatch(
        setAuthFromStorage({ token })
      );
    }
  }, [dispatch]);


  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

         <Route element={<ProtectedRoute />}>
         <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/roles" element={<RolePage />} />
          <Route path="/permissions" element={<PermissionPage />} />
          <Route path="/centers" element={<CentersPage />} />
          <Route path="/members" element={<MembersPage />} />
         </Route>
              </Routes>
    </BrowserRouter>
    
  );
}

export default App;
