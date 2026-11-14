import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Check Supabase session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublicAuthPage = pathname === '/login' || pathname === '/register';

  // 1. Unauthenticated users trying to access protected portal pages -> redirect to /login
  if (!user && !isPublicAuthPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated users trying to visit auth pages (/login, /register) or root (/) -> redirect to dashboard
  if (user && (isPublicAuthPage || pathname === '/')) {
    const portalUrl = request.nextUrl.clone();
    portalUrl.pathname = '/dashboard';
    return NextResponse.redirect(portalUrl);
  }

  // 3. Standard users trying to access admin-only pages -> redirect to dashboard
  if (user) {
    const userRole = user.app_metadata?.role || user.user_metadata?.role || 'user';
    const isAdmin = userRole === 'admin';
    const isAdminOnlyPage =
      pathname.startsWith('/doctors') ||
      pathname.startsWith('/patients') ||
      pathname.startsWith('/sessions') ||
      pathname.startsWith('/users');

    if (!isAdmin && isAdminOnlyPage) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = '/dashboard';
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets (.svg, .png, .jpg, .woff, .woff2, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)',
  ],
};
