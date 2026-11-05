export function matchesRoutePath(pathname: string, route: string): boolean {
    return pathname === route || pathname.startsWith(`${route}/`);
}

export function matchesAnyRoutePath(pathname: string, routes: readonly string[]): boolean {
    return routes.some((route) => matchesRoutePath(pathname, route));
}
