// UserActionButtons.tsx
import { Tooltip } from "@/components/custom ui/tooltip-provider";
import { Button } from "@/components/ui/button";
import { hasPermission } from "@/hooks/use-role.ts";
import { useAuth } from "@/store/auth";
import { userType } from "@/store/users";
import {
  KeyRound,
  LockKeyhole,
  LockKeyholeOpen,
  Save,
  SquarePen,
  Trash2,
} from "lucide-react";

interface UserActionButtonsProps {
  isEditable: boolean;
  userData: Partial<userType>;
  onDelete: () => void;
  onUpdate: () => void;
  onResetPassword: () => void;
  onLockUser: () => void;
}

export const UserActionButtons = ({
  isEditable,
  userData,
  onDelete,
  onUpdate,
  onResetPassword,
  onLockUser,
}: UserActionButtonsProps) => {
  const { combinedRole } = useAuth(false);

  const showEditButton = hasPermission(combinedRole, "Users", "update-user");
  const showDeleteButton = hasPermission(combinedRole, "Users", "delete-user");
  const showResetPassButton = hasPermission(
    combinedRole,
    "Users",
    "reset-password",
  );
  const showLockButton = hasPermission(combinedRole, "Users", "lock-user");

  const hasAnyAccess =
    showEditButton || showDeleteButton || showResetPassButton || showLockButton;

  return (
    hasAnyAccess && (
      <>
        {showDeleteButton && (
          <Tooltip content="Delete user">
            <Button
              variant="destructive"
              size="icon"
              className="mx-1 text-primary"
              onClick={onDelete}
            >
              <Trash2 />
            </Button>
          </Tooltip>
        )}

        {showEditButton && (
          <Tooltip content={`${isEditable ? "Save" : "Edit"} user`}>
            <Button
              size="icon"
              className={`text-primary mx-1 ${
                isEditable
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={onUpdate}
            >
              {isEditable ? <Save /> : <SquarePen />}
            </Button>
          </Tooltip>
        )}

        {showResetPassButton && (
          <Tooltip content="Reset user password">
            <Button
              size="icon"
              className="mx-1 text-primary bg-yellow-500 hover:bg-yellow-600"
              onClick={onResetPassword}
            >
              <KeyRound />
            </Button>
          </Tooltip>
        )}

        {showLockButton && (
          <Tooltip
            content={
              userData.isLocked ? "Unlock user account" : "Lock user account"
            }
          >
            <Button size="icon" variant="outline" onClick={onLockUser}>
              {userData.isLocked ? <LockKeyholeOpen /> : <LockKeyhole />}
            </Button>
          </Tooltip>
        )}
      </>
    )
  );
};
