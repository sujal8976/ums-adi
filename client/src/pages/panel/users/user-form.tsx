import { DatePickerV2 } from "@/components/custom ui/date-time-pickers";
import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import { MultiSelect } from "@/components/custom ui/multi-select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilteredRoles } from "@/hooks/use-role.ts";
import { useToast } from "@/hooks/use-toast";
import { useCreateUser } from "@/store/users";
import { toProperCase } from "@/utils/func/strUtils";
import { formatZodErrors } from "@/utils/func/zodUtils";
import { CustomAxiosError } from "@/utils/types/axios";
import { userType } from "@/store/users";
import { FullUserSchema } from "@/utils/zod-schema/user";
import { DialogClose } from "@radix-ui/react-dialog";
import { useState } from "react";
import { generatePassword } from "./user-func";
import CredentialsModal from "@/components/custom ui/credentials-modal";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue?: userType | null;
}

export const UserForm = ({ open, onOpenChange }: UserFormProps) => {
  // Hooks
  const { toast } = useToast();
  const createUserMutation = useCreateUser();
  const roles = useFilteredRoles();

  // use States
  const [isDefaultPass, setDefaultPass] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [newUser, setNewUser] = useState<Omit<userType, "_id">>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: undefined,
    roles: [],
    isLocked: false,
    settings: {
      isRegistered: true,
      isPassChange: isDefaultPass,
    },
  });

  const handleInputChange = (
    field: keyof userType,
    value: string | string[],
  ) => {
    setNewUser({ ...newUser, [field]: value });
  };

  const handleCreateUser = async () => {
    const username = newUser.username.toLowerCase();
    const password = isDefaultPass ? generatePassword() : newUser.password;
    const firstName = newUser.firstName ? toProperCase(newUser.firstName) : "";
    const lastName = newUser.lastName ? toProperCase(newUser.lastName) : "";

    const user = {
      ...newUser,
      username,
      password,
      firstName,
      lastName,
    };

    setNewUser(user);

    const validation = FullUserSchema.safeParse(user);

    if (!validation.success) {
      const errorMessages = formatZodErrors(validation.error.errors);

      toast({
        title: "Form Validation Error",
        description: `Please correct the following errors:\n${errorMessages}`,
        variant: "warning",
      });
      return;
    }

    //Actual user creation logic goes here
    try {
      await createUserMutation.mutateAsync(user);
      toast({
        title: "Success",
        description: "User created successfully",
        variant: "success",
      });
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

  const handleDateClick = (date: Date) => {
    setNewUser({ ...newUser, dob: date });
    console.log(date);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] px-2">
          <DialogHeader>
            <DialogTitle className="px-4">User registration form</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex flex-col gap-2 h-[450px] xl:h-auto xl:max-h-[80svh] px-4">
            <div className="flex gap-4 flex-col mb-6">
              <FormFieldWrapper
                LabelText="Name"
                LabelFor="firstNameField"
                Important
                className="gap-3"
              >
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <Input
                    id="firstNameField"
                    placeholder="Enter first name"
                    value={newUser.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Enter last name"
                    value={newUser.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                LabelText="Personal Info"
                LabelFor="emailField"
                Important
                className="gap-3"
              >
                <Input
                  id="emailField"
                  placeholder="Enter @ email"
                  type="email"
                  value={newUser.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <Input
                    inputMode="numeric"
                    placeholder="Enter phone number"
                    value={newUser.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                  <DatePickerV2
                    onDateChange={handleDateClick}
                    disableDates={"future"}
                    placeholder={"Select your DOB"}
                    closeOnDayClick
                  />
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                LabelText="Username & Password"
                LabelFor="usernameField"
                Important
                className="gap-3"
              >
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <Input
                    id="usernameField"
                    placeholder="Enter username"
                    type="text"
                    value={newUser.username || ""}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                  />
                  <PasswordInput
                    wrapperClassName="w-full"
                    placeholder={
                      isDefaultPass ? "Generated Password..." : "Enter password"
                    }
                    autoComplete="new-password"
                    disabled={isDefaultPass}
                    value={isDefaultPass ? "" : newUser.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-3 px-1">
                  <Checkbox
                    id="defaultPass"
                    checked={isDefaultPass}
                    onClick={() => setDefaultPass(!isDefaultPass)}
                  />
                  <Label
                    htmlFor="defaultPass"
                    className="font-semibold leading-5"
                  >
                    Generate random password, require change on first login
                  </Label>
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper
                LabelText="Roles"
                LabelFor="roleField"
                Important
                className="gap-3"
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreateUser}>Create</Button>
            </DialogFooter>
          </ScrollArea>
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
