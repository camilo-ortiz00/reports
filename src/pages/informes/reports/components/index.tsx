'use client';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">          
          <h1 className="text-5xl font-bold">Bienvenido a la página de informes!</h1>
          <Link href="/informes/reports/components/report_list/report_list">Ir a informes</Link>
          </div>
        </div>
      </div>
  );
};

export default Page;