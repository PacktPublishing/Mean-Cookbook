import {ErrorHandler} from '@angular/core';
import * as Raven from 'raven-js';
import { environment } from '../environments/environment';

const SENTRY_DSN:string = environment.sentryDSN;

Raven
  .config(SENTRY_DSN)
  .install();

export class RavenErrorHandler implements ErrorHandler {
  handleError(err:any) : void {
    if (environment.production) {
      Raven.captureException(err);
    } else {
      console.error(err);
    }
  }
}

export default { provide: ErrorHandler, useClass: RavenErrorHandler };
