import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

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
    expect(tester.debugElement.query(By.directive(MenuComponent))).not.toBeNull();
    expect(tester.debugElement.query(By.directive(RouterOutlet))).not.toBeNull();
  });
});
