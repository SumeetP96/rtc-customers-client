import { Link, Breadcrumbs as MuiBreadCrumbs } from '@mui/material';
import { AgnosticDataRouteObject } from '@remix-run/router';
import { useCallback, useMemo } from 'react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { AppRoutes, EAppRoutes, IRouteMetaMap } from '../../router/constants';
import { router } from '../../router/router';

export interface IBreadcrumb {
  label: string;
  to?: string;
  active?: boolean;
  disabled?: boolean;
}

export interface IBreadcrumbsProps {
  breadcrumbs: IBreadcrumb[];
}

export default function Breadcrumbs({ breadcrumbs }: IBreadcrumbsProps) {
  const navigate = useNavigate();

  const location = useLocation();

  const getAppRoute = useCallback((path: string): IRouteMetaMap => {
    const appRouteKey = Object.keys(EAppRoutes).find((r) => {
      return EAppRoutes[r as keyof typeof EAppRoutes] === path;
    });

    return AppRoutes[appRouteKey as keyof typeof EAppRoutes];
  }, []);

  const generateBreadcrumbs = useCallback(() => {
    const crumbs: IBreadcrumb[] = [];

    const extractRoutes = (routes: AgnosticDataRouteObject[]) => {
      if (!routes.length) return;

      routes.forEach((route) => {
        if (
          (route.path && location.pathname.includes(route.path)) ||
          matchPath(String(route.path), location.pathname)
        ) {
          let appRoute = getAppRoute(String(route.path));

          if (appRoute && appRoute.isPlaceholder && appRoute.redirectRoute) {
            appRoute = getAppRoute(appRoute.redirectRoute);
          }

          const isAdded = crumbs.find((c) => c.label === appRoute.label);

          if (appRoute && !isAdded) {
            crumbs.push({
              label: String(appRoute.label),
              to: route.path,
            });
          }

          if (route.children) {
            extractRoutes(route.children);
          }
        }
      });
    };

    extractRoutes(router.routes[0].children as AgnosticDataRouteObject[]);

    crumbs[crumbs.length - 1].active = true;

    return crumbs;
  }, [getAppRoute, location.pathname]);

  const items = useMemo(() => {
    if (breadcrumbs.length > 0) {
      return breadcrumbs;
    }

    const crumbs = generateBreadcrumbs();

    return crumbs.length > 1 ? crumbs : [];
  }, [breadcrumbs, generateBreadcrumbs]);

  return (
    <MuiBreadCrumbs>
      {items.map(({ label, to, active, disabled }) => (
        <Link
          key={label}
          underline={active || disabled ? 'none' : 'hover'}
          color={active || disabled ? 'textDisabled' : 'textPrimary'}
          fontWeight={400}
          onClick={() => {
            if (active || disabled || !to) return;
            navigate(to);
          }}
          sx={{
            cursor: active || disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {label}
        </Link>
      ))}
    </MuiBreadCrumbs>
  );
}
