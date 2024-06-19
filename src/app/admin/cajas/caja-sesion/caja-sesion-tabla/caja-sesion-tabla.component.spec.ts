import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaSesionTablaComponent } from './caja-sesion-tabla.component';

describe('CajaSesionTablaComponent', () => {
  let component: CajaSesionTablaComponent;
  let fixture: ComponentFixture<CajaSesionTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajaSesionTablaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CajaSesionTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
