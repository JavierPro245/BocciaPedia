import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';


@Injectable({
  providedIn: 'root'
})
export class CastService {

  private initialized = false;

  async initialize() {

    if (this.initialized) {
      return;
    }

    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // await Chromecast.initialize({

    //   appId: '7B9440C4'

    // });

    this.initialized = true;

  }

  async connect(): Promise<boolean> {

    try {

      await this.initialize();

    //   await Chromecast.requestSession();

      return true;

    } catch (e) {

      console.error(e);

      return false;

    }

  }

  async sendMatch(matchId: string) {

    // return Chromecast.sendMessage({

    //   namespace: 'urn:x-cast:bocciapedia',

    //   message: JSON.stringify({

        // matchId

    //   })

    // });

  }

}