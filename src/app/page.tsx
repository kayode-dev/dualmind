import Image from "next/image";
import openAi from "@/assets/openai-white-logomark.png";
import gemini from "@/assets/google-gemini-icon.png";
import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 gap-8 md:gap-20 sm:p-20">
      <p className="text-lg md:text-3xl font-semibold">dualmind AI🤖</p>
      <div className="border-2 border-neutral-100  p-3 md:p-8 md:text-lg md:w-1/2 leading-loose shadow-[10px_10px_0px_3px_white]">
        <p>
          This project is a simple web app that leverages the power of two
          advanced AI models—{" "}
          <span className="inline-flex items-center gap-2 px-2 py-1 bg-neutral-900 rounded-md text-sm md:text-base w-max border border-neutral-700">
            <Image src={openAi} alt="open ai logo" className="size-4" />
            <span>OpenAI&apos;s ChatGPT</span>
          </span>{" "}
          and{" "}
          <span className="inline-flex items-center gap-2 px-2 py-1 bg-neutral-900 rounded-md text-sm md:text-base w-max border border-neutral-700">
            <Image src={gemini} alt="gemini logo" className="size-4" />
            <span>Google Gemini</span>
          </span>
          . Users can select which AI model to interact with or opt to receive
          responses from both, enabling a unique comparative experience. The app
          is designed to highlight the distinct ways these models interpret
          prompts, deliver responses, and generate insights. Whether you&apos;re
          curious about AI capabilities or exploring creative possibilities,
          this platform offers an engaging and interactive space for discovery.
        </p>
      </div>
      <Link
        href="/app"
        className="border-2 border-white px-4 py-2 font-semibold hover:bg-white hover:text-black ease-in transition-colors"
      >
        Get Started
      </Link>
    </div>
  );
}
