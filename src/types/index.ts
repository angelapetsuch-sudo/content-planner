export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  receipt?: string;
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  status: 'idea' | 'planned' | 'in-progress' | 'completed';
  createdAt: string;
  scheduledDate?: string;
  tags: string[];
}

export interface Sponsorship {
  id: string;
  brand: string;
  amount: number;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  startDate: string;
  endDate?: string;
  deliverables: string;
  notes?: string;
}

export interface Analytics {
  id: string;
  platform: string;
  date: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  newFollowers: number;
}

export interface Post {
  id: string;
  date: string;
  platform: string;
  content: string;
  hook?: string;
  caption?: string;
  status: 'scheduled' | 'published' | 'draft';
  performanceMetrics?: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
}

export interface AIGeneratedContent {
  id: string;
  type: 'hook' | 'caption' | 'idea';
  content: string;
  timestamp: string;
  saved: boolean;
}

export interface TrendingSound {
  id: string;
  name: string;
  artist: string;
  platform: string;
  popularity: number;
  genre: string;
}

export interface SubscriptionStatus {
  isActive: boolean;
  expiryDate?: string;
  tier: 'free' | 'premium';
}
