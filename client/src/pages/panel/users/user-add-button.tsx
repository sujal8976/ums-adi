import { Plus } from "lucide-react";
import { useState } from "react";
import { Tooltip } from "@/components/custom ui/tooltip-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InstantUserForm } from "./instant-user-form";
import { UserForm } from "./user-form";

export const UserAddButton = () => {
  const [isUserFormOpen, setUserFormOpen] = useState(false);
  const [isInstantUserFormOpen, setInstantUserFormOpen] = useState(false);

  const handleUserFormOpen = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setUserFormOpen(true);
  };

  const handleInstantUserFormOpen = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setInstantUserFormOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span>
            <Tooltip content="Add Users" side="bottom">
              <Button variant="outline" size="icon" className="px-2">
                <Plus />
              </Button>
            </Tooltip>
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mx-3">
          <DropdownMenuLabel>Add Users</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleInstantUserFormOpen}>
            Instant User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleUserFormOpen}>
            Registered User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserForm open={isUserFormOpen} onOpenChange={setUserFormOpen} />
      <InstantUserForm
        open={isInstantUserFormOpen}
        onOpenChange={setInstantUserFormOpen}
      />
    </>
  );
};
