import { Permission } from "../role";

export const AdminPermissions: Permission[] = [
  {
    page: "Dashboard",
    actions: ["read"],
  },
  {
    page: "Users",
    actions: [
      "read",
      "reset-password",
      "create-user",
      "lock-user",
      "read-details",
      "update-user",
      "delete-user",
    ],
  },
  {
    page: "Task",
    actions: ["read", "create", "delete", "update"],
  },
  {
    page: "Report",
    actions: ["read-users"],
  },
  {
    page: "Settings",
    actions: [
      "create-role",
      "update-role",
      "read-role",
      "delete-role",
      "change-precedence",
    ],
  },
];

export const DefaultPermissions: Permission[] = [
  {
    page: "Dashboard",
    actions: ["read"],
  },
  {
    page: "Task",
    actions: ["read", "create", "delete", "update"],
  },
];

interface PermissionAction {
  value: string;
  label: string;
}

interface AvailablePermissionPage {
  page: string;
  pageLabel: string;
  actions: PermissionAction[];
}

export const availablePermissionPages: AvailablePermissionPage[] = [
  {
    page: "Dashboard",
    pageLabel: "Dashboard Sections",
    actions: [
      { value: "read", label: "View Dashboard" }, // Based on AdminPermissions
    ],
  },
  {
    page: "Users",
    pageLabel: "Users Sections",
    actions: [
      { value: "read", label: "View Users" },
      { value: "create-user", label: "Create new users" },
      { value: "read-details", label: "View user details" },
      { value: "update-user", label: "Update user details" },
      { value: "delete-user", label: "Delete user" },
      { value: "lock-user", label: "Lock users" },
    ],
  },
  {
    page: "Task",
    pageLabel: "Task Sections",
    actions: [
      { value: "read", label: "View Tasks" },
      { value: "create", label: "Create Tasks" },
      { value: "delete", label: "Delete Tasks" },
      { value: "update", label: "Update Tasks" },
    ],
  },
  {
    page: "Report",
    pageLabel: "Report Sections",
    actions: [{ value: "read-users", label: "View User Reports" }],
  },
  {
    page: "Settings",
    pageLabel: "Settings Sections",
    actions: [
      { value: "create-role", label: "Create Roles" },
      { value: "update-role", label: "View & Update Roles" },
      { value: "read-role", label: "View Roles" },
      { value: "delete-role", label: "Delete Roles" },
      { value: "change-precedence", label: "Chnage Role Precedence" },
    ],
  },
];
