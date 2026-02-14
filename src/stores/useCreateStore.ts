import { create } from "zustand";

interface CreateState {
  step: 1 | 2 | 3 | 4;
  selectedFiles: File[];
  previewUrls: string[];
  caption: string;
  tags: string[];
  location: string;
  isPublishing: boolean;
  setFiles: (files: File[]) => void;
  setCaption: (text: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setLocation: (location: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  publish: () => Promise<void>;
}

export const useCreateStore = create<CreateState>()((set, get) => ({
  step: 1,
  selectedFiles: [],
  previewUrls: [],
  caption: "",
  tags: [],
  location: "",
  isPublishing: false,

  setFiles: (files: File[]) => {
    const prevUrls = get().previewUrls;
    prevUrls.forEach((url) => URL.revokeObjectURL(url));

    const previewUrls = files.map((file) => URL.createObjectURL(file));
    set({ selectedFiles: files, previewUrls });
  },

  setCaption: (text: string) => {
    set({ caption: text });
  },

  addTag: (tag: string) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed) return;

    const { tags } = get();
    if (tags.includes(trimmed)) return;

    set({ tags: [...tags, trimmed] });
  },

  removeTag: (tag: string) => {
    set({ tags: get().tags.filter((t) => t !== tag) });
  },

  setLocation: (location: string) => {
    set({ location });
  },

  nextStep: () => {
    const { step } = get();
    if (step < 4) {
      set({ step: (step + 1) as 1 | 2 | 3 | 4 });
    }
  },

  prevStep: () => {
    const { step } = get();
    if (step > 1) {
      set({ step: (step - 1) as 1 | 2 | 3 | 4 });
    }
  },

  reset: () => {
    const prevUrls = get().previewUrls;
    prevUrls.forEach((url) => URL.revokeObjectURL(url));

    set({
      step: 1,
      selectedFiles: [],
      previewUrls: [],
      caption: "",
      tags: [],
      location: "",
      isPublishing: false,
    });
  },

  publish: async () => {
    const { selectedFiles, caption, tags, location } = get();
    if (selectedFiles.length === 0) return;

    set({ isPublishing: true });

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("caption", caption);
      formData.append("tags", JSON.stringify(tags));
      formData.append("location", location);

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to publish");
      }

      get().reset();
    } catch (error) {
      set({ isPublishing: false });
      throw error;
    }
  },
}));
