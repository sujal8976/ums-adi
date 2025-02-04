import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useAuthStore } from "@/store/auth";
import useUserStore, { useUpdateUser } from "@/store/users";
import { CustomAxiosError } from "@/utils/types/axios";
import { userType } from "@/store/users";
import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAlertDialog } from "@/components/custom ui/alertDialog";
import { hasPermission } from "@/hooks/use-role.ts";

interface UserActionProps {
  user: userType;
  isDisabled: boolean;
}

export const UserAction = ({ user, isDisabled = true }: UserActionProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateUser = useUpdateUser();
  const { setSelectedUserId } = useUserStore();
  const { user: currUser } = useAuthStore();
  const { combinedRole } = useAuth(false);

  //Access for buttons
  const showUserDetails = hasPermission(combinedRole, "Users", "read-details");
  const showLockButton = hasPermission(combinedRole, "Users", "lock-user");

  const hasAnyAccess = showUserDetails || showLockButton;

  const lockDialog = useAlertDialog({
    alertType: !user.isLocked ? "Danger" : "Success",
    iconName: !user.isLocked ? "Lock" : "LockOpen",
    title: !user.isLocked ? "Lock User" : "Unlock User",
    description: `Are you sure you want to ${
      !user.isLocked ? "restrict access for" : "restore access to"
    } this user: ${user.username}?`,
    cancelLabel: "Cancel",
    actionLabel: `${!user.isLocked ? "Lock" : "Unlock"} user`,
  });

  const handleOpenDetails = (id: string) => {
    navigate(`details/${id}`);
    setSelectedUserId(id);
  };

  const handleLockUser = (id: string) => {
    if (currUser?._id === user._id) {
      toast({
        title: "User Cannot be locked",
        description: "you can not lock yourself",
      });
      return;
    }

    const updates: Partial<userType> = { isLocked: !user.isLocked };

    updateUser.mutate(
      { userId: id, updates },
      {
        onSuccess: () => {
          toast({
            title: `User ${user.isLocked ? "Unlocked" : "Locked"}`,
            description: `User ${user.username} ${user.isLocked ? "unlocked" : "locked"} successfully`,
            variant: "default",
          });
        },
        onError: (error) => {
          const err = error as CustomAxiosError;
          toast({
            title: "Error occured",
            description:
              err.response?.data.error ||
              "Failed to lock user. Please try again.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="miniIcon"
            className={
              isDisabled || !hasAnyAccess ? "cursor-not-allowed" : undefined
            }
            disabled={isDisabled || !hasAnyAccess}
          >
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        {/* Adding this for security purposes 
        because anyone can manipulate dom and enable the disabled button */}
        {!isDisabled && hasAnyAccess && (
          <>
            <DropdownMenuContent className="mx-3">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {showUserDetails && (
                <DropdownMenuItem onClick={() => handleOpenDetails(user._id)}>
                  Open Details
                </DropdownMenuItem>
              )}

              {showLockButton && (
                <DropdownMenuItem
                  onClick={() =>
                    lockDialog.show({
                      onAction: () => handleLockUser(user._id),
                    })
                  }
                >
                  {!user.isLocked ? "Lock user" : "Unlock User"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </>
        )}
      </DropdownMenu>
      <lockDialog.AlertDialog />
    </>
  );
};
