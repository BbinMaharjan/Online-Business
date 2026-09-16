import { ReactNode } from "react";
import { useAppSelector } from "../../store/hooks";

interface PermissionGuardProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  const permissions = useAppSelector((state) => state.auth.permissions) || [];

  const hasPermission = permissions.includes(permission);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface CanProps {
  permission: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export const Can: React.FC<CanProps> = ({
  permission,
  children,
  fallback = null,
}) => {
  return (
    <PermissionGuard permission={permission} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
};

export const usePermission = (permission: string) => {
  const permissions = useAppSelector((state) => state.auth.permissions);
  return permissions.includes(permission);
};

export const useAnyPermission = (permissions: string[]) => {
  const userPermissions = useAppSelector((state) => state.auth.permissions) || [];
  return permissions.some((p) => userPermissions.includes(p));
};

export const useAllPermissions = (permissions: string[]) => {
  const userPermissions = useAppSelector((state) => state.auth.permissions) || [];
  return permissions.every((p) => userPermissions.includes(p));
};
