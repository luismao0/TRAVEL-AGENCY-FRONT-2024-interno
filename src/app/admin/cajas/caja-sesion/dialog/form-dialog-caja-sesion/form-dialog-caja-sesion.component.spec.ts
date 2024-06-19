import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogCajaSesionComponent } from './form-dialog-caja-sesion.component';

describe('FormDialogCajaSesionComponent', () => {
  let component: FormDialogCajaSesionComponent;
  let fixture: ComponentFixture<FormDialogCajaSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDialogCajaSesionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDialogCajaSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
