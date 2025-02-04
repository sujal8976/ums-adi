import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "./tooltip-provider";
import { toast } from "@/hooks/use-toast";

interface CredentialsModalProps {
  username: string;
  password: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CredentialsModal = ({
  username,
  password,
  open,
  onOpenChange,
}: CredentialsModalProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify({ username, password }, null, 2),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
      toast({
        title: "Copied Successfully",
        description: "User credentials have been copied to the clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Copy Failed",
        description:
          "Unable to copy user credentials to the clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="flex flex-row items-center mt-2 justify-between">
          <DialogTitle className="flex-grow">User Credentials</DialogTitle>
          <Tooltip content={copied ? "copied!" : "copy"}>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0 transition-all duration-200"
            >
              {copied ? (
                <Check className="h-4 w-4 animate-in fade-in duration-300" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </Tooltip>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <span>Username:</span>
            <div className="flex gap-2">
              <span className="font-mono">{username}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span>Password:</span>
            <div className="flex gap-2">
              <span className="font-mono">{password}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CredentialsModal;
