import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDialogEgresoComponent } from './form-dialog-egreso.component';

describe('FormDialogEgresoComponent', () => {
  let component: FormDialogEgresoComponent;
  let fixture: ComponentFixture<FormDialogEgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDialogEgresoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDialogEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
