import { FormFieldWrapper } from "@/components/custom ui/form-field-wrapper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import { DefaultPermissions } from "@/store/data/permission";
import { formatZodErrors } from "@/utils/func/zodUtils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { z } from "zod";
import { useRoles } from "@/store/role";
import { CustomAxiosError } from "@/utils/types/axios";

interface RoleFormProp {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const RoleSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Role name must be at least 3 characters long." }),
  createdBy: z.string().nonempty("Creator is required"),
});

export const RoleForm = ({ isOpen, setIsOpen }: RoleFormProp) => {
  const { toast } = useToast();
  const { user: currUser } = useAuthStore();
  const { createRoleMutation } = useRoles();

  const [role, setRole] = useState({
    name: "",
    permissions: DefaultPermissions,
    createdBy: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currUser?._id) {
      setRole((prev) => ({ ...prev, createdBy: currUser._id }));
    }
  }, [currUser]);

  const handleSubmit = async () => {
    const validation = RoleSchema.safeParse(role);

    if (!validation.success) {
      const errorMessages = formatZodErrors(validation.error.errors);
      toast({
        title: "Form Validation Error",
        description: `Please correct the following errors:\n${errorMessages}`,
        variant: "warning",
      });
      return;
    }

    console.log(role);

    try {
      setIsSubmitting(true);
      await createRoleMutation.mutateAsync({
        name: role.name,
        permissions: role.permissions,
        createdBy: role.createdBy,
      });

      toast({
        title: "Success",
        description: `Role "${role.name}" has been created successfully`,
        variant: "success",
      });

      setRole({
        name: "",
        permissions: DefaultPermissions,
        createdBy: currUser?._id || "",
      });
      setIsOpen(false);
    } catch (error) {
      const err = error as CustomAxiosError;
      toast({
        title: "Error",
        description: err ? err.response?.data.error : "Failed to create role",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Role Form</DialogTitle>
          <DialogDescription>Fill the form to add the role</DialogDescription>
        </DialogHeader>
        <FormFieldWrapper Important LabelText="Role Name">
          <Input
            placeholder="Enter role name"
            value={role.name}
            onChange={(e) => setRole({ ...role, name: e.target.value })}
            disabled={isSubmitting}
          />
        </FormFieldWrapper>
        <DialogFooter>
          <Button
            disabled={!role.name || isSubmitting}
            className="font-semibold"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Adding role..." : "Add role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
