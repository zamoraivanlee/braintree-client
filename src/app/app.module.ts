import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'

import {ClipboardModule} from '@angular/cdk/clipboard'

import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatTableModule } from '@angular/material/table'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { CardPaymentFormComponent } from './card-payment-form/card-payment-form.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { BraintreeService } from './braintree/braintree.service';
import { TestCardListComponent } from './test-card-list/test-card-list.component'

@NgModule({
  declarations: [
    AppComponent,
    CardPaymentFormComponent,
    TestCardListComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ClipboardModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule
  ],
  providers: [BraintreeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
