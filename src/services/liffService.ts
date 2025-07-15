import liff from '@line/liff';

export interface LiffConfig {
  liffId: string;
  mock?: boolean;
  mockUserId?: string;
}

class LiffService {
  private static instance: LiffService;
  private isInitialized = false;
  private currentUserId: string | null = null;
  private config: LiffConfig | null = null;
  private currentLiffId: string | null = null;

  private constructor() {}

  static getInstance(): LiffService {
    if (!LiffService.instance) {
      LiffService.instance = new LiffService();
    }
    return LiffService.instance;
  }

  async init(config: LiffConfig): Promise<void> {
    this.config = config;
    
    // 如果LIFF ID相同且已經初始化，直接返回
    if (this.isInitialized && this.currentLiffId === config.liffId && this.currentUserId) {
      console.log('LIFF already initialized with same ID:', config.liffId);
      return;
    }

    // 如果是mock模式，使用mock userId
    if (config.mock && config.mockUserId) {
      this.currentUserId = config.mockUserId;
      this.currentLiffId = config.liffId;
      this.isInitialized = true;
      console.log('LIFF Mock Mode - Using mock user ID:', this.currentUserId);
      return;
    }

    try {
      console.log('Initializing LIFF with ID:', config.liffId);
      await liff.init({ liffId: config.liffId });
      this.currentLiffId = config.liffId;
      
      if (liff.isLoggedIn()) {
        const profile = await liff.getProfile();
        this.currentUserId = profile.userId;
        console.log('LIFF initialized successfully, user ID:', this.currentUserId);
      } else {
        console.log('User not logged in, redirecting to LINE login');
        liff.login();
        return;
      }
    } catch (error) {
      console.error('LIFF initialization failed:', error);
      throw new Error(`LIFF initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    this.isInitialized = true;
  }

  // 重新初始化LIFF（當路由改變時）
  async reinitialize(config: LiffConfig): Promise<void> {
    if (this.currentLiffId !== config.liffId) {
      console.log('Reinitializing LIFF for new route:', config.liffId);
      this.isInitialized = false;
      this.currentUserId = null;
      this.currentLiffId = null;
      await this.init(config);
    }
  }

  getUserId(): string | null {
    return this.currentUserId;
  }

  isReady(): boolean {
    return this.isInitialized && this.currentUserId !== null;
  }

  async logout(): Promise<void> {
    if (this.config?.mock) {
      this.currentUserId = null;
      console.log('Mock logout');
      return;
    }
    
    if (liff.isLoggedIn()) {
      liff.logout();
    }
    this.currentUserId = null;
  }

  async getProfile() {
    if (this.config?.mock) {
      return {
        userId: this.currentUserId,
        displayName: 'Test User',
        pictureUrl: 'https://via.placeholder.com/150',
        statusMessage: 'Development Mode'
      };
    }
    
    if (liff.isLoggedIn()) {
      return await liff.getProfile();
    }
    return null;
  }

  // 檢查是否在 LINE 應用程式中
  isInClient(): boolean {
    if (this.config?.mock) {
      return false;
    }
    return liff.isInClient();
  }

  // 關閉 LIFF 應用程式
  closeWindow(): void {
    if (this.config?.mock) {
      console.log('Mock close window');
      return;
    }
    
    if (liff.isInClient()) {
      liff.closeWindow();
    }
  }

  // 發送訊息到 LINE
  async sendMessage(message: any): Promise<void> {
    if (this.config?.mock) {
      console.log('Mock send message:', message);
      return;
    }
    
    if (liff.isInClient()) {
      await liff.sendMessages([message]);
    }
  }

  // 獲取當前的LIFF ID
  getCurrentLiffId(): string | null {
    return this.currentLiffId;
  }
}

export default LiffService.getInstance(); 