import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    const token = localStorage.getItem('token');
    const allowedDomains = ['localhost:7213'];
    const disallowedRoutes = [
        'https://localhost:7213/api/auth/register',
        'https://localhost:7213/api/auth/login'
    ];
    
    const isAllowedDomain = allowedDomains.some(domain => req.url.includes(domain));
    const isDisallowedRoute = disallowedRoutes.some(route => req.url === route);

    if (token && isAllowedDomain && !isDisallowedRoute) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(req);
};