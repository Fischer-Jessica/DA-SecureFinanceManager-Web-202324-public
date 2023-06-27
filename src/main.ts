import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UsertableComponent } from './app/usertable/usertable.component';
import { MainComponent } from './app/main/main.component';

import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
