import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class BraintreeService {
  url = environment.braintree.url

  constructor(private http: HttpClient) { }

  createTransaction(amount: number, nonce: string, deviceData: string) {
    const body = {
      amount: amount,
      nonce: nonce,
      deviceData: deviceData
    }

    return this.http.post(`${this.url}/transactions`, body)
  }

  getTestAmounts() {
    return this.http.get<Array<TestAmount>>(`${this.url}/test-amounts`)
  }

  getTestCards() {
    return this.http.get<Array<TestCard>>(`${this.url}/test-cards`)
  }

  getNewToken() {
    return this.http.get(`${this.url}/tokens/new`, { responseType: 'text' })
  }
}

export interface TestAmount {
  rangeFloor: number
  rangeCeiling?: number
  authorized: boolean
}

export interface TestCard {
  type: string
  number: string
}
