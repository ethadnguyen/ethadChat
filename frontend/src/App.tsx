import { BrowserRouter, Route, Routes } from 'react-router';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ChatApp from './pages/ChatApp';
import { Toaster } from 'sonner';
import ProtectedRoute from './components/auth/protectedRoute';
import { useThemeStore } from './stores/useThemeStore';
import { useEffect } from 'react';
import { useAuthStore } from './stores/useAuthStore';
import { useSocketStore } from './stores/useSocketStore';
function App() {
  const { isDark, setTheme } = useThemeStore();
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }

    return () => disconnectSocket();
  }, [accessToken]);
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />

          {/* protected routes */}
          <Route path='/' element={<ProtectedRoute />}>
            <Route path='/' element={<ChatApp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
