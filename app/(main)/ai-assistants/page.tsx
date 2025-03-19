"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AiAssistantsList from "@/services/AiAssistantsList";
import React, { use, useContext, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthContext } from "@/context/AuthContext";
import { Loader, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export type ASSISTANT = {
  id: number;
  name: string;
  title: string;
  image: string;
  instruction: string;
  userInstruction: string;
  sampleQuestions: string[];
  aiModelId?:string
};

function AIassistants() {
  const [selectedAssistant, setSelectedAssistant] = React.useState<ASSISTANT[]>([]);
  const insertAssistant = useMutation(api.userAiAssistants.InsertSelectedAssistants);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const convex = useConvex();
  const router = useRouter();

  useEffect(() => {
    user && GetUserAssistants();
  }, [user]);
  
  const GetUserAssistants = async () => {
    const result = await convex.query(api.userAiAssistants.GetAllUserAssistants, {
      uid: user?._id, 
    });
    //console.log(result);
    if (result.length > 0) {
      router.replace("/workspace");
      return; 
    }
  };
  
  const onSelect = (assistant: ASSISTANT) => {
    const item = selectedAssistant.find((item: ASSISTANT) => item.id === assistant.id);
    if (item) {
      setSelectedAssistant(selectedAssistant.filter((item: ASSISTANT) => item.id !== assistant.id));
      return;
    }
    setSelectedAssistant((prev) => [...prev, assistant]);
  };

  const IsAssistantSelected = (assistant: ASSISTANT) => {
    const item = selectedAssistant.find((item: ASSISTANT) => item.id === assistant.id);
    return item ? true : false;
  };

  const onClickContinue = async () => {
    setLoading(true);
    //console.log("User object:", user); // Log the user object to verify it has an id field
    const result = await insertAssistant({
      records: selectedAssistant,
      uid: user?._id,
    });
    setLoading(false);
   // console.log(result);
  };

  return (
    <div className="px-10 mt-20 md:px-28 lg:px-36 xl:px-48">
      <div className="flex justify-between items-center">
        <div>
          <BlurFade delay={0.25 * 1 * 0.05} inView>
            <h2 className="text-2xl font-bold">Welcome to the World of AI Assistants🤖</h2>
          </BlurFade>
          <BlurFade delay={0.25 * 2 * 0.05} inView>
            <p className="mt-2 text-lg">Choose your AI Companion to Simplify Your Task 🚀</p>
          </BlurFade>
        </div>
        <Button
          disabled={selectedAssistant?.length == 0 || loading}
          onClick={onClickContinue}
        >
          {loading && <Loader2Icon className="animate-spin" />}
          Continue
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
        {AiAssistantsList.map((assistant, index) => (
          <BlurFade key={assistant.image} delay={0.25 + index * 0.05} inView>
            <div
              key={index}
              className="hover:border-gray-300 border-2 p-3 rounded-xl hover:scale-105 transition-all ease-in-out cursor-pointer relative"
              onClick={() => onSelect(assistant)}
            >
              <Checkbox className="absolute m-2 border-black" checked={IsAssistantSelected(assistant)} />
              <Image
                src={assistant.image}
                alt={assistant.title}
                width={600}
                height={600}
                className="rounded-xl w-full h-[200px]"
              />
              <h2 className="text-center font-bold text-large">{assistant.name}</h2>
              <h2 className="text-center text-gray-600 dark:text-grey-600">{assistant.title}</h2>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default AIassistants;