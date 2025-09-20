import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryEvolutionComponent } from './salary.evolution.component';

describe('SalaryEvolutionComponent', () => {
  let component: SalaryEvolutionComponent;
  let fixture: ComponentFixture<SalaryEvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryEvolutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
