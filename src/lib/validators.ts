import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9._]+$/, "Only letters, numbers, dots and underscores"),
  displayName: z.string().min(1, "Display name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const createPostSchema = z.object({
  caption: z.string().max(2200, "Caption too long"),
  tags: z.array(z.string()).max(30, "Maximum 30 tags"),
  location: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Too long"),
});

export const editProfileSchema = z.object({
  displayName: z.string().min(1, "Name is required"),
  bio: z.string().max(150, "Bio must be 150 characters or less"),
  website: z.string().url("Invalid URL").or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type CommentInput = z.infer<typeof commentSchema>;
export type EditProfileInput = z.infer<typeof editProfileSchema>;
