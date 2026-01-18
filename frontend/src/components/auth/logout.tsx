import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useLogout } from '@/hooks/useLogout';

const Logout = () => {
  const handleLogout = useLogout();
  return (
    <Button variant='completeGhost' onClick={handleLogout}>
      <LogOut className='text-destructive' />
      Đăng xuất
    </Button>
  );
};

export default Logout;
