"use client";

import { Eye, EyeOff } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const SENSITIVE_CONTENT_STORAGE_KEY = "open-image-templates.show-sensitive-content";
const SENSITIVE_CONTENT_CHANGE_EVENT = "oit-sensitive-content-change";
let inMemorySensitiveContentPreference = false;

type SensitiveContentContextValue = {
  preferenceRevision: number;
  showSensitiveContent: boolean;
  setShowSensitiveContent: (show: boolean) => void;
};

const SensitiveContentContext = createContext<SensitiveContentContextValue | null>(null);

export function SensitiveContentProvider({ children }: { children: React.ReactNode }) {
  const [preferenceRevision, setPreferenceRevision] = useState(0);
  const subscribe = useCallback((onStoreChange: () => void) => {
    function handlePreferenceChange() {
      setPreferenceRevision((current) => current + 1);
      onStoreChange();
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== SENSITIVE_CONTENT_STORAGE_KEY) return;
      handlePreferenceChange();
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(SENSITIVE_CONTENT_CHANGE_EVENT, handlePreferenceChange);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(SENSITIVE_CONTENT_CHANGE_EVENT, handlePreferenceChange);
    };
  }, []);

  const showSensitiveContent = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(SENSITIVE_CONTENT_STORAGE_KEY) === "true";
      } catch {
        return inMemorySensitiveContentPreference;
      }
    },
    () => false,
  );

  const setShowSensitiveContent = useCallback((show: boolean) => {
    inMemorySensitiveContentPreference = show;
    try {
      window.localStorage.setItem(SENSITIVE_CONTENT_STORAGE_KEY, String(show));
    } catch {
      // The custom event still updates this tab when storage is unavailable.
    }
    window.dispatchEvent(new Event(SENSITIVE_CONTENT_CHANGE_EVENT));
  }, []);

  const value = useMemo(
    () => ({
      preferenceRevision,
      showSensitiveContent,
      setShowSensitiveContent,
    }),
    [preferenceRevision, setShowSensitiveContent, showSensitiveContent],
  );

  return (
    <SensitiveContentContext.Provider value={value}>
      {children}
    </SensitiveContentContext.Provider>
  );
}

export function useSensitiveContent() {
  const value = useContext(SensitiveContentContext);
  if (!value) {
    throw new Error("useSensitiveContent must be used inside SensitiveContentProvider");
  }
  return value;
}

export function SensitiveContentToggle() {
  const { showSensitiveContent, setShowSensitiveContent } = useSensitiveContent();

  return (
    <button
      type="button"
      onClick={() => setShowSensitiveContent(!showSensitiveContent)}
      aria-pressed={showSensitiveContent}
      aria-label={
        showSensitiveContent
          ? "Hide sensitive template previews"
          : "Show sensitive template previews"
      }
      title={
        showSensitiveContent
          ? "Hide sensitive template previews"
          : "Show sensitive template previews"
      }
      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-3 text-xs font-semibold text-zinc-800 shadow-sm transition hover:border-black/20 hover:bg-zinc-50"
    >
      {showSensitiveContent ? (
        <EyeOff size={16} aria-hidden="true" />
      ) : (
        <Eye size={16} aria-hidden="true" />
      )}
      <span className="hidden sm:inline">
        {showSensitiveContent ? "Hide 18+" : "Show 18+"}
      </span>
      <span className="sm:hidden">18+</span>
    </button>
  );
}
