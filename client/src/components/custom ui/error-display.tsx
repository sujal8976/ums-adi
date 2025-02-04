import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

interface ErrorCardProps {
  title: string;
  description: string;
  btnTitle: string;
  onAction: () => void;
  className?: string;
}

const ErrorCard = ({
  title = "Something went wrong",
  description = "There was an error loading this content.",
  btnTitle,
  onAction,
  className = "",
}: ErrorCardProps) => {
  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <XCircle className="h-6 w-6 text-destructive" />
          <CardTitle className="text-destructive">{title}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onAction}>
          {btnTitle}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ErrorCard;
