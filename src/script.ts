import { setTimeout } from 'node:timers/promises';
import axios from 'axios';

let breakScheduler: boolean = false;
let delay: number = 1000;
let counter: number = 0;

(async () => {
  while (!breakScheduler) {
    await setTimeout(delay);
    console.log('delay');
    console.log('counter', counter);
    counter = counter + 1;
    if (counter === 10) {
      breakScheduler = true;
    }
  }
})();
