
import { provideClientHydration } from '@angular/platform-browser';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideCacheableAnimationLoader, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';  

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    provideRouter(routes), 
    provideLottieOptions({ player: () => player}),
    provideCacheableAnimationLoader()
  ]
  // providers: [provideClientHydration(),provideRouter(routes)]
};
