import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getHighestPrecedenceRole } from "@/hooks/use-role";
import { UserAction } from "@/pages/panel/users/user-actions";
import { useAuth } from "@/store/auth";
import { useRoles } from "@/store/role";
import { userType } from "@/store/users";

interface UserTableProps {
  userList: userType[];
  firstIndex: number;
}

export const UserTable = ({ userList, firstIndex }: UserTableProps) => {
  const { rolesQuery } = useRoles();
  const { combinedRole } = useAuth(false);

  const shouldDisableAction = (userRoles: string[]) => {
    if (!rolesQuery.data || !combinedRole?.highestPrecedence) {
      return true; // Disable if we don't have role data yet
    }

    const targetUserRole = getHighestPrecedenceRole(userRoles, rolesQuery.data);
    if (!targetUserRole) {
      return true; // Disable if we can't determine the user's role
    }

    // Disable if target user's role precedence is >= current user's precedence
    return targetUserRole.precedence <= combinedRole.highestPrecedence;
  };

  return (
    <Card className="w-[90svw] md:w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-card">
            <TableHead>#</TableHead>
            <TableHead className="whitespace-nowrap">Employee Name</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList.length === 0 ? (
            <TableRow className="hover:bg-card">
              <TableCell colSpan={8} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            userList.map((user, index) => (
              <TableRow key={user._id} className="hover:bg-card">
                <TableCell>{firstIndex + index + 1}</TableCell>
                <TableCell className="whitespace-nowrap">
                  {user.firstName + " " + user.lastName}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email || "N/A"}</TableCell>
                <TableCell>{user.isLocked ? "Locked" : "Unlocked"}</TableCell>
                <TableCell className="cursor-default">
                  <HoverCard>
                    <HoverCardTrigger>
                      {rolesQuery.data
                        ? getHighestPrecedenceRole(user.roles, rolesQuery.data)
                            ?.name
                        : user.roles[0]}
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto">
                      <div className="text-sm font-semibold">
                        Roles assigned : {user.roles.join(", ")}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <UserAction
                    user={user}
                    isDisabled={shouldDisableAction(user.roles)}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
