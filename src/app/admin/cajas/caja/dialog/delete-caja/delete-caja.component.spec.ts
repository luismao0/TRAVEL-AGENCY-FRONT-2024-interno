import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCajaComponent } from './delete-caja.component';

describe('DeleteCajaComponent', () => {
  let component: DeleteCajaComponent;
  let fixture: ComponentFixture<DeleteCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCajaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
