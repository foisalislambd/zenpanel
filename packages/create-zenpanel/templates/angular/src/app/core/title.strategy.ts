import { Injectable } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { setDocumentTitle } from '@/app/lib/preferences';

/** Formats route `title`s as "Users · ZenPanel". */
@Injectable({ providedIn: 'root' })
export class AdminTitleStrategy extends TitleStrategy {
  override updateTitle(snapshot: RouterStateSnapshot): void {
    setDocumentTitle(this.buildTitle(snapshot));
  }
}
