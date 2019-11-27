import {EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from '../../environments/environment.prod';
import { debug } from 'util';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageModel } from '../interfaces/ChartModel';
@Injectable({
  providedIn: 'root'
})
export class HubConexionService {
  MessageReceived = new EventEmitter<MessageModel>();
  connectionStablished = new EventEmitter<boolean>();
  constructor(private sanitizer: DomSanitizer) { }

  private hubConnection: signalR.HubConnection;
  public messages: any[] = [];

  private conexionPromise: Promise<void>;
public startConnection = () => {
  this.hubConnection = new signalR.HubConnectionBuilder()
  .configureLogging(signalR.LogLevel.Trace)
  .withUrl(environment.UrlApi)
  .build();

  this.conexionPromise = this.hubConnection.start();

  this.conexionPromise.then(() => {
            console.log('Connection started');
            // this.ReceiveMessage();
            this.registerOnServerEvents();
          })
        .catch(err => console.log('Error while starting connection: ' + err));
  this.hubConnection.onclose(() => {
      console.log('Se cerro la conexion');
      setTimeout(function() {
      this.hubConnection.start()
                 .done(() => {
                      this.startingSubject.next();
                      console.log('Connection started');
                     })
                    .fail((error: any) => {
                     });
         }, 3000);
    });
}

private registerOnServerEvents(): void {
  this.hubConnection.on('ReceiveMessage', (user, message) => {
    const model = new MessageModel();
    model.User = user;
    model.Menssage = message;
    this.MessageReceived.emit(model);
  });
}
// public ReceiveMessage = () => {
//   this.hubConnection.on('ReceiveMessage', (user, message) => {
//       const model = new MessageModel();
//       model.User = user;
//       model.Menssage = message;
//       this.MessageReceived.emit(model);
//     }
//   );
// }

public SendMessage = (user: any, msg: string) => {
  this.conexionPromise.then(() => {
  this.hubConnection.invoke('SendMessage', user, msg)
  .catch(err => console.error(err));
  });
}

}
