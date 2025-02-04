import { useState, useEffect } from "react";
import CheckboxList from "@/components/custom ui/checkbox-list";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Permission } from "@/store/role";
import { availablePermissionPages } from "@/store/data/permission";

interface PermissionAction {
  value: string;
  label: string;
}

interface PermissionPageProps {
  page: string;
  pageLabel: string;
  actions: PermissionAction[];
  defaultSelectedActions: string[];
  onActionsChange: (pageId: string, selectedActions: string[]) => void;
  isEditable: boolean;
}

interface RolePermissionsProp {
  initialPermissions: Permission[];
  onPermissionsChange: (permissions: Permission[]) => void;
  isEditable: boolean;
}

export const RolePermissions = ({
  initialPermissions,
  onPermissionsChange,
  isEditable,
}: RolePermissionsProp) => {
  // use States
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    initialPermissions.filter((perm) => perm.actions.length > 0),
  );

  // setting up initialPermissions
  useEffect(() => {
    setSelectedPermissions(
      initialPermissions.filter((perm) => perm.actions.length > 0),
    );
  }, [initialPermissions]);

  // Handlers
  const handlePermissionChange = (page: string, selectedActions: string[]) => {
    setSelectedPermissions((prev) => {
      const newPermissions =
        selectedActions.length === 0
          ? prev.filter((perm) => perm.page !== page)
          : prev.some((perm) => perm.page === page)
            ? prev.map((perm) =>
                perm.page === page
                  ? { ...perm, actions: selectedActions }
                  : perm,
              )
            : [...prev, { page: page, actions: selectedActions }];

      onPermissionsChange(newPermissions);
      return newPermissions;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {availablePermissionPages.map((page) => (
        <PermissionPageSection
          key={page.page}
          {...page}
          defaultSelectedActions={
            selectedPermissions.find((perm) => perm.page === page.page)
              ?.actions || []
          }
          onActionsChange={handlePermissionChange}
          isEditable={isEditable}
        />
      ))}
    </div>
  );
};

const PermissionPageSection = ({
  page,
  pageLabel,
  actions,
  defaultSelectedActions,
  onActionsChange,
  isEditable,
}: PermissionPageProps) => {
  const [selectedActions, setSelectedActions] = useState<string[]>(
    defaultSelectedActions,
  );

  useEffect(() => {
    setSelectedActions(defaultSelectedActions);
  }, [defaultSelectedActions]);

  const handleActionChange = (newSelectedActions: string[]) => {
    setSelectedActions(newSelectedActions);
    onActionsChange(page, newSelectedActions);
  };

  const toggleSelectAllActions = () => {
    const allActionValues = actions.map((action) => action.value);
    handleActionChange(
      selectedActions.length === actions.length ? [] : allActionValues,
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={page}
          checked={selectedActions.length === actions.length}
          onCheckedChange={toggleSelectAllActions}
          disabled={!isEditable}
        />
        <Label
          htmlFor={page}
          className={`text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            !selectedActions.length ? "text-primary/30" : ""
          }`}
        >
          {pageLabel}
        </Label>
      </div>
      <CheckboxList
        options={actions}
        selectedValues={selectedActions}
        setSelectedValues={handleActionChange}
        className="ml-6"
        isEditable={isEditable}
      />
    </div>
  );
};

export default RolePermissions;
