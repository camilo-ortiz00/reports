'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/informes');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1>Redirecionando...</h1>
      <span className="loading loading-ring loading-lg"></span>
    </div>
  );
};

export default Page;
