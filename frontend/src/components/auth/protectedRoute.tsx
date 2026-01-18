import { useAuthStore } from '@/stores/useAuthStore';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
const ProtectedRoute = () => {
    const { accessToken, user, refreshToken, fetchMe, loading } = useAuthStore();
    const [fetching, setFetching] = useState(true);
    const init = async () => {
        if(!accessToken) {
            await refreshToken();
        }

        if(accessToken && !user) {
            await fetchMe();
        }
        setFetching(false);
    }

    useEffect(() => {
        init();
    }, []);

    if(fetching || loading) {
        return <div>Loading...</div>;
    }

    return (
        accessToken ? <Outlet /> : <Navigate to="/signin" />
    )
}

export default ProtectedRoute;