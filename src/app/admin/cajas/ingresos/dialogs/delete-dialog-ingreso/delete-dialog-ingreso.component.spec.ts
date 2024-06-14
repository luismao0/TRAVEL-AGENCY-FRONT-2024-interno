import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDialogIngresoComponent } from './delete-dialog-ingreso.component';

describe('DeleteDialogIngresoComponent', () => {
  let component: DeleteDialogIngresoComponent;
  let fixture: ComponentFixture<DeleteDialogIngresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDialogIngresoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteDialogIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
