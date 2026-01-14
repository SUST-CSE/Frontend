import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Course from "../pages/Course";
import Faculty from "../pages/Faculty";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import StudentLogin from "../pages/auth/StudentLogin";
import StudentRegister from "../pages/auth/StudentRegister";
import TeacherLogin from "../pages/auth/TeacherLogin";
import TeacherRegister from "../pages/auth/TeacherRegister";
import AdminLogin from "../pages/auth/AdminLogin";

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";

import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherProfile from "../pages/teacher/TeacherProfile";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProfile from "../pages/admin/AdminProfile";

import ProtectedRoute from "../components/ProtectedRoute";
import { ROLES } from "../utils/constants";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/course" element={<Course />} />
            <Route path="/faculty" element={<Faculty />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/teacher/login" element={<TeacherLogin />} />
            <Route path="/teacher/register" element={<TeacherRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            <Route path="/student/dashboard" element={
                <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                    <StudentDashboard />
                </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
                <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                    <StudentProfile />
                </ProtectedRoute>
            } />

            <Route path="/teacher/dashboard" element={
                <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                    <TeacherDashboard />
                </ProtectedRoute>
            } />
            <Route path="/teacher/profile" element={
                <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                    <TeacherProfile />
                </ProtectedRoute>
            } />

            <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
                    <AdminDashboard />
                </ProtectedRoute>
            } />
            <Route path="/admin/profile" element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>
                    <AdminProfile />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
