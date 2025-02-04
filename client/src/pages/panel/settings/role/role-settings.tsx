import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Permission } from "@/store/role";
import { useEffect, useRef, useState, useCallback } from "react";
import { RolePermissions } from "./role-permission";
import { Button } from "@/components/ui/button";
import { RoleType } from "@/store/role";
import { isEqual } from "lodash";
import { useAlertDialog } from "@/components/custom ui/alertDialog";
import { useAuth } from "@/store/auth";
import { hasPermission } from "@/hooks/use-role";

interface RoleSettingsProp {
  role: RoleType;
  setRole: (role: RoleType) => void;
}

export const RoleSettings = ({
  role: initRole,
  setRole: setInitRole,
}: RoleSettingsProp) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState(initRole);
  const { combinedRole } = useAuth(false);
  const isEditable = hasPermission(combinedRole, "Settings", "update-role");
  const [savedPermissions, setSavedPermissions] = useState(
    initRole.permissions,
  );
  const dialog = useAlertDialog({
    iconName: "AlertTriangle",
    alertType: "Danger",
    title: "Update Role Permissions",
    description: "", //Dynamically adding description
    actionLabel: "Update",
    cancelLabel: "Cancel",
  });

  useEffect(() => {
    setRole(initRole);
    setSavedPermissions(initRole.permissions);
  }, [initRole]);

  const hasChanges = !isEqual(
    [...role.permissions].sort(),
    [...savedPermissions].sort(),
  );

  const handleSetPermissions = useCallback((perms: Permission[]) => {
    setRole((prev) => ({
      ...prev,
      permissions: perms,
    }));
  }, []);

  const handleSubmit = () => {
    dialog.show({
      config: {
        description: `Are you sure you want to update the permissions for the role: ${initRole.name}?`,
      },
      onAction: () => {
        setInitRole(role);
        setSavedPermissions(role.permissions);
      },
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = 0;
      }
    }
  }, [role.name]);

  return (
    <>
      <Card className="w-full h-full">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <CardHeader>
            <CardTitle>{`Role Settings - ${role.name}`}</CardTitle>
            <CardDescription>
              Manage and configure permissions, access controls, and other
              settings for the selected role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RolePermissions
              initialPermissions={role.permissions}
              onPermissionsChange={handleSetPermissions}
              isEditable={
                isEditable && combinedRole?.highestPrecedence
                  ? role.precedence > combinedRole?.highestPrecedence
                  : false
              }
            />
          </CardContent>
          <CardFooter>
            {hasChanges && (
              <Button onClick={handleSubmit} className="ml-auto">
                Save Changes
              </Button>
            )}
          </CardFooter>
        </ScrollArea>
      </Card>
      <dialog.AlertDialog />
    </>
  );
};

export const EmptyRoleSettings = ({
  children,
  showCreateRole = false,
}: {
  children: React.ReactNode | string;
  showCreateRole?: boolean;
}) => {
  return (
    <Card className="h-[80svh] w-full md:h-full p-4">
      <div className="w-full h-full p-6 text-center flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-sm border-white">
        {children}
        {showCreateRole && <Button>Create role</Button>}
      </div>
    </Card>
  );
};
