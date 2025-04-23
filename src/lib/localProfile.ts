
export type UserProfile = {
  name: string;
  email: string;
  bio: string;
};

export type ContentIdea = {
  id: string;
  title: string;
  description: string;
  platform: string;
  type: string;
  saved: boolean;
  createdAt: string;
};

const PROFILE_KEY = 'scheduly-user';
const MEDIA_KEY = 'scheduly-media-library';
const SETTINGS_KEY = 'scheduly-settings';
const CONTENT_IDEAS_KEY = 'scheduly-content-ideas';
const RECYCLED_POSTS_KEY = 'scheduly-recycled-posts';

export function getProfile(): UserProfile {
  const data = localStorage.getItem(PROFILE_KEY);
  if (data) return JSON.parse(data);
  // Default example
  return {
    name: "Jane Doe",
    email: "jane@email.com",
    bio: "Social media enthusiast!"
  };
}

export function setProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getMediaFiles(): string[] {
  const data = localStorage.getItem(MEDIA_KEY);
  if (data) return JSON.parse(data);
  // Default placeholder images (unsplash slugs)
  return [
    "photo-1649972904349-6e44c42644a7",
    "photo-1488590528505-98d2b5aba04b",
    "photo-1518770660439-4636190af475",
    "photo-1461749280684-dccba630e2f6"
  ];
}

export function addMediaFile(fileUrl: string) {
  const files = getMediaFiles();
  files.unshift(fileUrl);
  localStorage.setItem(MEDIA_KEY, JSON.stringify(files));
}

export function getSettings(): { emailNotif: boolean; pushNotif: boolean; aiSuggestions: boolean } {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (data) return JSON.parse(data);
  return { emailNotif: true, pushNotif: true, aiSuggestions: true };
}

export function setSettings(settings: { emailNotif: boolean; pushNotif: boolean; aiSuggestions?: boolean }) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({
    ...getSettings(),
    ...settings
  }));
}

export function getContentIdeas(): ContentIdea[] {
  const data = localStorage.getItem(CONTENT_IDEAS_KEY);
  if (data) return JSON.parse(data);
  
  // Default content ideas
  const defaultIdeas: ContentIdea[] = [
    {
      id: "idea-1",
      title: "Behind-the-scenes tour",
      description: "Show followers how your products are made or give a tour of your office space.",
      platform: "Instagram",
      type: "Video",
      saved: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "idea-2",
      title: "Industry news roundup",
      description: "Share the latest trends and news in your industry with expert commentary.",
      platform: "LinkedIn",
      type: "Article",
      saved: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "idea-3",
      title: "How-to tutorial",
      description: "Create a step-by-step guide showing how to use your product or a helpful tip.",
      platform: "Pinterest",
      type: "Carousel",
      saved: false,
      createdAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem(CONTENT_IDEAS_KEY, JSON.stringify(defaultIdeas));
  return defaultIdeas;
}

export function addContentIdea(idea: Omit<ContentIdea, "id" | "createdAt">) {
  const ideas = getContentIdeas();
  const newIdea: ContentIdea = {
    ...idea,
    id: `idea-${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  
  ideas.unshift(newIdea);
  localStorage.setItem(CONTENT_IDEAS_KEY, JSON.stringify(ideas));
  return newIdea;
}

export function updateContentIdea(id: string, updates: Partial<ContentIdea>) {
  const ideas = getContentIdeas();
  const index = ideas.findIndex(idea => idea.id === id);
  
  if (index >= 0) {
    ideas[index] = { ...ideas[index], ...updates };
    localStorage.setItem(CONTENT_IDEAS_KEY, JSON.stringify(ideas));
    return true;
  }
  
  return false;
}

export function deleteContentIdea(id: string) {
  const ideas = getContentIdeas();
  const filteredIdeas = ideas.filter(idea => idea.id !== id);
  
  if (filteredIdeas.length !== ideas.length) {
    localStorage.setItem(CONTENT_IDEAS_KEY, JSON.stringify(filteredIdeas));
    return true;
  }
  
  return false;
}

export function getRecycledPosts(): any[] {
  const data = localStorage.getItem(RECYCLED_POSTS_KEY);
  if (data) return JSON.parse(data);
  return [];
}

export function savePostForRecycling(post: any) {
  const posts = getRecycledPosts();
  posts.unshift({
    ...post,
    recycledId: `recycled-${Date.now()}`,
    savedAt: new Date().toISOString()
  });
  localStorage.setItem(RECYCLED_POSTS_KEY, JSON.stringify(posts));
}
