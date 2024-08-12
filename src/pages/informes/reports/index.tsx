'use client';
import Link from 'next/link';

const Page = () => {
  return (
    <div className="flex flex-col justify-center items-center">
          <h1 className='text-3xl font-bold m-10'>Informes</h1>
          <div className='flex flex-row items-center justify-center h-screen'>
            <Link href="/informes/reports/components/reports/reports"><button className="btn btn-outline mx-5">Ir a informes</button></Link>
            <Link href="/informes/reports/components/report_list/report_list"><button className="btn btn-outline mx-5">Ir a lista informes</button></Link>
          </div>
    </div>
  );
};

export default Page;

