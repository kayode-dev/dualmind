import { PromptView } from "./components/prompt-view";

export default function MainApplication() {
  return (
    <div className="flex-1 flex flex-col justify-between p-2 md:p-8">
      <PromptView />
    </div>
  );
}
