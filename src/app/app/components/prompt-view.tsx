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
import { generateChatGPTResponse, generateGeminiResponse } from "@/lib/action";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Markdown from "react-markdown";

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
type ChatHistoryType = {
  from: "user" | "assistant";
  response: string;
  totalTokenCount?: number;
};

export const PromptView = () => {
  const form = useForm<PromptInputType>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const [gptChatHistory, setGptChatHistory] = useState<ChatHistoryType[]>([]);
  const [geminiChatHistory, setGeminiChatHistory] = useState<ChatHistoryType[]>(
    []
  );

  const { mutate: mutateGPT, isPending: gptPending } = useMutation({
    mutationFn: generateChatGPTResponse,
    onSuccess: ({ response, tokenCount }) => {
      setGptChatHistory((prev) => [
        ...prev,
        {
          from: "assistant",
          response: response ?? "",
          totalTokenCount: tokenCount,
        },
      ]);
    },
  });
  const {
    mutate: mutateGemini,
    isPending: geminiPending,
    submittedAt,
  } = useMutation({
    mutationFn: generateGeminiResponse,
    onSuccess: ({ response, tokenCount }) => {
      setGeminiChatHistory((prev) => [
        ...prev,
        {
          from: "assistant",
          response: response ?? "",
          totalTokenCount: tokenCount,
        },
      ]);
    },
  });
  const isPending = gptPending || geminiPending;

  const handleSubmit = ({ model, prompt }: PromptInputType) => {
    console.log(submittedAt);
    console.log(gptChatHistory);
    if (model === ModelTypes.GPT4) {
      setGptChatHistory((prev) => [
        ...prev,
        { from: "user", response: prompt },
      ]);
      mutateGPT(prompt);
    }
    if (model === ModelTypes.GEMINI) {
      setGeminiChatHistory((prev) => [
        ...prev,
        { from: "user", response: prompt },
      ]);
      mutateGemini(prompt);
    }
    if (model === ModelTypes.BOTH) {
      setGptChatHistory((prev) => [
        ...prev,
        { from: "user", response: prompt },
      ]);
      setGeminiChatHistory((prev) => [
        ...prev,
        { from: "user", response: prompt },
      ]);
      mutateGemini(prompt);
      mutateGPT(prompt);
    }

    form.resetField("prompt");
  };

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-4 h-full overflow-y-scroll justify-between">
      <Tabs className="w-full mx-auto flex-1" defaultValue="gpt">
        <TabsList>
          <TabsTrigger value="gpt">CHAT GPT</TabsTrigger>
          <TabsTrigger value="gemini">Gemini</TabsTrigger>
        </TabsList>
        <TabsContent value="gpt" className="space-y-4">
          <p className="text-xl md:text-2xl font-black">
            CHAT HISTORY(GPT 4.0)
          </p>
          <div className="space-y-4 h-[calc(100vh-320px)] md:h-[calc(100vh-385px)] overflow-y-auto md:text-lg">
            {gptChatHistory.length > 0 ? (
              gptChatHistory.map((chat) => (
                <ChatThread key={chat.response} {...chat} />
              ))
            ) : (
              <p>No messages yet...</p>
            )}
            {gptPending && <p>A: ...</p>}
          </div>
        </TabsContent>
        <TabsContent value="gemini" className="space-y-4">
          <p className="text-xl md:text-2xl font-black">
            CHAT HISTORY(GEMINI FLASh)
          </p>
          <div className="space-y-4 h-[calc(100vh-320px)] md:h-[calc(100vh-385px)] overflow-y-auto md:text-lg">
            {geminiChatHistory.length > 0 ? (
              geminiChatHistory.map((chat) => (
                <ChatThread key={chat.response} {...chat} />
              ))
            ) : (
              <p>No messages yet...</p>
            )}
            {geminiPending && <p>A: ...</p>}
          </div>
        </TabsContent>
      </Tabs>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="">
          <div className="flex items-end gap-4 justify-between">
            <div className="w-full flex flex-col md:flex-row gap-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="What would you like to know?"
                        className="w-full"
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
                  <FormItem className="self-end">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="self-end">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={ModelTypes.BOTH}>BOTH</SelectItem>
                        <SelectItem value={ModelTypes.GEMINI}>
                          Gemini
                        </SelectItem>
                        <SelectItem value={ModelTypes.GPT4}>GPT4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

const ChatThread = ({ from, response, totalTokenCount }: ChatHistoryType) => {
  return (
    <div>
      <div className="flex gap-2">
        <p className="font-bold">{from === "user" ? "Q" : "A"}:</p>{" "}
        {from === "user" ? (
          <p>{response}</p>
        ) : (
          <div className="space-y-2">
            <Markdown>{response}</Markdown>
          </div>
        )}
      </div>
      {totalTokenCount && (
        <div className="flex gap-4">
          <p className="text-sm text-neutral-500">
            Total Token Count: {totalTokenCount}
          </p>
          <p className="text-sm text-neutral-500">
            Word Count: {response.length}
          </p>
        </div>
      )}
    </div>
  );
};
