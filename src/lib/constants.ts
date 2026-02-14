export const APP_NAME = "Maxogram";
export const PAGE_SIZE = 10;
export const STORY_DURATION = 5; // seconds
export const REEL_PAGE_SIZE = 5;
export const MESSAGE_PAGE_SIZE = 20;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "/feed", icon: "Home" },
  { label: "Explore", href: "/explore", icon: "Compass" },
  { label: "Reels", href: "/reels", icon: "Film" },
  { label: "Messages", href: "/messages", icon: "MessageCircle" },
  { label: "Notifications", href: "/notifications", icon: "Heart" },
  { label: "Create", href: "/create", icon: "PlusSquare" },
  { label: "Profile", href: "/profile", icon: "User" },
] as const;

export const EXPLORE_CATEGORIES = [
  "For You",
  "Travel",
  "Architecture",
  "Food",
  "Art",
  "Music",
  "Sports",
  "Fashion",
  "Nature",
  "Technology",
] as const;
