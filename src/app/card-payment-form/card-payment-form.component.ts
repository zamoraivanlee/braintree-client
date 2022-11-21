import { HttpErrorResponse } from '@angular/common/http'
import { Component } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'

import * as braintree from 'braintree-web'
import { HostedFieldsHostedFieldsFieldData } from 'braintree-web/modules/hosted-fields'

import { BraintreeService, TestAmount } from '../braintree/braintree.service'

@Component({
  selector: 'app-card-payment-form',
  templateUrl: './card-payment-form.component.html',
  styleUrls: ['./card-payment-form.component.sass']
})
export class CardPaymentFormComponent {
  amountToPay = 0
  displayedColumns = ['rangeFloor', 'separator', 'rangeCeiling', 'result', 'input']
  hostedFieldStyles = {
    'input': {
      'color': '#3A3A3A',
      'font-family': 'monospace',
      'font-size': '16px'
    }
  }
  hostedFields = {
    number: {
      selector: '#card-number'
    },
    cardholderName: {
      selector: '#cardholder-name'
    },
    expirationDate: {
      selector: '#expiry-date'
    },
    cvv: {
      selector: '#cvv'
    }
  }
  hostedFieldsInstance: braintree.HostedFields | undefined = undefined
  processing = false
  testAmounts: TestAmount[] = []
  threeDSecureInstance: braintree.ThreeDSecure | undefined = undefined

  constructor(
    private braintreeService: BraintreeService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.setup()
    this.getTestAmounts()
  }

  inputAmount(rangeFloor: number, rangeCeiling?: number) {
    this.amountToPay = Number((Math.random() * ((rangeCeiling || 10000) - rangeFloor) + rangeFloor).toFixed(2))
  }

  pay() {
    this.processing = true

    this.hostedFieldsInstance?.tokenize()
      .then(payload => this.verifyCard(payload))
      .catch((error: braintree.BraintreeError) => {
        console.log(error)
        this.processing = false
        this.openSnackBar(error.message)
      })
  }

  private createTransaction(payload: braintree.ThreeDSecureVerifyPayload) {
    if (!payload.threeDSecureInfo.liabilityShifted) {
      this.processing = false
      this.openSnackBar('Payment Denied')
      return
    }
    
    this.braintreeService.createTransaction(this.amountToPay, payload.nonce, braintree.dataCollector.deviceData, payload.threeDSecureInfo.threeDSecureAuthenticationId).subscribe({
      next: result => {
        console.log(result)
        this.processing = false
        this.openSnackBar('Payment Approved')
      },
      error: (response: HttpErrorResponse) => {
        console.log(response.error)
        this.processing = false
        this.openSnackBar(response.error.title || response.message)
      }
    })
  }

  private findWrapper(field: HostedFieldsHostedFieldsFieldData) {
    return document.querySelector('.hosted-field-wrapper[hosted-field="' + field.container.id + '"]')
  }

  private getTestAmounts() {
    this.braintreeService.getTestAmounts().subscribe({
      next: amounts => this.testAmounts = amounts,
      error: (response: HttpErrorResponse) => this.snackBar.open(response.error.title || response.message)
    })
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Dismiss', { duration: 5000 })
  }

  private setup() {
    this.processing = true
    this.braintreeService.getNewToken().subscribe({
      next: token => {
        this.setupClient(token)
        this.setupThreeDSecure(token)
        this.processing = false
      },
      error: (response: HttpErrorResponse) => {
        console.log(response.error)
        this.processing = false
        this.snackBar.open(response.error.title || response.message)
      }
    })
  }

  private setupClient(token: string) {
    braintree.client.create({
      authorization: token
    }).then(clientInstance => {
      braintree.hostedFields.create({
        client: clientInstance,
        fields: this.hostedFields,
        styles: this.hostedFieldStyles
      }).then((hostedFieldsInstance) => {
        hostedFieldsInstance.on('focus', (event) => {
          const field = event.fields[event.emittedBy]
          const wrapper = this.findWrapper(field)

          wrapper?.classList.add('mat-focused')
          wrapper?.querySelector('.mdc-text-field')?.classList.add('mdc-text-field--focused')
          if (field.isEmpty) {
            wrapper?.querySelector('.mdc-floating-label')?.classList.add('mdc-floating-label--float-above')
          }
        })

        hostedFieldsInstance.on('blur', (event) => {
          const field = event.fields[event.emittedBy]
          const wrapper = this.findWrapper(field)

          wrapper?.classList.remove('mat-focused')
          wrapper?.querySelector('.mdc-text-field')?.classList.remove('mdc-text-field--focused')
          if (field.isEmpty) {
            wrapper?.querySelector('.mdc-floating-label')?.classList.remove('mdc-floating-label--float-above')
          }
        })

        hostedFieldsInstance.on('validityChange', (event) => {
          const field = event.fields[event.emittedBy]
          const wrapper = this.findWrapper(field)

          if (field.isPotentiallyValid) {
            wrapper?.querySelector('.mdc-text-field')?.classList.remove('mdc-text-field--invalid')
          } else {
            wrapper?.querySelector('.mdc-text-field')?.classList.add('mdc-text-field--invalid')
          }
        })
        
        this.hostedFieldsInstance = hostedFieldsInstance
      })
    })
  }

  private setupThreeDSecure(token: string) {
    braintree.threeDSecure.create({
      authorization: token,
      version: 2
    }).then(threeDSecureInstance => {
      threeDSecureInstance.on('lookup-complete', (data, next) => {
        if (next) next()
      })

      this.threeDSecureInstance = threeDSecureInstance
    })
  }

  private verifyCard(payload: braintree.HostedFieldsTokenizePayload) {
    this.threeDSecureInstance?.verifyCard({
      nonce: payload.nonce,
      amount: this.amountToPay,
      bin: payload.details.bin
    }).then(payload => this.createTransaction(payload))
  }
}
