import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogIngresoComponent } from './form-dialog-ingreso.component';

describe('FormDialogIngresoComponent', () => {
  let component: FormDialogIngresoComponent;
  let fixture: ComponentFixture<FormDialogIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDialogIngresoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDialogIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
