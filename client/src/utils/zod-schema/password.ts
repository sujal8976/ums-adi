import { z } from "zod";

export const passwordSchema = z
  .object({
    current_password: z
      .string()
      .min(6)
      .max(12)
      .regex(/^[a-zA-Z0-9]*$/, {
        message:
          "Current Password can only contain only alphabets and numbers please check if its a valid password.",
      }),
    new_password: z
      .string()
      .min(6)
      .max(12)
      .regex(/^[a-zA-Z0-9]*$/, {
        message: "New Password can only contain only alphabets and numbers.",
      }),
    confirm_password: z
      .string()
      .min(6)
      .max(12)
      .regex(/^[a-zA-Z0-9]*$/, {
        message:
          "Confirm Password can only contain only alphabets and numbers.",
      }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"], // Point to the field causing the issue
    message: "New Password and Confirm Password must match.",
  })
  .refine((data) => data.new_password !== data.current_password, {
    path: ["new_password"], // Point to the field causing the issue
    message: "New Password cannot be the same as Current Password.",
  });
