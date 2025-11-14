// AI Content Generation Service
// In a production app, this would connect to OpenAI, Anthropic, or similar API
// For now, we'll create a template-based system with realistic examples

export interface AIRequest {
  type: 'hook' | 'caption' | 'idea';
  context?: string;
  platform?: string;
  topic?: string;
}

export class AIService {
  // In production, replace this with actual API key from env
  private static apiKey = 'YOUR_API_KEY_HERE';

  static async generateHook(topic: string, platform: string): Promise<string> {
    // Simulate API call delay
    await this.delay(1000);

    const hooks = {
      general: [
        `Stop scrolling! Here's what nobody tells you about ${topic}...`,
        `I spent $10,000 learning this about ${topic} so you don't have to`,
        `The ${topic} industry doesn't want you to know this...`,
        `This ${topic} hack changed my life in 30 days`,
        `WARNING: Don't try ${topic} until you watch this`,
        `POV: You just discovered the secret to ${topic}`,
        `3 years ago I knew nothing about ${topic}. Today...`,
        `Everyone is doing ${topic} wrong. Here's why:`,
      ],
      instagram: [
        `SAVE THIS! The ultimate ${topic} guide you need`,
        `Nobody talks about this ${topic} truth...`,
        `${topic} tips that actually work (not clickbait)`,
      ],
      tiktok: [
        `#${topic} is trending but here's what they're NOT showing you`,
        `This ${topic} trick has 1M views for a reason`,
        `Trying the viral ${topic} trend... *results shocked me*`,
      ],
      youtube: [
        `I Tried ${topic} For 30 Days - Here's What Happened`,
        `The TRUTH About ${topic} (Everyone Gets This Wrong)`,
        `${topic} Explained in 60 Seconds`,
      ],
    };

    const platformHooks = hooks[platform.toLowerCase() as keyof typeof hooks] || hooks.general;
    return this.getRandomItem(platformHooks);
  }

  static async generateCaption(hook: string, platform: string): Promise<string> {
    await this.delay(1000);

    const emojis = ['✨', '💡', '🔥', '💪', '🎯', '📈', '💰', '🚀', '👉', '⭐'];
    const randomEmojis = this.getRandomItems(emojis, 3).join(' ');

    const captions = [
      `${hook}\n\n${randomEmojis}\n\nI've been in this industry for years, and this is what I wish someone told me from day one. Drop a 💬 if you want the full breakdown!\n\n#creator #contentcreator #businesstips #entrepreneurship #smallbusiness`,

      `${hook}\n\nLet me break it down for you:\n✅ Step 1: [Key point]\n✅ Step 2: [Action item]\n✅ Step 3: [Result]\n\nSave this for later! ${randomEmojis}\n\n#contentcreation #creatoreconomy #businessgrowth #marketingtips`,

      `${hook}\n\nHere's the thing... most people overcomplicate this. But when you focus on what actually matters, everything changes.\n\nDM me "INFO" for the complete guide 📩\n\n#creators #digitalbusiness #growthhacking #contentmarketing #hustle`,
    ];

    return this.getRandomItem(captions);
  }

  static async generateIdea(niche?: string): Promise<{title: string; description: string; platform: string}> {
    await this.delay(1000);

    const ideas = [
      {
        title: 'Behind the Scenes Content Creation',
        description: 'Show your followers the real process behind creating content. People love authenticity!',
        platform: 'Instagram',
      },
      {
        title: 'Day in the Life Vlog',
        description: 'Document a typical day as a creator. Include the highs, lows, and everything in between.',
        platform: 'YouTube',
      },
      {
        title: 'Quick Tips Series',
        description: 'Create a series of 60-second tips in your niche. Easy to consume, high value.',
        platform: 'TikTok',
      },
      {
        title: 'Tools & Resources Review',
        description: 'Review the tools and software you use daily. Great for affiliate partnerships!',
        platform: 'YouTube',
      },
      {
        title: 'Myth Busting in Your Niche',
        description: 'Call out common misconceptions and provide the truth. Controversy drives engagement.',
        platform: 'Instagram',
      },
      {
        title: 'Before & After Transformation',
        description: 'Show the progression over time. Whether it\'s skills, followers, or income - people love progress.',
        platform: 'TikTok',
      },
      {
        title: 'Q&A Session',
        description: 'Answer your audience\'s most asked questions. Builds community and shows you listen.',
        platform: 'Instagram',
      },
      {
        title: 'Collaboration Content',
        description: 'Partner with another creator in your niche. Cross-promotion benefits both audiences.',
        platform: 'YouTube',
      },
      {
        title: 'Trending Audio React',
        description: 'Use trending sounds to create reaction content related to your niche.',
        platform: 'TikTok',
      },
      {
        title: 'Tutorial or How-To',
        description: 'Teach something specific and valuable. Educational content performs consistently well.',
        platform: 'YouTube',
      },
    ];

    return this.getRandomItem(ideas);
  }

  static async getTrendingSounds(platform: string): Promise<Array<{name: string; artist: string; popularity: number}>> {
    await this.delay(800);

    const sounds = [
      {name: 'original sound - viral creator', artist: 'Trending Creator', popularity: 98},
      {name: 'aesthetic vlog music', artist: 'Chill Beats', popularity: 95},
      {name: 'motivational speech edit', artist: 'InspirationHub', popularity: 92},
      {name: 'funny transitions sound', artist: 'Comedy Central', popularity: 89},
      {name: 'storytime background', artist: 'Podcast Vibes', popularity: 87},
      {name: 'product review intro', artist: 'TechTunes', popularity: 85},
      {name: 'transformation montage', artist: 'Epic Music', popularity: 83},
    ];

    return sounds.slice(0, 5);
  }

  // Helper methods
  private static getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private static getRandomItems<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Production method (commented out - requires API key)
  /*
  static async generateWithAPI(request: AIRequest): Promise<string> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a creative assistant for content creators, helping them generate engaging hooks, captions, and ideas.',
            },
            {
              role: 'user',
              content: this.buildPrompt(request),
            },
          ],
          temperature: 0.8,
          max_tokens: 200,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error('Failed to generate content');
    }
  }

  private static buildPrompt(request: AIRequest): string {
    switch (request.type) {
      case 'hook':
        return `Generate a catchy hook for ${request.platform} about ${request.topic}`;
      case 'caption':
        return `Write an engaging caption for ${request.platform}: ${request.context}`;
      case 'idea':
        return `Suggest a content idea for a creator in the ${request.topic} niche`;
      default:
        return '';
    }
  }
  */
}
