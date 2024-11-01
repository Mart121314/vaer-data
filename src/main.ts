import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // Configures HttpClient to use fetch API
    ...appConfig.providers // if you have other providers from appConfig
  ],
}).catch((err) => console.error(err));