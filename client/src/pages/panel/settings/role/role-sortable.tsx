import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sortable,
  SortableDragHandle,
  SortableItem,
} from "@/components/ui/sortable";
import { GripVertical, Trash, Bolt } from "lucide-react";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { RoleType } from "@/store/role";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAlertDialog } from "@/components/custom ui/alertDialog";
import { RoleForm } from "./role-form";
import { useAuth } from "@/store/auth";
import { hasPermission } from "@/hooks/use-role";

interface MoveEvent {
  activeIndex: number;
  overIndex: number;
}

interface SortableRole {
  id: UniqueIdentifier;
  role: RoleType;
}

interface RoleSortableProps {
  roles: RoleType[];
  currentRole: RoleType;
  onRolesChange?: (roles: RoleType[]) => void;
  onDelete?: (roleId: string) => void;
  onView?: (role: RoleType) => void;
}

export function RoleSortable({
  roles,
  currentRole,
  onRolesChange,
  onDelete,
  onView,
}: RoleSortableProps) {
  const sortableRoles = useMemo(
    () =>
      [...roles]
        .sort((a, b) => a.precedence - b.precedence)
        .map((role) => ({
          id: role._id,
          role: role,
        })),
    [roles],
  );

  const [localSortableRoles, setLocalSortableRoles] =
    useState<SortableRole[]>(sortableRoles);
  const [hasChanges, setHasChanges] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { combinedRole } = useAuth(false);

  const showAddButton = hasPermission(combinedRole, "Settings", "create-role");
  const showEditButton =
    hasPermission(combinedRole, "Settings", "update-role") ||
    hasPermission(combinedRole, "Settings", "read-role");
  const showDeleteButton = hasPermission(
    combinedRole,
    "Settings",
    "delete-role",
  );
  const showDragButton = hasPermission(
    combinedRole,
    "Settings",
    "change-precedence",
  );

  const deleteDialog = useAlertDialog({
    iconName: "Trash2",
    alertType: "Danger",
    title: "Confirm Role Deletion",
    description: "", // Will be set dynamically
    actionLabel: "Delete Role",
    cancelLabel: "Cancel",
  });

  const saveDialog = useAlertDialog({
    iconName: "Save",
    alertType: "Success",
    title: "Save Changes",
    description: "Are you sure you want to save the changes to role order?",
    actionLabel: "Save",
    cancelLabel: "Cancel",
  });

  useEffect(() => {
    setLocalSortableRoles(sortableRoles);
    setHasChanges(false);
  }, [sortableRoles]);

  const checkForChanges = (newRoles: SortableRole[]) => {
    const hasOrderChanged = newRoles.some(
      (role, index) =>
        role.id !== sortableRoles[index]?.id ||
        role.role.precedence !== sortableRoles[index]?.role.precedence,
    );
    setHasChanges(hasOrderChanged);
  };

  const hasRoleAccess = (index: number) => {
    return index < currentRole.precedence;
  };

  const handleMove = ({ activeIndex, overIndex }: MoveEvent): void => {
    if (!hasRoleAccess(overIndex)) {
      const newSortableRoles = [...localSortableRoles];
      const [movedItem] = newSortableRoles.splice(activeIndex, 1);
      newSortableRoles.splice(overIndex, 0, movedItem);

      const updatedSortableRoles = newSortableRoles.map(
        (sortableRole, index) => ({
          ...sortableRole,
          role: {
            ...sortableRole.role,
            precedence: index + 1,
          },
        }),
      );

      setLocalSortableRoles(updatedSortableRoles);
      checkForChanges(updatedSortableRoles);
    }
  };

  const handleInputChange = (index: number, value: string): void => {
    const newSortableRoles = [...localSortableRoles];
    newSortableRoles[index] = {
      ...newSortableRoles[index],
      role: {
        ...newSortableRoles[index].role,
        name: value,
      },
    };
    setLocalSortableRoles(newSortableRoles);
    checkForChanges(newSortableRoles);
  };

  const handleDelete = (id: UniqueIdentifier, role: SortableRole): void => {
    deleteDialog.show({
      config: {
        description: `Are you sure you want to delete the role "${role.role.name}"?`,
      },
      onAction: async () => {
        const newSortableRoles = localSortableRoles.filter(
          (item) => item.id !== id,
        );
        const updatedSortableRoles = newSortableRoles.map(
          (sortableRole, index) => ({
            ...sortableRole,
            role: {
              ...sortableRole.role,
              precedence: index + 1,
            },
          }),
        );

        setLocalSortableRoles(updatedSortableRoles);
        checkForChanges(updatedSortableRoles);
        onDelete?.(id.toString());
        setHasChanges(false);
      },
    });
  };

  const handleView = (role: RoleType): void => {
    onView?.(role);
  };

  const handleSave = () => {
    saveDialog.show({
      onAction: async () => {
        onRolesChange?.(localSortableRoles.map((item) => item.role));
        setHasChanges(false);
      },
      onCancel: () => {
        setLocalSortableRoles(sortableRoles);
        setHasChanges(false);
      },
    });
  };

  function getDynamicGridColumns() {
    const buttons = [
      showDragButton && "auto",
      showEditButton && "auto",
      showDeleteButton && "auto",
    ].filter(Boolean);

    return `grid-cols-[1fr,${buttons.join(",")}]`;
  }

  return (
    <Card className="w-full h-[80svh] md:h-full md:max-w-sm flex flex-col">
      <CardHeader className="w-full flex-col gap-4 space-y-0 sm:flex-row">
        <div className="flex flex-1 flex-col gap-1.5">
          <CardTitle className="flex justify-between items-center">
            Roles
          </CardTitle>
          <CardDescription>
            Drag to reorder roles and manage their precedence.
          </CardDescription>
        </div>
        <RoleForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} />
        {showAddButton && (
          <Button
            onClick={() => setIsFormOpen(true)}
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
          >
            Add Role
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow min-h-0 p-2">
        <ScrollArea className="h-full px-4">
          <Sortable
            value={localSortableRoles}
            onMove={handleMove}
            overlay={
              <div
                className={`grid ${getDynamicGridColumns()} items-center gap-2`}
              >
                <div className="h-8 w-full rounded-sm bg-primary/10" />
                {showDragButton && (
                  <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
                )}
                {showEditButton && (
                  <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
                )}
                {showDeleteButton && (
                  <div className="size-8 shrink-0 rounded-sm bg-primary/10" />
                )}
              </div>
            }
          >
            <div className="flex w-full flex-col gap-2">
              {localSortableRoles.map((sortableRole, index) => (
                <SortableItem
                  key={sortableRole.id}
                  value={sortableRole.id}
                  asChild
                >
                  <div
                    className={`grid ${getDynamicGridColumns()} items-center gap-2`}
                  >
                    <Input
                      className="h-8"
                      value={sortableRole.role.name}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      disabled
                    />
                    {showDragButton && (
                      <SortableDragHandle
                        variant="outline"
                        size="icon"
                        className="size-8 shrink-0"
                        disabled={hasRoleAccess(index)}
                      >
                        <GripVertical className="size-4" aria-hidden="true" />
                      </SortableDragHandle>
                    )}
                    {showEditButton && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8 shrink-0"
                        onClick={() => handleView(sortableRole.role)}
                        disabled={index < currentRole.precedence - 1}
                      >
                        <Bolt className="size-4" aria-hidden="true" />
                        <span className="sr-only">View</span>
                      </Button>
                    )}
                    {showDeleteButton && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8 shrink-0"
                        disabled={hasRoleAccess(index)}
                        onClick={() =>
                          handleDelete(sortableRole.id, sortableRole)
                        }
                      >
                        <Trash
                          className="size-4 text-destructive"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex-none">
        {hasChanges && (
          <Button size="sm" className="w-fit" onClick={handleSave}>
            Save Order
          </Button>
        )}
      </CardFooter>
      <deleteDialog.AlertDialog />
      <saveDialog.AlertDialog />
    </Card>
  );
}

export default RoleSortable;
