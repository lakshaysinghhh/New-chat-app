import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen w-full flex justify-center px-3 sm:px-6 lg:px-8 pt-16">

      <div className="w-full max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">

          {THEMES.map((t) => (

            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`
                group flex flex-col items-center gap-2 p-2 rounded-lg transition
                ${theme === t ? "bg-base-200 shadow" : "hover:bg-base-200/60"}
              `}
            >

              {/* Theme Color Preview */}
              <div
                className="relative h-9 w-full rounded-md overflow-hidden"
                data-theme={t}
              >
                <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">

                  <div className="rounded bg-primary"></div>
                  <div className="rounded bg-secondary"></div>
                  <div className="rounded bg-accent"></div>
                  <div className="rounded bg-neutral"></div>

                </div>
              </div>

              {/* Theme Name */}
              <span className="text-xs font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>

            </button>

          ))}

        </div>

        {/* Chat Preview */}
        <div className="bg-base-200 rounded-xl p-4 space-y-3 max-w-md mx-auto">

          {PREVIEW_MESSAGES.map((msg) => (

            <div
              key={msg.id}
              className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
            >

              <div
                className={`
                  max-w-[75%] px-3 py-2 rounded-lg text-sm
                  ${msg.isSent ? "bg-primary text-primary-content" : "bg-base-100"}
                `}
              >
                {msg.content}
              </div>

            </div>

          ))}

          {/* Input preview */}
          <div className="flex items-center gap-2 pt-2">

            <input
              type="text"
              placeholder="Type a message..."
              className="input input-bordered input-sm w-full"
              disabled
            />

            <button className="btn btn-primary btn-sm">
              <Send size={16} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsPage;



