import { PaginationControls } from "@/components/custom ui/pagination-controls";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAddButton } from "./user-add-button";
import { toProperCase } from "@/utils/func/strUtils";
import { Tooltip } from "@/components/custom ui/tooltip-provider";
import { FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleArrayType, useRoles } from "@/store/role";
import { useAuth } from "@/store/auth";
import { hasPermission } from "@/hooks/use-role.ts";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}

interface FilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
  isFiltered: boolean;
  onClearFilter: () => void;
}

interface RecordInfoProps {
  firstIndex?: number;
  lastIndex?: number;
  totalUsers?: number;
}

interface UserHeaderProp {
  filter: FilterProps;
  pagination: PaginationProps;
  recordInfo: RecordInfoProps;
}

export const UserHeader = ({
  filter,
  pagination,
  recordInfo,
}: UserHeaderProp) => {
  return (
    <div className="w-full flex justify-around md:justify-between items-center gap-2 flex-wrap">
      <Filter filter={filter} />
      <RecordInfo recordInfo={recordInfo} />
      <PaginationControls
        currPage={pagination.currentPage}
        nPage={pagination.totalPages}
        nthClick={pagination.onPageChange}
        prevClick={pagination.onPrevious}
        nextClick={pagination.onNext}
      />
    </div>
  );
};

const Filter = (props: { filter: FilterProps }) => {
  const { rolesArray: roles } = useRoles();
  const {
    searchTerm,
    onSearchChange,
    selectedRole,
    onRoleChange,
    isFiltered,
    onClearFilter,
  } = props.filter;

  const { combinedRole } = useAuth(false);
  const showUserAddButton = hasPermission(combinedRole, "Users", "create-user");

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search users"
        className="max-w-xs"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select onValueChange={onRoleChange} value={selectedRole}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Roles</SelectLabel>
            {roles.data &&
              roles.data.map((role: RoleArrayType) => {
                return (
                  <SelectItem value={role.name} key={role._id}>
                    {toProperCase(role.name)}
                  </SelectItem>
                );
              })}
          </SelectGroup>
        </SelectContent>
      </Select>

      {isFiltered && (
        <Tooltip content="Clear Filter" side="bottom">
          <Button
            onClick={onClearFilter}
            variant="outline"
            size="icon"
            className="px-2"
          >
            <FilterX size={20} />
          </Button>
        </Tooltip>
      )}

      {showUserAddButton && <UserAddButton />}
    </div>
  );
};

const RecordInfo = (props: { recordInfo: RecordInfoProps }) => {
  const { firstIndex, lastIndex, totalUsers } = props.recordInfo;

  const total = totalUsers ?? 0;
  const first =
    typeof firstIndex === "number" ? Math.min(firstIndex + 1, total) : 0;
  const last = typeof lastIndex === "number" ? Math.min(lastIndex, total) : 0;

  return (
    <h2 className="font-semibold text-lg">
      {`Record Count: ${first} - ${last} of ${total}`}
    </h2>
  );
};
