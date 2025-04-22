
export type UserProfile = {
  name: string;
  email: string;
  bio: string;
};

const PROFILE_KEY = 'scheduly-user';
const MEDIA_KEY = 'scheduly-media-library';
const SETTINGS_KEY = 'scheduly-settings';

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

export function getSettings(): { emailNotif: boolean; pushNotif: boolean } {
  const data = localStorage.getItem(SETTINGS_KEY);
  if (data) return JSON.parse(data);
  return { emailNotif: true, pushNotif: true };
}

export function setSettings(settings: { emailNotif: boolean; pushNotif: boolean }) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
