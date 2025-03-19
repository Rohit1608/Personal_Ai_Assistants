import FrontPageHeader from "./(main)/_components/FrontPageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react"
// 1. Import the Carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Top Header */}
      <FrontPageHeader />

      {/* Hero Section */}
      <main className="mt-10 px-4 text-center">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-600">
          Introducing Personal AI Assistance
        </span>

        <h1 className="mt-6 text-5xl font-extrabold leading-tight">
          Yours Personal{" "}
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text">
            AI Assistance
          </span>
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Automate your tasks and simplify your workflow
        </p>

        <Button className="mt-8" size="lg">
          Get Started
        </Button>

        {/* 2. Replace the single image with a Carousel */}
        <div className="mt-10">
        <Carousel className="relative">
      <CarouselContent className="flex items-center">
        <CarouselItem>
          <Image
            src="/Pic1.png"
            alt="First Image"
            width={800}
            height={500}
            className="mx-auto rounded-lg shadow-lg"
          />
        </CarouselItem>
        <CarouselItem>
          <Image
            src="/Pic2.png"
            alt="Second Image"
            width={800}
            height={500}
            className="mx-auto rounded-lg shadow-lg"
          />
        </CarouselItem>
      </CarouselContent>

      {/* Left Arrow */}
      <CarouselPrevious className="absolute left-[350px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
        <ChevronLeft className="w-4 h-4" />
      </CarouselPrevious>

      {/* Right Arrow */}
      <CarouselNext className="absolute right-[350px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
        <ChevronRight className="w-4 h-4" />
      </CarouselNext>
    </Carousel>
        </div>
      </main>
    </div>
  );
}
