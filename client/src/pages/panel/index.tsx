import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import { useEffect, useState } from "react";
import styles from "../../scss/layout/AppLayout.module.scss";

// Panel Components
import { MainBody } from "./modules/main";
import { Nav } from "./modules/nav";
import { Sidebar } from "./modules/sidebar";

import { useAuth } from "@/store/auth";
import { NavLinks } from "@/store/data/side-links";

export const Panel = () => {
  // useStates
  const [currPage, setPage] = useState("");

  //Hooks
  const {
    user: currUser,
    checkUser,
    combinedRole,
    logout: handleLogout,
  } = useAuth(false);

  const hasPageAccess = combinedRole?.permissions.map((page) => page.page);

  const FilteredNavLinks = NavLinks.filter((link) =>
    hasPageAccess?.includes(link.pageName),
  );

  const FirstPage = hasPageAccess ? hasPageAccess[0] : undefined;

  //useEffects
  useEffect(() => {
    if (FirstPage) setPage(FirstPage);
  }, [FirstPage]);

  useEffect(() => {
    if (!currUser) {
      checkUser(); // Manually check user when needed
    }
  }, [currUser, checkUser]);

  return (
    <BreadcrumbProvider>
      <div
        id="main-container"
        className={`bg-primary-foreground w-svw min-h-svh ${styles.AppLayout}`}
      >
        <Sidebar
          className={styles.AppSidebar}
          NavLinks={FilteredNavLinks}
          currPage={currPage}
          logoutFunc={handleLogout}
        />
        <Nav
          className={styles.AppNavbar}
          currContent={currPage}
          logoutFunc={handleLogout}
        />
        <MainBody
          className={styles.AppContent}
          currContent={currPage}
          setPage={setPage}
        />
      </div>
    </BreadcrumbProvider>
  );
};
