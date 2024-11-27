"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function ContactUs() {
  const [wordCount, setWordCount] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word !== "").length;
    setWordCount(words);
  };

  return (
    <main className="container mx-auto flex flex-col px-4 py-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-primaryBlue">ENQUIRE NOW</h1>

        <form className="space-y-4 max-w-2xl">
          <Input
            type="text"
            placeholder="Please Enter Your First And Last Name"
          />
          <Input type="tel" placeholder="Please Enter Your Phone Number" />
          <Input type="email" placeholder="Please Enter Your Email Address" />
          <div className="relative">
            <Textarea
              placeholder="Your message"
              className="min-h-[200px]"
              onChange={handleTextChange}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              Words: {wordCount}
            </div>
          </div>
          <div>
            <p className="mb-2">Select the pencil</p>
            <RadioGroup defaultValue="pencil" className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pencil" id="pencil" />
                <Label htmlFor="pencil">✏️</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="briefcase" id="briefcase" />
                <Label htmlFor="briefcase">💼</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="book" id="book" />
                <Label htmlFor="book">📚</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="bg-green-500 hover:bg-green-600">
            Send
          </Button>
        </form>
      </div>
    </main>
  );
}

