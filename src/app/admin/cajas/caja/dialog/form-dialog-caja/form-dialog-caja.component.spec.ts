import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogCajaComponent } from './form-dialog-caja.component';

describe('FormDialogCajaComponent', () => {
  let component: FormDialogCajaComponent;
  let fixture: ComponentFixture<FormDialogCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDialogCajaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDialogCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
