import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
    // const { authTokens } = useContext(AuthContext);
    const authTokens = localStorage.getItem('access_token');
    const authUser = authTokens
    return authUser ? <Outlet/> : <Navigate to="/login"  replace/>
}

export default PrivateRoute;