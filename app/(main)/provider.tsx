"use client";
import React, { useContext, useEffect } from 'react';
import Header from './_components/Header';
import { GetAuthUserData } from '@/services/GlobalApi';
import { useRouter } from 'next/navigation';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { AssistantContext } from '@/context/AssistantContext';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const convex = useConvex();
  const {user, setUser} = useContext(AuthContext);
  const [assistant, setAssistant] = React.useState();
  useEffect(() => {
    CheckUseAuth();
  }, []);

  const CheckUseAuth = async () => {
    const token = localStorage.getItem('user_token');
    const user = token && await GetAuthUserData(token);

    if (!user?.email) {
      router.replace('/auth/sign-in');
      return;
    }
   try{
    const result = await convex.query(api.users.GetUser, {
      email: user.email,
    });
    console.log(result);
    setUser(result);
    
  } catch(e) {
    console.log(e);
  }



  };

  return (
    <div className='flex'>
      <AssistantContext.Provider value={{assistant, setAssistant}}>
      <Header/>
      {children}
      </AssistantContext.Provider>
    </div>
  );
}

export default Provider;