"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { availableModels } from "@/lib/constants";
import { ModelTypes } from "@/lib/types";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";
import { ArrowUp, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { generateChatGPTResponse } from "@/lib/action";
import { useState } from "react";

const promptSchema = z.object({
  prompt: z
    .string()
    .min(10, "This prompt is too short")
    .max(
      300,
      "This prompt is too long, prompts can have a maximum of 300 characters"
    ),
  model: availableModels,
});

type PromptInputType = z.infer<typeof promptSchema>;
type ChatHistoryType = { from: "user" | "assistant"; response: string };

export const PromptView = () => {
  const form = useForm<PromptInputType>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const [chatHistory, setChatHistory] = useState<ChatHistoryType[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: generateChatGPTResponse,
    onSuccess: (response) => {
      setChatHistory((prev) => [
        ...prev,
        { from: "assistant", response: response || "" },
      ]);
    },
  });

  const handleSubmit = ({ model, prompt }: PromptInputType) => {
    setChatHistory((prev) => [...prev, { from: "user", response: prompt }]);
    console.log(chatHistory);
    if (model === ModelTypes.GPT4) {
      mutate(prompt);
    }
    form.resetField("prompt");
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-4 h-full justify-between">
      <p className="text-xl md:text-2xl font-black">CHAT HISTORY</p>
      <div className="space-y-4 h-[68vh] overflow-y-auto md:text-lg">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <p key={chat.response}>
              <span className="font-bold">
                {chat.from === "user" ? "Q" : "A"}:
              </span>{" "}
              {chat.response}
            </p>
          ))
        ) : (
          <p>No messages yet...</p>
        )}
        {isPending && <p>A: ...</p>}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="">
          <div className="flex items-center gap-4 justify-between">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="What would you like to know?"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ModelTypes.BOTH}>BOTH</SelectItem>
                      <SelectItem value={ModelTypes.GEMINI}>Gemini</SelectItem>
                      <SelectItem value={ModelTypes.GPT4}>GPT4</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              disabled={isPending}
              className="p-2 rounded-full bg-white text-black"
            >
              {isPending ? <Loader className="animate-spin" /> : <ArrowUp />}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
