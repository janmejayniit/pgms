import Home from './pages/Home.jsx';
import PgDetail from "./pages/PgDetail.jsx";
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './pages/Layouts/Layout.jsx';
import Register from './pages/Accounts/Register.jsx';
import Login from './pages/Accounts/Login.jsx';
import Books from './pages/BookRoom.jsx';
import Dashboard from "./pages/tenant/Dashboard.jsx";
import InvoicePrint from "./pages/tenant/InvoicePrint.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ForgetPassword from "./pages/Accounts/ForgetPassword.jsx";
import VerifyOTP from "./pages/Accounts/VerifyOTP.jsx";
import ResetPassword from "./pages/Accounts/ResetPassword.jsx";

function App() {

    const router = createBrowserRouter(createRoutesFromElements(
        <Route  path='/' element={<Layout/>}>
            <Route element={<PrivateRoute/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/pg/:id" element={<PgDetail/>} />
                <Route path="/pg/:pg_id/book/:room_type" element={<Books />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/print/invoice/:id" element={<InvoicePrint />} />
            </Route>
            <Route path="/login" element={<Login/>} />
            <Route path="/forget/password" element={<ForgetPassword/>} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/register" element={<Register/>} />
        </Route>
    ));

    return (
    <>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="colored"
        />

        <RouterProvider router={router}></RouterProvider>
    </>
  )
}


export default App
