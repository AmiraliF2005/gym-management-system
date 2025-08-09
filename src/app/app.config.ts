import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes, tokenGetter } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { TrainerService } from './services/trainerService';
import { ClassService } from './services/class-service';
import { jwtInterceptor } from './jwt.interceptor';
import { JwtHelperService } from '@auth0/angular-jwt';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    
        // provideJwt({
        //     config: {
        //         tokenGetter: tokenGetter,
        //         allowedDomains: ['localhost:7213'],
        //         disallowedRoutes: ['https://localhost:7213/api/auth/register', 'https://localhost:7213/api/auth/login']
        //     }
        // }),
        // AuthService, 
        // ClassService,
        // TrainerService
    
  ]
};
function provideJwt(arg0: { config: { tokenGetter: () => string | null; allowedDomains: string[]; disallowedRoutes: string[]; }; }): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}

