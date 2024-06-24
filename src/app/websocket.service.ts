import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket$: WebSocketSubject<any>;
  private readonly socketUrl = `ws://127.0.0.1:8000/ws`;  // URL do seu WebSocket no backend

  constructor() {
    this.socket$ = webSocket(this.socketUrl);
  }

  connect() {
    return this.socket$.asObservable();
  }

  sendMessage(message: any) {
    this.socket$.next(message);
  }
}
