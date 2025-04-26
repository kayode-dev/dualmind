import { PromptView } from "./components/prompt-view";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-max flex-1 p-3 md:p-8 gap-8 md:gap-5 sm:p-20">
      <PromptView />
    </div>
  );
}
