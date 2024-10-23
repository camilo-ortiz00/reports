'use client';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
          <h1 className='text-3xl font-bold m-5'>Bienvenido a la página principal!</h1>
          <Link href="/informes/reports/components/report_list/report_list"><button className="btn btn-outline">Ir a informes</button></Link>
    </div>
  );
};

export default Page;