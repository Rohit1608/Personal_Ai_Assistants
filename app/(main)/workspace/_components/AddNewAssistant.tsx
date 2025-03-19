import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AiAssistantsList from "@/services/AiAssistantsList";
import { Input } from "@/components/ui/input";
import { ASSISTANT } from "../../ai-assistants/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AiModelOptions from "@/services/AiModelOptions";
import { Textarea } from "@/components/ui/textarea";
import AssistantAvatar from "./AssistantAvatar";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { AuthContext } from "@/context/AuthContext";
import { AssistantContext } from "@/context/AssistantContext";
import { Loader2Icon } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

const DEFAULT_ASSISTANT = {
  image: "/bug-fixer.avif",
  name: "",
  title: "",
  instruction: "",
  id: 0,
  sampleQuestions: [],
  userInstruction: "",
  aiModelId: "",
};

function AddNewAssistant({ children }: any) {
  const [selectedAssistant, setSelectedAssistant] =
    useState<ASSISTANT>(DEFAULT_ASSISTANT);
  const AddAssistant=useMutation(api.userAiAssistants.InsertSelectedAssistants)
  const {user}=useContext(AuthContext)
  const [loading,setLoading]=useState(false);
  const {assistant,setAssistant}=useContext(AssistantContext)

  const onHandleInputChange = (field: string, value: string) => {
    setSelectedAssistant((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };
  const onSave=async()=>{

    if(!selectedAssistant?.name||!selectedAssistant.title||!selectedAssistant.userInstruction)
    {
        toast('Please enter all details')
        return;
    }
    setLoading(true)
    const result = await AddAssistant({
        records:[selectedAssistant],
        uid: user ? user._id : ""
    })
    toast('New Assistant Added!');
    setAssistant(null);
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AddNewAssistant</DialogTitle>
          <DialogDescription asChild>
            <div className="grid grid-cols-3 gap-5 mt-5">
              <div className=" border-r border-gray-300 p-3">
                <Button
                  variant={"secondary"}
                  size={"sm"}
                  onClick={() => setSelectedAssistant(DEFAULT_ASSISTANT)}
                  className="w-full "
                >
                  +Create New Assistant
                </Button>

                <div className="mt-2 ">
                  {AiAssistantsList.map((assistant, index) => (
                    <div
                      onClick={() => setSelectedAssistant(assistant)}
                      key={index}
                      className="p-2  hover:bg-gray-200 rounded-xl cursor-pointer flex gap-2 items-center"
                    >
                      <Image
                        src={assistant.image}
                        width={60}
                        height={60}
                        alt={assistant.name}
                        className="w-[35px] h-[35px] rounded-lg object-cover"
                      />
                      <h2 className="text-xs">{assistant.title}</h2>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 ">
                <div className="flex gap-5">
                  {selectedAssistant && (
                    <AssistantAvatar selectedImage={(v:string)=>onHandleInputChange('image',v)}>                    
                    <Image
                      src={selectedAssistant?.image}
                      alt="assistant"
                      width={150}
                      height={150}
                      className="w-[100px] h-[100px] rounded-xl cursor-pointer object-cover  "
                    />
                    </AssistantAvatar>
                  )}
                  <div className="flex flex-col gap-3 w-full">
                    <Input
                      placeholder="Name of Assistant"
                      value={selectedAssistant?.name}
                      className="w-full border-gray-300"
                      onChange={(event) =>
                        onHandleInputChange("name", event.target.value)
                      }
                    />
                    <Input
                      placeholder="Title of Assistant"
                      value={selectedAssistant?.title}
                      className="w-full border-gray-300"
                      onChange={(event) =>
                        onHandleInputChange("title", event.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="mt-4 ">
                  <h2 className="text-gray-500">Model:</h2>
                  <Select
                    defaultValue={selectedAssistant?.aiModelId}
                    onValueChange={(Value) =>
                      onHandleInputChange("aiModelId", Value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white border-gray-300">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {AiModelOptions.map((model, index) => (
                        <SelectItem key={index} value={model.name}>
                          <div
                            key={index}
                            className="flex gap-2 items-center m-1"
                          >
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
                <div className="mt-5">
                  <h2 className="text-gray-500">Instruction:</h2>
                  <Textarea
                    className="h-[200-x]  border-gray-300"
                    placeholder="Add Instructions"
                    value={selectedAssistant.userInstruction}
                    onChange={(event) =>
                      onHandleInputChange("userInstruction", event.target.value)
                    }
                  />
                </div>
                <div className="flex gap-5 justify-end mt-10">
                <DialogClose asChild>
                  <Button variant={"secondary"}>Cancel</Button>
                  </DialogClose>
                  <Button disabled={loading}
                  onClick={onSave}
                  >{loading&&<Loader2Icon className='animate-spin'/>}Add</Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewAssistant;
