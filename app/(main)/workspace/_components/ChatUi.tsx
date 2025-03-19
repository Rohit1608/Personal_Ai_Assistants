"use client"
import React, { useContext, useEffect, useRef, useState } from "react";
import EmptyChatState from "./EmptyChatState";
import { AssistantContext } from "@/context/AssistantContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Send } from "lucide-react";
import AiModelOptions from "@/services/AiModelOptions";
import axios from "axios";
import Image from "next/image";
import scrollbarHide from 'tailwind-scrollbar-hide'


type MESSAGE = {
  role: string;
  content: string;
};

function ChatUi() {
  const [input, setInput] = useState<string>("");
  const { assistant } = useContext(AssistantContext);
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [loading, setLoading] = useState(false);
   const chatRef=useRef<any>(null);
  
  
   useEffect(()=>{
    if(chatRef.current){
        chatRef.current.scrollTop=chatRef.current.scrollHeight
    }
   },[messages])

   useEffect(()=>{
    setMessages([]);
   },
  [assistant?.id]
)

  const onSendMessage = async () => {
    setLoading(true);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      { role: "assistant", content: "Loading..." },
    ]);
    const userInput = input;
    setInput("");
    const AIModel = AiModelOptions.find(
      (item) => item.name === assistant.aiModelId
    );

    const result = await axios.post("/api/eden-ai-model", {
      provider: AIModel?.edenAi,
      userInput: userInput + ":"+ assistant?.instruction+ ":" + assistant?.userInstruction,
      aiResp:messages[messages?.length-1]?.content
    });
    setLoading(false);

    // Remove the "Loading..." placeholder, then add the new message
    setMessages((prev) => prev.slice(0, -1));
    setMessages((prev) => [...prev, result.data]);
  };

  return (
    <div className="mt-20 p-6 h-[88vh] flex flex-col">
      {messages.length === 0 && <EmptyChatState />}

      {/* Main chat area grows to fill remaining space */}
      <div ref={chatRef} className="flex-1 overflow-y-scroll scrollbar-hide">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex gap-3">
              {msg.role === "assistant" && (
                <Image
                  src={assistant?.image}
                  alt="assistant"
                  width={30}
                  height={30}
                  className="w-[30px] h-[30px] rounded-full object-cover mt-4"
                />
              )}
              <div
                className={`p-3 rounded-lg flex gap-2 ${
                  msg.role === "user"
                    ? "bg-gray-200 text-black"
                    : "bg-gray-50 text-black"
                }`}
              >
                {loading && messages.length - 1 === index && (
                  <Loader2Icon className="animate-spin" />
                )}
                <h2>{msg.content}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input area pinned to the bottom by flex layout */}
      <div className="flex justify-between p-5 gap-5 ">
        <Input
          placeholder="Start Typing here..."
          value={input}
          disabled={loading}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
          className='border border-gray-300'
        />
        <Button disabled={loading} onClick={onSendMessage}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatUi;
