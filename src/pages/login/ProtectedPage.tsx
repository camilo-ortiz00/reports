import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/auth/signin');
      }
    };
    checkSession();
  }, [router]);

  return <div>Página protegida</div>;
};

export default ProtectedPage;
