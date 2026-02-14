import { create } from "zustand";
import type { StoryGroup } from "@/types";
import { mockStoryGroups } from "@/data/stories";

interface StoryState {
  storyGroups: StoryGroup[];
  activeGroupIndex: number | null;
  activeStoryIndex: number;
  isViewerOpen: boolean;
  fetchStories: () => Promise<void>;
  openViewer: (groupIndex: number) => void;
  closeViewer: () => void;
  nextStory: () => void;
  prevStory: () => void;
  markViewed: (storyId: string) => Promise<void>;
}

export const useStoryStore = create<StoryState>()((set, get) => ({
  storyGroups: [],
  activeGroupIndex: null,
  activeStoryIndex: 0,
  isViewerOpen: false,

  fetchStories: async () => {
    await new Promise((r) => setTimeout(r, 300));
    set({ storyGroups: mockStoryGroups });
  },

  openViewer: (groupIndex: number) => {
    set({
      activeGroupIndex: groupIndex,
      activeStoryIndex: 0,
      isViewerOpen: true,
    });
  },

  closeViewer: () => {
    set({
      activeGroupIndex: null,
      activeStoryIndex: 0,
      isViewerOpen: false,
    });
  },

  nextStory: () => {
    const { storyGroups, activeGroupIndex, activeStoryIndex } = get();
    if (activeGroupIndex === null) return;

    const currentGroup = storyGroups[activeGroupIndex];
    if (!currentGroup) return;

    if (activeStoryIndex < currentGroup.stories.length - 1) {
      set({ activeStoryIndex: activeStoryIndex + 1 });
    } else if (activeGroupIndex < storyGroups.length - 1) {
      set({
        activeGroupIndex: activeGroupIndex + 1,
        activeStoryIndex: 0,
      });
    } else {
      set({
        activeGroupIndex: null,
        activeStoryIndex: 0,
        isViewerOpen: false,
      });
    }
  },

  prevStory: () => {
    const { storyGroups, activeGroupIndex, activeStoryIndex } = get();
    if (activeGroupIndex === null) return;

    if (activeStoryIndex > 0) {
      set({ activeStoryIndex: activeStoryIndex - 1 });
    } else if (activeGroupIndex > 0) {
      const prevGroup = storyGroups[activeGroupIndex - 1];
      set({
        activeGroupIndex: activeGroupIndex - 1,
        activeStoryIndex: prevGroup.stories.length - 1,
      });
    }
  },

  markViewed: async (storyId: string) => {
    set({
      storyGroups: get().storyGroups.map((group) => ({
        ...group,
        stories: group.stories.map((story) =>
          story.id === storyId ? { ...story, isViewed: true } : story
        ),
      })),
    });
  },
}));
