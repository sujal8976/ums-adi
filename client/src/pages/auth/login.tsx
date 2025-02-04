import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatZodErrors } from "@/utils/func/zodUtils";
import { ArrowRight, Loader2 } from "lucide-react";
import { LoginUserSchema } from "@/utils/zod-schema/user";
import { useAuth } from "@/store/auth";

interface LoginUser {
  loginId: string;
  password: string;
}

export function LoginForm() {
  const { toast } = useToast();
  const { login, isLoggingIn, loginError } = useAuth();
  const [user, setUser] = useState<LoginUser>({ loginId: "", password: "" });
  const [remember, setRemember] = useState<boolean>(false);

  useEffect(() => {
    const storedLoginId = localStorage.getItem("rememberedLoginId");
    if (storedLoginId) {
      setUser((prev) => ({ ...prev, loginId: storedLoginId }));
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (loginError?.response?.data.error) {
      toast({
        title: "Login Error",
        description: loginError.response.data.error,
        variant: "destructive",
      });
    } else if (loginError?.code === "ERR_NETWORK") {
      toast({
        title: "Server Issue",
        description: `• ${loginError.message}`,
        variant: "destructive",
      });
    }
  }, [loginError, toast]);

  const handleRememberMe = (loginId: string) => {
    if (remember) {
      localStorage.setItem("rememberedLoginId", loginId);
    } else {
      localStorage.removeItem("rememberedLoginId");
    }
  };

  const handleSubmit = () => {
    const validation = LoginUserSchema.safeParse(user);
    if (!validation.success) {
      toast({
        title: "Login Error",
        description: `Please correct the following errors:\n${formatZodErrors(validation.error.errors)}`,
      });

      return;
    }

    handleRememberMe(user.loginId);
    login(user);
  };

  return (
    <div className="w-svw h-svh grid place-items-center bg-primary-foreground">
      <Card className="w-full max-w-xs">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-base">
            Enter your username below to login.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-base">
              Email or Username
            </Label>
            <Input
              id="username"
              type="username"
              placeholder="tony.stark@3000"
              required
              value={user.loginId}
              className="text-base"
              onChange={(e) =>
                setUser((prev) => ({ ...prev, loginId: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-base">
              Password
            </Label>
            <PasswordInput
              id="password"
              required
              value={user.password}
              className="text-base"
              onChange={(e) =>
                setUser((prev) => ({ ...prev, password: e.target.value }))
              }
              autoComplete="off"
            />
          </div>
          <div className="my-1 w-full flex justify-center items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={remember}
              onCheckedChange={() => setRemember((prev) => !prev)}
            />
            <Label htmlFor="rememberMe" className="italic text-base">
              Remember Me
            </Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full font-semibold text-base"
            variant={isLoggingIn ? "default" : "expandIcon"}
            size="icon"
            Icon={
              isLoggingIn ? (
                <Loader2 className="ml-3 animate-spin" size={16} />
              ) : (
                <ArrowRight className="translate-x-[-5px]" size={16} />
              )
            }
            iconPlacement="right"
            onClick={handleSubmit}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging In" : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
