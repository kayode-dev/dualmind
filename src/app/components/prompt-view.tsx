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

import { ArrowUp, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { generateChatGPTResponse, generateGeminiResponse } from "@/lib/action";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Markdown from "react-markdown";
import Image from "next/image";
import openAi from "@/assets/openai-white-logomark.png";
import gemini from "@/assets/google-gemini-icon.png";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const promptSchema = z.object({
  prompt: z
    .string()
    .min(10, "This prompt is too short")
    .max(
      300,
      "This prompt is too long, prompts can have a maximum of 300 characters"
    ),
  useGpt: z.boolean().default(false),
  useGemini: z.boolean().default(false),
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
      useGpt: true,
      useGemini: true,
    },
  });

  const [gptChatHistory, setGptChatHistory] = useState<ChatHistoryType[]>([]);
  const [geminiChatHistory, setGeminiChatHistory] = useState<ChatHistoryType[]>(
    []
  );

  const [activeTab, setActivTab] = useState<"gpt" | "gemini">("gpt");

  const { mutateAsync: mutateGPT, isPending: gptPending } = useMutation({
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
    onError: (err) => {
      setGptChatHistory((prev) => [
        ...prev,
        {
          from: "assistant",
          response: err.message,
        },
      ]);
    },
  });
  const { mutateAsync: mutateGemini, isPending: geminiPending } = useMutation({
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
    onError: (err) => {
      setGeminiChatHistory((prev) => [
        ...prev,
        {
          from: "assistant",
          response: err.message,
        },
      ]);
    },
  });
  const isPending = gptPending || geminiPending;

  const handleSubmit = ({ useGemini, useGpt, prompt }: PromptInputType) => {
    if (useGpt) {
      if (!useGemini) setActivTab("gpt");
      setGptChatHistory((prev) => [
        ...prev,
        { from: "user", response: prompt },
      ]);
      mutateGPT(prompt);
    }
    if (useGemini) {
      if (!useGpt) setActivTab("gemini");
      setGeminiChatHistory((prev) => [
        ...prev,
        { from: "user", response: prompt },
      ]);
      mutateGemini(prompt);
    }

    form.resetField("prompt");
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 h-full overflow-y-auto w-full justify-center ease-in duration-300",
        {
          "justify-between":
            gptChatHistory.length > 0 || geminiChatHistory.length > 0,
        }
      )}
    >
      {gptChatHistory.length == 0 && geminiChatHistory.length === 0 ? (
        <div className="w-full max-w-3xl text-center mb-10 mx-auto flex flex-col gap-4 items-center justify-center">
          <p className="text-2xl md:text-4xl font-semibold">
            Compare responses from{" "}
            <span className="inline-flex items-center gap-2 px-2 py-1 bg-neutral-900 rounded-md text-xs md:text-base w-max border border-neutral-700">
              <Image src={openAi} alt="open ai logo" className="size-4" />
              <span>OpenAI&apos;s ChatGPT</span>
            </span>{" "}
            and{" "}
            <span className="inline-flex items-center gap-2 px-2 py-1 bg-neutral-900 rounded-md text-xs md:text-base w-max border border-neutral-700">
              <Image src={gemini} alt="gemini logo" className="size-4" />
              <span>Google Gemini</span>
            </span>{" "}
            in one seamless experience.
          </p>
          <p className="text-sm md:text-base text-neutral-400">
            Interact with OpenAI&apos;s ChatGPT and Google Gemini to compare
            answers, insights, and perspectives all in one place.
          </p>
        </div>
      ) : (
        <div>
          <div className="md:grid grid-cols-2 gap-4 hidden">
            <GptChatBox chatHistory={gptChatHistory} pending={gptPending} />
            <GemimiChatBox
              chatHistory={geminiChatHistory}
              pending={geminiPending}
            />
          </div>
          <Tabs
            className="w-full relative flex flex-col max-h-[calc(100dvh-300px)] md:hidden"
            defaultValue={activeTab}
            value={activeTab}
          >
            <TabsList className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm">
              <TabsTrigger
                value="gpt"
                onClick={() => {
                  setActivTab("gpt");
                }}
              >
                <GPTBadge />
              </TabsTrigger>
              <TabsTrigger
                value="gemini"
                className="data-[state=active]:bg-gradient-to-b data-[state=active]:from-light-purple/10 data-[state=active]:to-shiny-blue/10"
                onClick={() => {
                  setActivTab("gemini");
                }}
              >
                <GeminiBadge />
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="gpt" className="space-y-4 h-full">
                <GptChatBox chatHistory={gptChatHistory} pending={gptPending} />
              </TabsContent>
              <TabsContent value="gemini" className="space-y-4 h-full">
                <GemimiChatBox
                  chatHistory={geminiChatHistory}
                  pending={geminiPending}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 bg-neutral-900 p-4 rounded-md border mx-auto w-full max-w-7xl border-neutral-600"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="What would you like to know?"
                    className="w-full resize-none p-0"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-end justify-between">
            <div className="flex gap-2 items-center">
              <FormField
                control={form.control}
                name="useGpt"
                render={({ field }) => (
                  <FormItem className="bg-black rounded-md text-xs w-max border border-neutral-700 p-1">
                    <GPTBadge />
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="useGemini"
                render={({ field }) => (
                  <FormItem className="bg-black rounded-md text-xs w-max border border-neutral-700 p-1">
                    <GeminiBadge />
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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

const GPTBadge = () => {
  return (
    <span className="inline-flex items-center text-sm gap-2 px-2 py-1">
      <Image src={openAi} alt="open ai logo" className="size-4" />
      <span className="hidden md:block">OpenAI&apos;s ChatGPT</span>
    </span>
  );
};
const GeminiBadge = () => {
  return (
    <span className="inline-flex items-center text-sm gap-2 px-2 py-1">
      <Image src={gemini} alt="gemini logo" className="size-4" />
      <span className="hidden md:block">Google Gemini</span>
    </span>
  );
};

const ChatThread = ({ from, response, totalTokenCount }: ChatHistoryType) => {
  return (
    <div>
      <div className="flex gap-2">
        <p className="font-bold">{from === "user" ? "Q" : "A"}:</p>{" "}
        {from === "user" ? (
          <p className="font-bold italic">{response}</p>
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

const GptChatBox = ({
  chatHistory,
  pending,
}: {
  chatHistory: ChatHistoryType[];
  pending: boolean;
}) => {
  return (
    <div className=" md:p-6 rounded-md md:border border-neutral-600 md:bg-neutral-800/50 md:h-[56vh] space-y-4 flex flex-col">
      <div className="p-1 bg-neutral-950 w-max border border-neutral-600 hidden md:block rounded-lg">
        <GPTBadge />
      </div>
      <div className="overflow-y-auto space-y-4">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <ChatThread key={chat.response} {...chat} />
          ))
        ) : (
          <p>No messages yet...</p>
        )}
        {pending && <p>A: ...</p>}
      </div>
    </div>
  );
};
const GemimiChatBox = ({
  chatHistory,
  pending,
}: {
  chatHistory: ChatHistoryType[];
  pending: boolean;
}) => {
  return (
    <div className="md:p-6 md:border border-neutral-800 md:bg-gradient-to-b from-light-purple/10 to-shiny-blue/10 md:h-[56vh] md:bg-black rounded-md space-y-4 flex flex-col">
      <div className="p-1 bg-neutral-950 w-max border border-neutral-600 hidden md:block rounded-lg">
        <GeminiBadge />
      </div>
      <div className="overflow-y-auto space-y-4">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            <ChatThread key={chat.response} {...chat} />
          ))
        ) : (
          <p>No messages yet...</p>
        )}
        {pending && <p>A: ...</p>}
      </div>
    </div>
  );
};
