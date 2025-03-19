"use client";
import React from 'react';
import Image from 'next/image';
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

function Header() {
  const { user } = useContext(AuthContext);
  return user&&(
    <div className='p-3 shadow-sm flex items-center justify-between px-14 fixed  w-full  '>
      <Image src={'/logo.svg'} alt='logo' width={40} height={40}
       />
      {user?.picture && (
        <Image src={user.picture} alt='user image' width={40} height={40}
        className='rounded-full' />
      )}
      
    </div>
  );
}

export default Header;