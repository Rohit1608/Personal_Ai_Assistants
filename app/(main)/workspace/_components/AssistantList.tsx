"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/AuthContext";
import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import React, { useContext, useEffect } from "react";
import Image from "next/image";
import { ASSISTANT } from "../../ai-assistants/page";
import { AssistantContext } from "@/context/AssistantContext";
import { BlurFade } from "@/components/magicui/blur-fade";
import AddNewAssistant from "./AddNewAssistant";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, UserCircle2 } from "lucide-react";


function AssistantList() {
  const { user } = useContext(AuthContext);
  const convex = useConvex();
  const [assistantList, setAssistantList] = React.useState<ASSISTANT[]>([]);
  const { assistant, setAssistant } = useContext(AssistantContext);

  useEffect(() => {
    user && GetUserAssistants();
  }, [user&& assistant==null]);

  const GetUserAssistants = async () => {
    const result = await convex.query(api.userAiAssistants.GetAllUserAssistants, {
      uid: user?._id,
    });
    console.log(result);
    setAssistantList(result);
  };

  return (
    <div className="p-5 bg-gray-100 border-r-[1px] h-screen relative">
      <h2 className="font-bold text-lg text-black">
        Your Personal AI Assistants
      </h2>

      <AddNewAssistant>
        <Button className="w-full mt-3 bg-black text-white shadow-xs hover:bg-black/90">
          +Add New Assistant
        </Button>
      </AddNewAssistant>

      <Input placeholder="Search Assistant" className="mt-3" />
      <div className="mt-5">
        {assistantList.map((assistant_, index) => (
          <BlurFade key={assistant_.image} delay={0.25 + index * 0.05} inView>
            <div
              className={`pt-2 pl-2 flex gap-3 items-center hover:bg-gray-200 hover:dark:bg-slate-200 rounded-xl cursor-pointer mt-2 pb-2 ${
                assistant_.id === assistant?.id ? "bg-gray-200" : ""
              }`}
              key={index}
              onClick={() => setAssistant(assistant_)}
            >
              <Image
                src={assistant_.image}
                alt={assistant_.name}
                width={60}
                height={60}
                className="rounded-xl w-[60px] h-[60px] object-cover"
              />

              <div>
                <h2 className="font-bold">{assistant_.name}</h2>
                <h2 className="text-gray-600 text-sm dark:text-gray-450">
                  {assistant_.title}
                </h2>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="absolute bottom-10 flex items-center gap-3 hover:bg-gray-200 w-[90%] p-2 rounded-xl cursor-pointer">
            {user?.picture && (
              <Image
                src={user.picture}
                alt="user"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div>
              <h2 className="font-bold">{user?.name}</h2>
              <h2 className="text-gray-600 text-sm">
                {user?.orderId ? "Pro Plan" : "Free Plan"}
              </h2>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="width-[200px]">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem> <UserCircle2/> Profile</DropdownMenuItem>
          <DropdownMenuItem><LogOut/>Logout</DropdownMenuItem>
          
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default AssistantList;