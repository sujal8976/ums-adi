import { useBreadcrumb } from "@/hooks/use-breadcrumb";
import { useEffect } from "react";
import { Role } from "./role";

const Settings = () => {
  const { setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs([{ label: "Settings" }]);
  }, [setBreadcrumbs]);
  return <Role />;
};

export default Settings;