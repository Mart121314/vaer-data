import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [HttpClientModule],
  })  
  export class AppModule {}

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
