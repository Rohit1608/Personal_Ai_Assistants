"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

async function GetAuthUserData(access_token: string) {
  try {
    const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export default function SignIn() {
  const CreateUser = useMutation(api.users.CreateUser);
  const { user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("user_token", tokenResponse.access_token);
      }
      const userData = await GetAuthUserData(tokenResponse.access_token);

      const result = await CreateUser({
        name: userData?.name,
        email: userData?.email,
        picture: userData?.picture,
      });
      setUser(result);
      router.replace("/ai-assistants");
    },
    onError: (errorResponse) => console.log("Google login error:", errorResponse),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-200 flex items-center justify-center px-4">
      {/* Main Container */}
      <div className="max-w-5xl w-full">
         {/* Sign-in Card */}
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg max-w-md mx-auto text-center">
          <div className="flex justify-center">
            <Image src={"/logo.svg"} alt="App Logo" width={300} height={250} />
          </div>
          <h2 className="text-2xl font-bold mt-4">
            Sign In to{" "}
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
              Personal AI Agent
            </span>
          </h2>
          <p className="mt-2 text-gray-600">
            Automate your tasks and simplify your workflow
          </p>

          <Button
            className="mt-6  bg-black text-white"
            size="lg"
            onClick={() => googleLogin()}
          >
            Sign in with Gmail
          </Button>
        </div>
      </div>
    </div>
  );
}
