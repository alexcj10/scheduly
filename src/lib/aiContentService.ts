
// Types for content recommendations
export type PlatformType = "Instagram" | "Facebook" | "Twitter" | "LinkedIn" | "Pinterest";

export type ContentRecommendation = {
  caption: string;
  hashtags: string[];
  bestTimeToPost: string;
  suggestedTopics: string[];
}

export type InsightData = {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
}

type HistoricalData = {
  [platform: string]: {
    engagement: number[];
    followers: number[];
    posts: number;
  }
}

// Mock AI service - in a real app this would call an AI API
export function generateContentSuggestions(platform: PlatformType, topic?: string): ContentRecommendation {
  // Platform-specific content suggestions
  const platformSpecificContent: Record<PlatformType, ContentRecommendation> = {
    Instagram: {
      caption: topic 
        ? `Bringing you the latest in ${topic}! What's your favorite part? Share below 👇 #${topic.replace(/\s+/g, '')}Love` 
        : "Excited to share this with you all! What do you think? Let me know in the comments 👇",
      hashtags: ["#instagood", "#photooftheday", "#love", "#fashion", "#beautiful", "#happy", "#cute", "#travel"],
      bestTimeToPost: "11:00 AM - 1:00 PM",
      suggestedTopics: ["Behind the scenes", "Day in the life", "Product spotlight", "Customer story"]
    },
    Facebook: {
      caption: topic 
        ? `We've been working on something exciting related to ${topic}. We can't wait to hear your thoughts!` 
        : "We're thrilled to announce our latest update! What features are you most excited about?",
      hashtags: ["#community", "#facebooklive", "#connect", "#share"],
      bestTimeToPost: "1:00 PM - 4:00 PM", 
      suggestedTopics: ["Industry news", "Community highlights", "Longer form stories", "Live events"]
    },
    Twitter: {
      caption: topic 
        ? `New ${topic} alert! 🚨 Check out what we've been working on. Thoughts?` 
        : "Just launched something new! What do you think? RT if you're as excited as we are!",
      hashtags: ["#trending", "#nowplaying", "#followfriday", "#tbt"],
      bestTimeToPost: "9:00 AM - 12:00 PM",
      suggestedTopics: ["Hot takes", "Industry trends", "Quick updates", "Polls and questions"]
    },
    LinkedIn: {
      caption: topic 
        ? `We're excited to share our latest insights on ${topic}. How is your organization approaching this?` 
        : "Proud to announce our latest professional milestone. What growth opportunities are you pursuing this quarter?",
      hashtags: ["#leadership", "#innovation", "#professionaldevelopment", "#business"],
      bestTimeToPost: "9:00 AM - 11:00 AM",
      suggestedTopics: ["Industry insights", "Professional development", "Company culture", "Thought leadership"]
    },
    Pinterest: {
      caption: topic 
        ? `Get inspired with our ${topic} ideas! Save this pin for later 📌` 
        : "New ideas to inspire your next project! Save this for later 📌",
      hashtags: ["#DIY", "#homedecor", "#recipes", "#fashion", "#inspiration"],
      bestTimeToPost: "8:00 PM - 11:00 PM",
      suggestedTopics: ["How-to guides", "Visual inspiration", "Seasonal content", "DIY projects"]
    }
  };

  return platformSpecificContent[platform];
}

// Generate custom hashtags based on topic and platform
export function generateHashtags(platform: PlatformType, topic: string): string[] {
  const baseHashtags = {
    Instagram: ["#instagood", "#photooftheday"],
    Facebook: ["#community", "#share"],
    Twitter: ["#trending", "#social"],
    LinkedIn: ["#professional", "#business"],
    Pinterest: ["#inspiration", "#ideas"]
  };

  // Generate topic-specific hashtags
  const topicTags = topic
    .split(" ")
    .map(word => `#${word.toLowerCase()}`)
    .filter(tag => tag.length > 2);

  // Combine with platform-specific hashtags and add some variations
  const combined = [
    ...baseHashtags[platform],
    ...topicTags,
    `#${topic.replace(/\s+/g, "")}`,
    `#${platform.toLowerCase()}${topic.replace(/\s+/g, "")}`,
    `#${platform.toLowerCase()}content`
  ];

  // Return a random selection of 5-7 hashtags
  return shuffleArray(combined).slice(0, Math.floor(Math.random() * 3) + 5);
}

// Generate smart insights for analytics based on historical data
export function generateSmartInsights(platformData: HistoricalData): InsightData[] {
  const insights: InsightData[] = [];
  
  // Best performing platform
  const platforms = Object.keys(platformData);
  if (platforms.length > 0) {
    const avgEngagements = platforms.map(p => {
      const total = platformData[p].engagement.reduce((sum, val) => sum + val, 0);
      return { platform: p, avg: total / platformData[p].engagement.length };
    });
    
    avgEngagements.sort((a, b) => b.avg - a.avg);
    insights.push({
      label: "Best performing platform",
      value: avgEngagements[0].platform,
      change: calculateGrowth(platformData[avgEngagements[0].platform].engagement),
      trend: "up"
    });
  }
  
  // Best time to post (mock data since we don't have real hourly stats)
  insights.push({
    label: "Best times to post",
    value: "Weekdays, 11:00 AM - 2:00 PM",
    trend: "neutral"
  });
  
  // Engagement growth
  const allEngagement: number[] = [];
  platforms.forEach(p => {
    allEngagement.push(...platformData[p].engagement);
  });
  
  const growth = calculateGrowth(allEngagement);
  insights.push({
    label: "Overall engagement growth",
    value: `${Math.abs(growth).toFixed(1)}%`,
    change: growth,
    trend: growth > 0 ? "up" : "down"
  });
  
  // Content recommendation
  insights.push({
    label: "Content recommendation",
    value: "Visual content with questions performs 30% better",
    trend: "up"
  });
  
  return insights;
}

// Helper function to calculate growth percentage
function calculateGrowth(data: number[]): number {
  if (data.length < 2) return 0;
  
  // Split data in half to compare earlier vs later performance
  const midpoint = Math.floor(data.length / 2);
  const earlierData = data.slice(0, midpoint);
  const laterData = data.slice(midpoint);
  
  const earlierAvg = earlierData.reduce((sum, val) => sum + val, 0) / earlierData.length;
  const laterAvg = laterData.reduce((sum, val) => sum + val, 0) / laterData.length;
  
  // Calculate percentage change
  if (earlierAvg === 0) return 0;
  return ((laterAvg - earlierAvg) / earlierAvg) * 100;
}

// Helper function to shuffle array (for random hashtag selection)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Function to get trending topics (mock data)
export function getTrendingTopics(): string[] {
  return [
    "Sustainable practices",
    "Work-life balance",
    "Remote work tips",
    "Digital wellness",
    "AI in marketing",
    "Social media trends 2025",
    "Content creation hacks",
    "Customer experience",
    "Visual storytelling",
    "Personal branding"
  ];
}

// Function to get historical data from local storage or generate mock data
export function getHistoricalData(): HistoricalData {
  // In a real app, this would come from an API
  return {
    Instagram: {
      engagement: [45, 52, 38, 65, 73, 42, 58],
      followers: [5240, 5265, 5290, 5315, 5350, 5380, 5420],
      posts: 124
    },
    Facebook: {
      engagement: [32, 28, 35, 42, 38, 45, 40],
      followers: [3850, 3870, 3890, 3920, 3950, 3980, 4010],
      posts: 98
    },
    Twitter: {
      engagement: [22, 25, 18, 28, 32, 24, 30],
      followers: [2780, 2800, 2820, 2835, 2850, 2870, 2890],
      posts: 156
    },
    LinkedIn: {
      engagement: [15, 18, 12, 20, 22, 17, 24],
      followers: [1560, 1575, 1590, 1605, 1620, 1635, 1650],
      posts: 45
    }
  };
}
