import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CardPaymentFormComponent } from './card-payment-form.component'

describe('CcPaymentFormComponent', () => {
  let component: CardPaymentFormComponent
  let fixture: ComponentFixture<CardPaymentFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardPaymentFormComponent ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(CardPaymentFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
