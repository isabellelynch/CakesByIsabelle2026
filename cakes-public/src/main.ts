import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomeList } from './app/home-list/home-list';
import { OrdersList } from './app/orders-list/orders-list';

if (document.querySelector('app-home-list')) {
  bootstrapApplication(HomeList, appConfig)
    .catch((err) => console.error(err));
}

if (document.querySelector('app-orders-list')) {
  bootstrapApplication(OrdersList, appConfig)
    .catch((err) => console.error(err));
}
