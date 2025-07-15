declare module '@line/liff' {
  interface LiffProfile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
  }

  interface LiffInitConfig {
    liffId: string;
  }

  interface LiffMessage {
    type: string;
    text?: string;
    [key: string]: any;
  }

  interface Liff {
    init(config: LiffInitConfig): Promise<void>;
    isLoggedIn(): boolean;
    login(): void;
    logout(): void;
    getProfile(): Promise<LiffProfile>;
    isInClient(): boolean;
    closeWindow(): void;
    sendMessages(messages: LiffMessage[]): Promise<void>;
    getAccessToken(): string;
    getIDToken(): string;
    getDecodedIDToken(): any;
    getContext(): any;
    getOS(): string;
    getLanguage(): string;
    getVersion(): string;
    getLineVersion(): string;
    isApiAvailable(apiName: string): boolean;
    shareTargetPicker(messages: LiffMessage[]): Promise<void>;
    scanCodeV2(): Promise<{ value: string }>;
    openWindow(params: { url: string; external?: boolean }): void;
  }

  const liff: Liff;
  export default liff;
} 