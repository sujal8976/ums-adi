import { Plus, Star, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Tooltip } from "./tooltip-provider";

export const Remiders = () => {
  return (
    <Card className="max-w-xs w-full">
      <CardHeader className="gap-2">
        <CardTitle className="text-lg">Reminders</CardTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Type your reminder here"
            className="flex-shrink"
          />
          <Tooltip content="Add reminder">
            <Button variant="outline" size="icon" className="px-2">
              <Plus />
            </Button>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-2 pl-4 flex gap-4 justify-between items-center rounded-md hover:bg-muted">
          Help
          <div id="controls" className="h-full flex items-center gap-1.5">
            <Star className="fill-transparent hover:fill-white transition-all ease-in duration-400" />
            <X size={28} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
