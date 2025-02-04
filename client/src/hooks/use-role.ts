import { useAuth } from "@/store/auth";
import {
  CombinedRoleType,
  RoleArrayType,
  RoleType,
  useRoles,
} from "@/store/role";
import { useMemo } from "react";

export const useFilteredRoles = () => {
  const { rolesArray } = useRoles();
  const { combinedRole } = useAuth(false);

  const roles = useMemo(() => {
    if (!rolesArray.data) {
      return [];
    }

    const mapRoleToOption = (role: RoleArrayType) => ({
      label: role.name,
      value: role.name,
    });

    // If no combined role info, return all roles
    if (!combinedRole?.highestPrecedence) {
      return rolesArray.data.map(mapRoleToOption);
    }

    // Filter roles based on precedence
    return rolesArray.data
      .filter((role) => role.precedence > combinedRole.highestPrecedence)
      .map(mapRoleToOption);
  }, [rolesArray.data, combinedRole?.highestPrecedence]);

  return roles;
};

export const getHighestPrecedenceRole = (
  roles: string[],
  allRoles: RoleType[],
) => {
  const matchingRoles = allRoles.filter((role) => roles.includes(role.name));

  return matchingRoles.length
    ? matchingRoles.reduce((highest, current) =>
        current.precedence < highest.precedence ? current : highest,
      )
    : null;
};

export function hasPermission(
  combinedRole: CombinedRoleType | null,
  pageName: string,
  actionName: string,
): boolean {
  if (!combinedRole) return false;
  const pagePermission = combinedRole.permissions.find(
    (permission) => permission.page === pageName,
  );
  return pagePermission ? pagePermission.actions.includes(actionName) : false;
}
