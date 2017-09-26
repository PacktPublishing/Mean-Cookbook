import { Renderer2, OnInit, Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document) {}

  public ngOnInit() {
    var s = this.renderer.createElement('script');
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/v2/checkout.js";

    this.renderer.addClass(s, 'stripe-button');
    this.renderer.setAttribute(s, 'data-key', environment.stripeAPIKey);
    this.renderer.setAttribute(s, 'data-amount', '500');
    this.renderer.setAttribute(s, 'data-name', 'MEAN Stack Blog');
    this.renderer.setAttribute(s, 'data-description', 'Donation');
    this.renderer.setAttribute(s, 'data-locale', 'auto');
    this.renderer.appendChild(this.document.getElementById('stripeForm'), s);
  }
}
