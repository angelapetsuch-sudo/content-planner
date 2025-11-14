# Creator Business Planner

A comprehensive mobile app designed specifically for content creators and small businesses to manage their creative business efficiently.

## Features

### Business Management
- **Expense Tracking**: Track all your business expenses with categories, receipts, and detailed descriptions
- **Sponsorship & Deals Management**: Manage brand partnerships, track deliverables, and monitor deal status
- **Analytics Dashboard**: Monitor your growth across all platforms with detailed metrics
- **Monthly PDF Reports**: Generate professional monthly reports with financial summaries and content performance

### Content Creation Tools
- **Content Ideas Tracker**: Organize and prioritize your content ideas across all platforms
- **Content Calendar**: Plan and schedule posts with an intuitive calendar interface
- **AI Content Generator**:
  - Hook Generator: Create attention-grabbing hooks for any platform
  - Caption Generator: Generate engaging captions with relevant hashtags
  - Idea Generator: Get fresh content ideas based on trending topics
  - Trending Sounds: Discover trending audio for TikTok, Instagram, and YouTube

### Monetization
- Free tier with essential features
- Premium subscription ($4.99/month) unlocks:
  - Unlimited PDF exports
  - Advanced AI content generation
  - Priority support
  - Custom branding

## Tech Stack

- **Framework**: React Native 0.73.2
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Storage**: AsyncStorage (local data persistence)
- **PDF Generation**: react-native-html-to-pdf
- **Calendar**: react-native-calendars
- **Charts**: react-native-chart-kit
- **In-App Purchases**: react-native-iap

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native development environment set up ([Official Guide](https://reactnative.dev/docs/environment-setup))
- For iOS: Xcode and CocoaPods
- For Android: Android Studio and SDK

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd content-planner
```

2. Install dependencies:
```bash
npm install
```

3. For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

### Running the App

#### iOS
```bash
npm run ios
```

#### Android
```bash
npm run android
```

#### Start Metro Bundler
```bash
npm start
```

## Project Structure

```
content-planner/
├── src/
│   ├── screens/           # All screen components
│   │   ├── HomeScreen.tsx
│   │   ├── ExpensesScreen.tsx
│   │   ├── ContentIdeasScreen.tsx
│   │   ├── SponsorshipsScreen.tsx
│   │   ├── AnalyticsScreen.tsx
│   │   ├── AIToolsScreen.tsx
│   │   └── CalendarScreen.tsx
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions and services
│   │   ├── storage.ts     # AsyncStorage wrapper
│   │   ├── pdfGenerator.ts # PDF report generation
│   │   └── aiService.ts   # AI content generation
│   └── App.tsx            # Main app component with navigation
├── package.json
├── tsconfig.json
└── README.md
```

## Key Features Breakdown

### 1. Dashboard (Home Screen)
- Real-time stats: monthly expenses, total revenue, active sponsors, content ideas
- Quick access to PDF report generation
- Premium upgrade prompt for free users
- Financial overview at a glance

### 2. Expense Tracker
- Add expenses with amount, category, and description
- Categorized expenses (Equipment, Software, Marketing, Education, Travel, Office, Other)
- Visual expense cards with date tracking
- Long press to delete entries

### 3. Content Ideas
- Track ideas with title, platform, description, and tags
- Status workflow: idea → planned → in-progress → completed
- Filter and organize by platform
- Tag-based categorization

### 4. Sponsorships & Deals
- Track brand partnerships with detailed information
- Status management: pending → active → completed/rejected
- Deliverables tracking
- Revenue calculation

### 5. Analytics
- Multi-platform analytics tracking
- Metrics: followers, engagement rate, reach, impressions, new followers
- Historical data visualization
- Average engagement calculation

### 6. AI Content Tools
Four powerful AI-powered tools:
- **Hooks**: Generate viral hooks tailored to your topic and platform
- **Captions**: Create full captions with emojis and hashtags
- **Ideas**: Get creative content suggestions with descriptions
- **Sounds**: Discover trending audio for your content

### 7. Content Calendar
- Visual calendar with post scheduling
- Multi-platform scheduling
- Status tracking: scheduled → published/draft
- Hook and caption integration
- Color-coded dots for post status

## Data Persistence

All data is stored locally using AsyncStorage:
- Expenses
- Content Ideas
- Sponsorships
- Analytics entries
- Scheduled posts
- Subscription status

## Future Enhancements

- Cloud sync across devices
- Collaboration features for teams
- Advanced analytics with charts
- Integration with social media platforms
- Automated posting
- Invoice generation
- Tax preparation reports
- Multi-currency support
- Team member management

## AI Integration Notes

The current AI service uses a template-based system with realistic examples. For production:

1. Sign up for an AI API (OpenAI, Anthropic, etc.)
2. Add your API key to a `.env` file:
```
AI_API_KEY=your_api_key_here
```
3. Uncomment the production methods in `src/utils/aiService.ts`
4. Install dotenv: `npm install react-native-dotenv`

## Subscription Integration

To enable real subscriptions:

1. Set up products in App Store Connect (iOS) and Google Play Console (Android)
2. Configure product IDs in the app
3. Test with sandbox accounts
4. Implement receipt validation on a backend server

## License

MIT License - feel free to use this project for your own creator business!

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for content creators who want to turn their passion into a sustainable business.
