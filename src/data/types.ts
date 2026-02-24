export type MoodCheckIn = {
  timestamp: string;
  words: string[];
  suggestedWordsUsed: string[];
  intensity: {
    energy: number | null;
    stress: number | null;
    anxiety: number | null;
    joy: number | null;
  };
  contextTags: string[];
};

export type CheckInsRange = {
  fromIso: string;
  toIso: string;
};

export type AuthState = "connected" | "needs_login" | "initializing";

export interface RatingsStoreAdapter {
  init(): Promise<void>;
  appendCheckIn(entry: MoodCheckIn): Promise<void>;
  listCheckIns(range: CheckInsRange): Promise<MoodCheckIn[]>;
  loadSettings?(): Promise<Record<string, string>>;
  saveSettings?(settings: Record<string, string>): Promise<void>;
  getSourceUrl?(): string | null;
  getAccountLabel?(): string | null;
  isReady(): boolean;
  getAuthState(): AuthState;
  requestSignIn?(): Promise<void>;
}
