import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatZodErrors } from "@/utils/func/zodUtils";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { passwordSchema } from "@/utils/zod-schema/password";
import { useChangeUserPassword } from "@/store/users"; // Adjust the import path as needed
import { AxiosError } from "axios";
import newRequest from "@/utils/func/request";

interface ChangePassword {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export function ChangePass() {
  // Hooks
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const changePassword = useChangeUserPassword();

  const [passwords, setPasswords] = useState<ChangePassword>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleInputChange = (
    field: keyof ChangePassword,
    value: string | string[],
  ) => {
    setPasswords({ ...passwords, [field]: value });
  };

  const handleSubmission = async (passwords: ChangePassword) => {
    if (!id) {
      toast({
        title: "Error",
        description: "User ID is missing",
        variant: "destructive",
      });
      return <div>error: User ID is missing</div>;
    }

    try {
      await changePassword.mutateAsync({
        userId: id,
        passwords: {
          currentPassword: passwords.current_password,
          newPassword: passwords.new_password,
          isPassChange: false,
        },
      });

      toast({
        title: "Success",
        description: "Password changed successfully. Please log in again.",
        variant: "success",
      });

      await newRequest.post("/auth/logout");
      navigate("/auth/login");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof AxiosError
            ? error.response?.data.error
            : "Failed to change password",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    const validation = passwordSchema.safeParse(passwords);
    if (!validation.success) {
      const errorMessages = formatZodErrors(validation.error.errors);
      toast({
        title: "Password Submission Error",
        description: `Please correct the following errors:\n${errorMessages}`,
        variant: "warning",
      });
      return;
    }

    handleSubmission(passwords);
  };

  return (
    <div className="w-svw h-svh grid place-items-center bg-primary-foreground">
      <Card className="max-w-xs w-full">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>After saving, you'll be logged out.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="current">Current password</Label>
            <PasswordInput
              id="current"
              value={passwords.current_password}
              autoComplete="current-password"
              onChange={(e) =>
                handleInputChange("current_password", e.target.value)
              }
              disabled={changePassword.isPending}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new">New password</Label>
            <PasswordInput
              id="new"
              value={passwords.new_password}
              autoComplete="new-password"
              onChange={(e) =>
                handleInputChange("new_password", e.target.value)
              }
              disabled={changePassword.isPending}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm">Confirm password</Label>
            <PasswordInput
              id="confirm"
              value={passwords.confirm_password}
              autoComplete="new-password"
              onChange={(e) =>
                handleInputChange("confirm_password", e.target.value)
              }
              disabled={changePassword.isPending}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={changePassword.isPending}>
            {changePassword.isPending ? "Saving..." : "Save password"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
