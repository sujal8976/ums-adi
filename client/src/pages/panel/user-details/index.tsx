import { CenterWrapper } from "@/components/custom ui/center-page";
import { Loader } from "@/components/custom ui/loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import useUserStore, { useUser } from "@/store/users";
import { userType } from "@/store/users";
import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  NameForm,
  PersonalInfoForm,
  RolesForm,
  UsernameForm,
} from "./user-form";
import { UserActionButtons } from "./user-action-btns";
import { useAuth } from "@/store/auth";
import CredentialsModal from "@/components/custom ui/credentials-modal";
import { useUserDialogs } from "./user-dialog-hook";
import { CustomAxiosError } from "@/utils/types/axios";
import ErrorCard from "@/components/custom ui/error-display";

const INITIAL_USER_STATE: Partial<userType> = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  phone: "",
  roles: [],
  dob: undefined,
  settings: { isRegistered: true, isPassChange: false },
};

function UserDetails() {
  const { selectedUserId } = useUserStore();
  const { setBreadcrumbs } = useBreadcrumb();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, logout: handleLogout } = useAuth();
  const userId = selectedUserId || id;

  const { data: user, isLoading, error } = useUser(userId!);
  const [isEditable, setEditable] = useState(false);
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false);
  const [tempPass, setTempPass] = useState("");
  const [userData, setUserData] =
    useState<Partial<userType>>(INITIAL_USER_STATE);
  const [originalData, setOriginalData] =
    useState<Partial<userType>>(INITIAL_USER_STATE);

  const hasChanges = useCallback(() => {
    return !isEqual(userData, originalData);
  }, [userData, originalData]);

  const {
    dialog,
    handleUpdate,
    handleDelete,
    handleResetPassword,
    handleLock,
  } = useUserDialogs({
    userId: userId!,
    userData,
    originalData,
    username: user?.username || "",
    currentUserId: currentUser?._id,
    isEditable,
    setEditable,
    setUserData,
    setTempPass,
    setIsCredentialsOpen,
    hasChanges,
  });

  useEffect(() => {
    if (user) {
      const formattedUser = {
        ...INITIAL_USER_STATE,
        ...user,
        dob: user.dob ? new Date(user.dob) : undefined,
      };
      setUserData(formattedUser);
      setOriginalData(formattedUser);
    }
  }, [user]);

  useEffect(() => {
    setBreadcrumbs([
      { to: "/panel/users/", label: "Users" },
      { label: "Details" },
    ]);
  }, [setBreadcrumbs]);

  if (!userId || error) {
    const { response, message } = error as CustomAxiosError;
    let errMsg = response?.data.error ?? message;

    if (errMsg === "Access denied. No token provided")
      errMsg = "Access denied. No token provided please login again";

    if (errMsg === "Network Error")
      errMsg =
        "Connection issue detected. Please check your internet or try again later.";

    return (
      <CenterWrapper className="px-2 gap-2 text-center">
        <ErrorCard
          title="Error occured"
          description={errMsg}
          btnTitle="Go to Login"
          onAction={handleLogout}
        />
      </CenterWrapper>
    );
  }

  if (isLoading)
    return (
      <CenterWrapper>
        <Loader />
      </CenterWrapper>
    );

  return (
    <>
      <Card className="my-10 w-[90%] md:w-full max-w-md">
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>
            Information about user: {user?.username}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 flex-col">
          <NameForm
            userData={userData}
            isEditable={isEditable}
            onInputChange={(field, value) =>
              setUserData((prev) => ({ ...prev, [field]: value }))
            }
          />
          <PersonalInfoForm
            userData={userData}
            isEditable={isEditable}
            onInputChange={(field, value) =>
              setUserData((prev) => ({ ...prev, [field]: value }))
            }
          />
          <UsernameForm userData={userData} />
          <RolesForm
            userData={userData}
            isEditable={isEditable}
            onInputChange={(field, value) =>
              setUserData((prev) => ({ ...prev, [field]: value }))
            }
          />
        </CardContent>
        <CardFooter>
          <UserActionButtons
            isEditable={isEditable}
            userData={userData}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            onResetPassword={handleResetPassword}
            onLockUser={handleLock}
          />
        </CardFooter>
      </Card>
      <dialog.AlertDialog />
      <CredentialsModal
        open={isCredentialsOpen}
        onOpenChange={setIsCredentialsOpen}
        username={userData.username || "N/A"}
        password={tempPass || "N/A"}
      />
    </>
  );
}

export default UserDetails;
