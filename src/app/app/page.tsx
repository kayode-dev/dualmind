import { QueryProvider } from "../components/query-provider";
import { PromptView } from "./components/prompt-view";

export default function MainApplication() {
  return (
    <QueryProvider>
      <div className="flex-1 p-2 md:p-8">
        <PromptView />
      </div>
    </QueryProvider>
  );
}
