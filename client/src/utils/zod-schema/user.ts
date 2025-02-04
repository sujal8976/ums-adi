import { z } from "zod";

// Base Schema
const BaseUserSchema = z.object({
  _id: z.string().optional(),
  username: z
    .string()
    .min(6)
    .max(20)
    .regex(/^[a-zA-Z0-9_.@]*$/, {
      message:
        "Usernames can only contain letters, numbers, underscores, @, and periods.",
    }),
  password: z
    .string()
    .min(6)
    .max(12)
    .regex(/^[a-zA-Z0-9]*$/, {
      message: "Password can only contain only alphabets and numbers.",
    })
    .optional(),
  firstName: z
    .string()
    .min(2)
    .regex(/^[A-Za-z]+$/, {
      message: "Only alphabetic characters are allowed",
    }),
  lastName: z
    .string()
    .min(2)
    .regex(/^[A-Za-z]+$/, {
      message: "Only alphabetic characters are allowed",
    }),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" })
    .optional(),
  dob: z.date().optional(),
  roles: z.array(z.string()).min(1),
  isLocked: z.boolean(),
});

export const RegisterUserSchema = BaseUserSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  dob: true,
  _id: true,
}).extend({
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  dob: z.date(),
});

// Full User Schema (All fields required)
export const FullUserSchema = BaseUserSchema.extend({
  email: z.string().email(),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  dob: z.date(),
});

// Instant User Form Schema (Some fields optional)
export const InstantUserSchema = BaseUserSchema.partial({
  _id: true,
  email: true,
  phone: true,
  dob: true,
});

// Login Form Schema (Only username and password)
export const LoginUserSchema = BaseUserSchema.pick({ password: true }).extend({
  loginId: z.string().refine(
    (value) =>
      /^[a-zA-Z0-9_.@]*$/.test(value) || // Username pattern
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Email pattern
    {
      message:
        "Login ID must be a valid email or username (letters, numbers, underscores, @, and periods only).",
    },
  ),
});
