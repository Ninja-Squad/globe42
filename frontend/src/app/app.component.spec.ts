import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { MenuComponent } from './menu/menu.component';
import { RouterOutlet } from '@angular/router';

describe('AppComponent', () => {

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [AppModule, RouterTestingModule]
  })));

  it('should create a menu and a router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const menuFixture = fixture.debugElement.query(By.directive(MenuComponent));
    expect(menuFixture).not.toBeNull();
    const routerOutletFixture = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutletFixture).not.toBeNull();
  });
});
