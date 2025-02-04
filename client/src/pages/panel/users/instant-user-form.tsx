import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import { MultiSelect } from "@/components/custom ui/multi-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFilteredRoles } from "@/hooks/use-role.ts";
import { useToast } from "@/hooks/use-toast";
import { useCreateUser } from "@/store/users";
import { toProperCase } from "@/utils/func/strUtils";
import { formatZodErrors } from "@/utils/func/zodUtils";
import { CustomAxiosError } from "@/utils/types/axios";
import { userType } from "@/store/users";
import { InstantUserSchema } from "@/utils/zod-schema/user";
import { useState } from "react";
import { generatePassword, generateUsername } from "./user-func";
import CredentialsModal from "@/components/custom ui/credentials-modal";

interface InstantUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InstantUserForm = ({
  open,
  onOpenChange,
}: InstantUserFormProps) => {
  // Hooks
  const { toast } = useToast();
  const createUserMutation = useCreateUser();
  const roles = useFilteredRoles();

  // use States
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<userType, "_id">>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    roles: [],
    isLocked: false,
    settings: {
      isRegistered: false,
      isPassChange: true,
    },
  });

  // Event Handlers
  const handleInputChange = (
    field: keyof userType,
    value: string | string[],
  ) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCreateUser = async () => {
    const username = generateUsername(newUser.firstName.toLowerCase() || "");
    const password = generatePassword();
    const firstName = newUser.firstName ? toProperCase(newUser.firstName) : "";
    const lastName = newUser.lastName ? toProperCase(newUser.lastName) : "";

    const user = {
      ...newUser,
      username,
      password,
      firstName,
      lastName,
    };

    const validation = InstantUserSchema.safeParse(user);

    if (!validation.success) {
      const errorMessages = formatZodErrors(validation.error.errors);

      toast({
        title: "Form Validation Error",
        description: `Please correct the following errors:\n${errorMessages}`,
        variant: "warning",
      });
      return;
    }

    setNewUser(user);
    //Actual user creation logic goes here
    try {
      await createUserMutation.mutateAsync(user);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      console.log(user);
      onOpenChange(false);
      setIsCredentialsOpen(true);
    } catch (error) {
      const Err = error as CustomAxiosError;
      if (Err.response?.data.error) {
        toast({
          title: "Error occured",
          description: `Failed to create user. ${Err.response?.data.error}`,
          variant: "destructive",
        });
      } else
        toast({
          title: "Error occured",
          description: "Failed to create user. Please try again.",
          variant: "destructive",
        });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[20rem]">
          <DialogHeader>
            <DialogTitle>User Form</DialogTitle>
            <DialogDescription>Create instant user</DialogDescription>
          </DialogHeader>
          <div>
            <div className="flex flex-col justify-center items-center gap-4">
              <FormFieldWrapper
                LabelText="FirstName"
                LabelFor="firstNameField"
                Important
                className="gap-2"
              >
                <Input
                  id="firstNameField"
                  placeholder="Enter first name"
                  value={newUser.firstName || ""}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </FormFieldWrapper>
              <FormFieldWrapper
                LabelText="LastName"
                LabelFor="lastNameField"
                Important
                className="gap-2"
              >
                <Input
                  id="lastNameField"
                  placeholder="Enter last name"
                  value={newUser.lastName || ""}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </FormFieldWrapper>
              <FormFieldWrapper
                LabelText="Roles"
                LabelFor="roleField"
                Important
                className="gap-2"
              >
                <MultiSelect
                  id="roleField"
                  options={roles}
                  defaultValue={newUser?.roles || []}
                  onValueChange={(value) => handleInputChange("roles", value)}
                  placeholder="Select participants"
                  variant="inverted"
                  maxCount={3}
                />
              </FormFieldWrapper>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateUser}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CredentialsModal
        open={isCredentialsOpen}
        onOpenChange={setIsCredentialsOpen}
        username={newUser.username}
        password={newUser.password || "N/A"}
      />
    </>
  );
};
