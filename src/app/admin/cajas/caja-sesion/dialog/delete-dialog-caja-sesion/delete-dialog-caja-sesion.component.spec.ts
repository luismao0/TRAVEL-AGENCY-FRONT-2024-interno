import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDialogCajaSesionComponent } from './delete-dialog-caja-sesion.component';

describe('DeleteDialogCajaSesionComponent', () => {
  let component: DeleteDialogCajaSesionComponent;
  let fixture: ComponentFixture<DeleteDialogCajaSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDialogCajaSesionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteDialogCajaSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
