import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import Error404 from "../containers/errors/Error404";
import Home from "../containers/Home";
import Dashboard from "../containers/pages/Dashboard";
import Enrollment from "../containers/pages/Enrollment";
import Profile from "../containers/pages/Profile";
import Grades from "../containers/pages/Grades";
import Exam from "../containers/pages/Exam";
import Login from "../containers/auth/Login";

import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import EnrollmentDetails from "../containers/pages/EnrollmentDetails";
import AddStudent from "../containers/pages/AddStudent";
import Student from "../containers/pages/Student";
import AddEnrollment from "../containers/pages/AddEnrollment";
import SanitizeEnrollmentDocuments from "../containers/pages/sanitizeEnrollmentDocuments";
import RestrictedRoute from "./RestrictedRoute";
import AddInstituteStaff from "../containers/pages/AddInstituteStaff";
import InstituteStaff from "../containers/pages/InstituteStaff";
import Activate from "../containers/auth/Activate";
import ResetPassword from "../containers/auth/ResetPassword";
import ResetPasswordConfirm from "../containers/auth/ResetPasswordConfirm";
import StaffUsers from "../containers/pages/StaffUsers";
import AddStaffUser from "../containers/pages/AddStaffUser";
import AddGrades from "../containers/pages/addGrades";

export default function AppRouter() {

  const rol = useSelector((state) => state.Auth.user ? state.Auth.user.user_data.rol : null);
  const isLogin = useSelector((state) => state.Auth.isAuthenticated);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    setIsAuthenticated(isLogin);
    setUserRole(rol)
  }, [isLogin, rol]);

  return (
    <Router>
      <Routes>
        {/* Error Display */}
        <Route path="*" element={<Error404 />} />

        <Route
          element={
            <PublicRoute
              isAuthenticated={isAuthenticated}
              redirectPath="/panel"
            />
          }
        >
          <Route exact path="/login" element={<Login />} />
        </Route>
        <Route exact path="/activate/:uid/:token" element={<Activate />} />
        <Route exact path="/reset_password" element={<ResetPassword />} />
        <Route
          exact
          path="/password/reset/confirm/:uid/:token"
          element={<ResetPasswordConfirm />}
        />

        <Route
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              redirectPath="/login"
            />
          }
        >
          <Route exact path="/" element={<Home />} />
          <Route exact path="/panel" element={<Dashboard />} />
          <Route exact path="/matriculas/listado" element={<Enrollment />} />
          <Route
            exact
            path="/matriculas/registrar"
            element={<AddEnrollment />}
          />
          <Route
            exact
            path="/matriculas/reponer/:codigo"
            element={<SanitizeEnrollmentDocuments />}
          />

          <Route
            exact
            path="/matriculas/:codigo"
            element={<EnrollmentDetails />}
          />
          <Route
            exact
            path="/matriculas/convocatoria/:convocatoria"
            element={<Enrollment />}
          />

          <Route exact path="/examenes/" element={<Exam />} />
          <Route exact path="/notas/" element={<Grades />} />
          <Route
            element={
              <RestrictedRoute
                allowedRoles={["staff", "admin_staff"]}
                userRole={userRole}
              />
            }
          >
            <Route exact path="/notas/registrar" element={<AddGrades />} />
          </Route>
          <Route
            element={
              <RestrictedRoute
                allowedRoles={["staff", "admin_staff", "institute_staff"]}
                userRole={userRole}
              />
            }
          >
            <Route exact path="/alumnos/registrar" element={<AddStudent />} />
            <Route exact path="/alumnos/listado" element={<Student />} />
          </Route>

          <Route
            element={
              <RestrictedRoute
                allowedRoles={["admin_staff"]}
                userRole={userRole}
              />
            }
          >
            <Route
              exact
              path="/personal-instituto/registrar"
              element={<AddInstituteStaff />}
            />
            <Route
              exact
              path="/personal-instituto/listado"
              element={<InstituteStaff />}
            />

            <Route
              exact
              path="/personal/registrar"
              element={<AddStaffUser />}
            />
            <Route exact path="/personal/listado" element={<StaffUsers />} />
          </Route>

          <Route exact path="/perfil" element={<Profile />} />
        </Route>

        {/*<Route exact path="/perfil" element={ !isAuthenticated ?  <Navigate to="/login" /> : <Profile />} />*/}

        {/* 
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/matricula"
          element={<Enrollment />}
        />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/notas"
          element={<Grades />}
        />
        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/examenes"
          element={<Exam />}
        />

        <PrivateRoute
          isAuthenticated={isAuthenticated}
          path="/perfil"
          element={<Profile />}
        /> */}

        {/* Authentication 
        <PublicRoute
          isAuthenticated={isAuthenticated}
          path="/login"
          element={<Login />}
        /> */}
      </Routes>
    </Router>
  );
}
