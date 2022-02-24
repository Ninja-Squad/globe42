import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { MenuComponent } from './menu/menu.component';
import { RouterOutlet } from '@angular/router';
import { ComponentTester } from 'ngx-speculoos';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule]
    })
  );

  it('should create a menu and a router-outlet', () => {
    const tester = ComponentTester.create(AppComponent);
    expect(tester.element(MenuComponent)).not.toBeNull();
    expect(tester.element(RouterOutlet)).not.toBeNull();
  });
});
