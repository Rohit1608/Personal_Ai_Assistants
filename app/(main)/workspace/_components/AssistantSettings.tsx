"use client";
import { AssistantContext } from "@/context/AssistantContext";
import React, { useContext, useState } from "react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AiModelOptions from "@/services/AiModelOptions";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Save, Trash } from "lucide-react";
import { Value } from "@radix-ui/react-select";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import ConfirmationAlert from "../ConfirmationAlert";
import { BlurFade } from "@/components/magicui/blur-fade";
//import { toast } from "sonner";

function AssistantSettings() {
  const { assistant, setAssistant } = useContext(AssistantContext);
  const UpdateAssistant=useMutation(api.userAiAssistants.UpdateUserAiAssistant)
  const DeleteAssistant=useMutation(api.userAiAssistants.DeleteAssistant)
  const [loading, setLoading]=useState(false);
  const onHandleInputChange=(field:string,value:string)=> {
    setAssistant((prev: any) => ({
      ...prev,
      [field]: value
    }));
  }
  
  const OnSave= async()=>{
   setLoading(true)

   const result = await UpdateAssistant({
    id:assistant?._id,
    aiModelId:assistant?.aiModelId ||AiModelOptions[0].name,
    userInstruction:assistant?.userInstruction
   })
   
   toast("Saved!")

   setLoading(false);
  } 

 const OnDelete=async()=>{
  console.log("OnDelete");
  setLoading(true)
  await DeleteAssistant({
    id:assistant?._id
  })
  setAssistant(null);
  setLoading(false);
  
 }

  return (
    assistant && (
      // 1. Make sure the container is "relative" if you want absolute positioning inside
      <div className="relative p-5 bg-gray-100 border-r-[1px] h-screen">
        <h2 className="font-bold text-xl">Settings</h2>
        <BlurFade delay={0.25}>
        <div className="mt-4 flex gap-3 items-center">
          <Image
            src={assistant?.image}
            alt="assistant"
            width={100}
            height={100}
            className="rounded-xl h-[80px] w-[80px]"
          />
          <div>
            <h2 className="font-bold">{assistant?.name}</h2>
            <p className="text-gray-600 text-sm dark:text-black">
              {assistant?.title}
            </p>
          </div>
        </div>
        </BlurFade>
        <BlurFade delay={0.25*2}>
        <div className="mt-4 ">
          <h2 className="text-gray-500 ">Model:</h2>
          <Select defaultValue={assistant.aiModelId} onValueChange={(Value)=>onHandleInputChange('aiModelId',Value)}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {AiModelOptions.map((model, index) => (
                <SelectItem key={index} value={model.name}>
                  <div key={index} className="flex gap-2 items-center m-1">
                    <Image
                      src={model.logo}
                      alt={model.name}
                      width={20}
                      height={20}
                      className="rounded-md"
                    />
                    <h2>{model.name}</h2>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        </BlurFade>
        <BlurFade delay={0.25*3}>
        <div className="mt-4">
          <h2 className="text-gray-500">Instruction:</h2>
          <Textarea
            className="h-[180px] bg-white border border-gray-300"
            placeholder="Add Instruction"
            value={assistant?.userInstruction}
            onChange={(e)=>onHandleInputChange('userInstruction',e.target.value)}
          />
        </div>
        </BlurFade>
        {/* 2. Position the buttons at the bottom-right corner. 
            Remove 'w-full' so they do not stretch. */}
        <div className="absolute bottom-10 left-5 flex gap-5">
          <ConfirmationAlert OnDelete={OnDelete}>
          <Button  disabled={loading} className="bg-black text-white shadow-xs hover:bg-black/90 " variant="ghost" ><Trash/> 
            Delete
          </Button>
          </ConfirmationAlert>
          <Button className="bg-black text-white shadow-xs hover:bg-black/90" onClick={OnSave} disabled={loading}>{loading?<Loader2Icon  className="animate-spin " />:<Save/>} 
            Save
          </Button>
        </div>
      </div>
    )
  );
}

export default AssistantSettings;
