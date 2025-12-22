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
import MemberViewPage from "./pages/MemberViewPage";
import NotFoundPage from "./pages/NotfountPage";
import UnauthorizesPage from "./pages/UnauthorizePage";

function App() {

  const dispatch = useDispatch();

   useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
     const permissions = sessionStorage.getItem("user_permissions");

    if (token && permissions) {
      dispatch(
        setAuthFromStorage({ token ,  permissions: JSON.parse(permissions) })
      );
    }
  }, [dispatch]);


  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute permission="view-dashboard" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
         
          <Route element={<ProtectedRoute permission="view-users" />}>
          <Route path="/users" element={<UserListPage />} />
          </Route>
          <Route element={<ProtectedRoute permission="view-roles" />}>
            <Route path="/roles" element={<RolePage />} />
          </Route>
         
          <Route element={<ProtectedRoute permission="view-permissions" />}>
            <Route path="/permissions" element={<PermissionPage />} />
          </Route>
        

           <Route element={<ProtectedRoute permission="view-centers" />}>
            <Route path="/centers" element={<CentersPage />} />
           </Route>
         

           <Route element={<ProtectedRoute permission="view-members" />}>
             <Route path="/members/" element={<MembersPage key="all-members" />} />
             </Route>
        


           <Route element={<ProtectedRoute permission="view-centers" />}>
          <Route path="/centers/center/:centerId" element={<MembersPage key="center-members" />} />

           </Route>


            <Route element={<ProtectedRoute permission="view-members" />}>
             <Route path="/members/:id" element={<MemberViewPage />} />
            </Route>

             <Route path="/unauthorized" element={<UnauthorizesPage />} />
         
           <Route path="*" element={<NotFoundPage />} />

              </Routes>
    </BrowserRouter>
    
  );
}

export default App;
