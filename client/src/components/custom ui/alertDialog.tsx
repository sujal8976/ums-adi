import { useState, useCallback } from "react";
import * as Icons from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogIcon,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export interface UseAlertDialogConfig {
  iconName: keyof typeof Icons;
  alertType?: "Danger" | "Warn" | "Success" | "Info";
  title: string;
  description: string;
  cancelLabel?: string | null;
  actionLabel?: string;
}

export function useAlertDialog(defaultConfig: UseAlertDialogConfig) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentConfig, setCurrentConfig] = useState(defaultConfig);
  const [handlers, setHandlers] = useState<{
    onAction?: () => void | Promise<void>;
    onCancel?: () => void | Promise<void>;
  }>({});

  const IconComponent = Icons[currentConfig.iconName] as React.ComponentType;

  const show = useCallback(
    (params?: {
      config?: Partial<UseAlertDialogConfig>;
      onAction?: () => void | Promise<void>;
      onCancel?: () => void | Promise<void>;
    }) => {
      if (params?.config) {
        setCurrentConfig((config) => ({ ...config, ...params.config }));
      }
      if (params?.onAction || params?.onCancel) {
        setHandlers({
          onAction: params.onAction,
          onCancel: params.onCancel,
        });
      }
      setIsOpen(true);
    },
    [],
  );

  const AlertDialogComponent = ({ trigger }: { trigger?: React.ReactNode }) => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="sm:w-auto">
        <AlertDialogIcon alertType={currentConfig.alertType}>
          <IconComponent />
        </AlertDialogIcon>
        <AlertDialogHeader className="sm:col-span-1">
          <AlertDialogTitle>{currentConfig.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {currentConfig.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:col-span-2">
          {currentConfig.cancelLabel && (
            <AlertDialogCancel
              onClick={async () => {
                await handlers.onCancel?.();
                setIsOpen(false);
                setCurrentConfig(defaultConfig);
              }}
            >
              {currentConfig.cancelLabel}
            </AlertDialogCancel>
          )}
          {currentConfig.actionLabel && (
            <AlertDialogAction
              onClick={async () => {
                await handlers.onAction?.();
                setIsOpen(false);
                setCurrentConfig(defaultConfig);
              }}
            >
              {currentConfig.actionLabel}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    isOpen,
    show,
    hide: () => {
      setIsOpen(false);
      setCurrentConfig(defaultConfig);
    },
    AlertDialog: AlertDialogComponent,
  };
}
