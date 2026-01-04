import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { Typography } from '@mui/material';
import {GuestLayout} from "./layout/GuestLayout.jsx";
import {ProtectedRoute} from "./context/ProtectedRoutes.jsx";
import {DefaultLayout} from "./layout/DefaultLayout.jsx";
import {UserHome} from "./pages/UserHome.jsx";
import {ResearcherHome} from "./pages/ResearcherHome.jsx";
import {AdminHome} from "./pages/AdminHome.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
            { index: true, element: <Navigate to="/login" replace /> },
        ],
    },
    {
        path: '/autenticate',
        element: <ProtectedRoute allowedRoles={['admin', 'researcher', 'user']} />,
        children: [
            {
                path: '',
                element: <DefaultLayout />,
                children: [
                    {
                        path: 'user',
                        children: [
                            { index: true, element: <UserHome /> },
                            { path: 'papers', element: <Typography variant="h4" fontWeight={700}>Naučni radovi - User</Typography> },
                            { path: 'saved-papers', element: <Typography variant="h4" fontWeight={700}>Sačuvani radovi</Typography> },
                            { path: 'projects', element: <Typography variant="h4" fontWeight={700}>Projekti - User</Typography> },
                            { path: 'equipment', element: <Typography variant="h4" fontWeight={700}>Oprema - User</Typography> },
                        ],
                    },
                    {
                        path: 'researcher',
                        children: [
                            { index: true, element: <ResearcherHome /> },
                            { path: 'papers', element: <Typography variant="h4" fontWeight={700}>Naučni radovi - Researcher</Typography> },
                            { path: 'saved-papers', element: <Typography variant="h4" fontWeight={700}>Sačuvani radovi</Typography> },
                            { path: 'projects', element: <Typography variant="h4" fontWeight={700}>Projekti - Researcher</Typography> },
                            { path: 'experiments', element: <Typography variant="h4" fontWeight={700}>Eksperimenti</Typography> },
                            { path: 'equipment', element: <Typography variant="h4" fontWeight={700}>Oprema - Researcher</Typography> },
                        ],
                    },
                    {
                        path: 'admin',
                        children: [
                            { index: true, element: <AdminHome /> },
                            { path: 'papers', element: <Typography variant="h4" fontWeight={700}>Naučni radovi - Admin</Typography> },
                            { path: 'projects', element: <Typography variant="h4" fontWeight={700}>Projekti - Admin</Typography> },
                            { path: 'experiments', element: <Typography variant="h4" fontWeight={700}>Eksperimenti - Admin</Typography> },
                            { path: 'equipment', element: <Typography variant="h4" fontWeight={700}>Oprema - Admin</Typography> },
                            { path: 'users', element: <Typography variant="h4" fontWeight={700}>Upravljanje korisnicima</Typography> },
                        ],
                    },
                ],
            },
        ],
    },
]);

export default router;