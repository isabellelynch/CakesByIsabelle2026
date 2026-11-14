import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomeList } from './app/home-list/home-list';

bootstrapApplication(HomeList, appConfig)
  .catch((err) => console.error(err));