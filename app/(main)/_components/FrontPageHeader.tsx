"use client";
import React from 'react';
import Image from 'next/image';
// import { useContext } from 'react';
// import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

function FrontPageHeader() {
//   const { user } = useContext(AuthContext);
return (
  <div className='p-3 shadow-sm flex items-center justify-between px-14   w-full  '>
    <div className='flex gap-3 items-center'>
    <Image src={'/logo.svg'} alt='logo' width={40} height={40}
     />
     <h1 className="text-xl font-bold">AI Genius</h1>
     </div>
    <Button>Gets Started</Button>
    
  </div>
);
}

export default FrontPageHeader;