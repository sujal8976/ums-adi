import styles from "@/scss/layout/MainLayout.module.scss";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  children: ReactNode;
}

export const CenterWrapper: React.FC<LoaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full flex justify-center items-center flex-col gap-1",
        styles.MainLayout,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
