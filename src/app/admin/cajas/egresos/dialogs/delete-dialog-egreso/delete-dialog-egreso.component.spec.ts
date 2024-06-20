import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDialogEgresoComponent } from './delete-dialog-egreso.component';

describe('DeleteDialogEgresoComponent', () => {
  let component: DeleteDialogEgresoComponent;
  let fixture: ComponentFixture<DeleteDialogEgresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDialogEgresoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteDialogEgresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
