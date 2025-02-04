import * as React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import * as lucideIcons from "lucide-react";
import { AlignLeft, LogOut } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

// NavLink & SidebarProps interface used for both Normal Sidebar and SheetSidebar
interface NavLink {
  icon: string;
  label: string;
  to: string;
  notifications?: string;
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  NavLinks: NavLink[];
  currPage: string;
  logoutFunc: () => void;
}

// Rendering both the normal sidebar and the sheet sidebar.
// The normal sidebar is shown on large screens, while the sheet sidebar is hidden and vica verca on smaller screens.
// normal sidebar is hardcoded and sheet sidebar is made a component that is wrapped around a div
const Sidebar: React.FC<SidebarProps> = ({
  NavLinks,
  currPage,
  logoutFunc,
  className,
  ...props
}) => {
  return (
    <>
      <aside
        className={cn(
          "hidden bg-card border-r-2 w-full h-full 2xl:flex flex-col justify-start items-center",
          className,
        )}
        {...props}
      >
        <div
          id="logo"
          className="w-full flex-center border-b-2 text-2xl font-bold"
        >
          LOGO
        </div>
        <ul id="links" className="mb-auto relative">
          {NavLinks.map((item, index) => (
            <CustomListWrapper key={index} ActiveLink={currPage === item.label}>
              <NavLink item={item} />
            </CustomListWrapper>
          ))}
          <CustomListWrapper
            ActiveLink={false}
            onClick={() => logoutFunc()}
            className="flex flex-row justify-start items-center gap-5 absolute bottom-0 cursor-pointer my-7"
          >
            <LogOut /> Logout
          </CustomListWrapper>
        </ul>
      </aside>
      <div className="2xl:hidden bg-card border-b-2 h-full flex justify-center items-center p-4 pr-0">
        <SheetSidebar
          NavLinks={NavLinks}
          currPage={currPage}
          logoutFunc={logoutFunc}
        />
      </div>
    </>
  );
};

const SheetSidebar: React.FC<SidebarProps> = ({
  NavLinks,
  currPage,
  logoutFunc,
  className,
  ...props
}) => {
  // Function to handle closing the sheet
  const handleLinkClick = () => {
    const closeButton = document.querySelector(
      "[data-state='open']",
    ) as HTMLElement;
    if (closeButton) {
      closeButton.click();
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <AlignLeft />
        </Button>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "flex flex-col justify-start items-start gap-4",
          className,
        )}
        {...props}
        side="left"
      >
        <SheetHeader>
          <SheetTitle>LOGO</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[725px] w-full">
          <ul id="links" className="h-full relative">
            {NavLinks.map((item, index) => (
              <CustomListWrapper
                key={index}
                ActiveLink={currPage === item.label}
              >
                <NavLink item={item} linkClick={handleLinkClick} />
              </CustomListWrapper>
            ))}
            <CustomListWrapper
              ActiveLink={false}
              onClick={() => {
                logoutFunc();
                handleLinkClick();
              }}
              className="flex flex-row justify-start items-center gap-5 my-4"
            >
              <LogOut /> Logout
            </CustomListWrapper>
          </ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// Custom reusable components for sidebar
interface CustomListWrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  ActiveLink: boolean;
  className?: string;
}

const CustomListWrapper = ({
  children,
  ActiveLink,
  className,
  ...props
}: CustomListWrapperProps) => (
  <li
    className={cn(
      ` text-sm font-semibold hover:text-primary/95 hover:translate-x-6 transition-transform ${
        ActiveLink ? "text-primary" : "text-primary/50"
      }`,
      className,
    )}
    {...props}
  >
    {children}
  </li>
);

const NavLink = ({
  item,
  linkClick,
}: {
  item: NavLink;
  linkClick?: (page: string) => void;
}) => {
  const IconComponent = iconMap[item.icon.toLowerCase()];

  return (
    <Link
      to={`/panel${item.to}`}
      className="py-4 flex flex-row justify-start items-center gap-5"
      onClick={() => linkClick?.(item.label)}
    >
      {IconComponent && <IconComponent />} {/* Render the icon component */}
      <span className="relative flex items-center">
        {item.label}
        {item.notifications && <CustomBadge count={item.notifications} />}
      </span>
    </Link>
  );
};

const CustomBadge = ({ count }: { count: string }): JSX.Element => (
  <Badge className="absolute left-[125%] rounded-[5px] px-2 bg-red-500 text-zinc-100 hover:bg-red-500">
    {count}
  </Badge>
);

export { Sidebar, SheetSidebar };

// Creates a lookup table for dynamically rendering icons.
// The `iconMap` object maps icon names (in lowercase) to their corresponding React components from the `lucide-react` library.
// This allows for rendering icons based on a string identifier, ensuring flexibility and consistency in icon usage throughout the application.
type IconMap = { [key: string]: React.ComponentType };

const iconMap: IconMap = Object.keys(lucideIcons)
  .filter((key) => key[0] === key[0].toUpperCase())
  .reduce((acc, key) => {
    acc[key.toLowerCase()] = lucideIcons[
      key as keyof typeof lucideIcons
    ] as React.ComponentType;
    return acc;
  }, {} as IconMap);
