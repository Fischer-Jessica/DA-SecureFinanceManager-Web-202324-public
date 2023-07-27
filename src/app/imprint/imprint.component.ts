import {Component} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.css']
})

export class ImprintComponent {
  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'de'])
    translate.setDefaultLang('en');
    translate.use('de');
  }
}
