import { Component, OnInit, NgZone } from '@angular/core';
import { HubConexionService } from '../../services/hub-conexion.service';
import { MessageModel } from '../../interfaces/ChartModel';

@Component({
  selector: 'app-signal-test',
  templateUrl: './signal-test.component.html',
  styleUrls: ['./signal-test.component.scss']
})
export class SignalTestComponent implements OnInit {

  MessageData: any[];
  User: string;
  Mensaje: string;
  messages = new Array<MessageModel>();
  message = new MessageModel();
  constructor(public signalService: HubConexionService, private ngZone: NgZone  ) {
    this.subscribeToEvents();
   }

   private subscribeToEvents(): void {

    this.signalService.MessageReceived.subscribe((message: MessageModel) => {
      this.ngZone.run(() => {
          this.messages.push(message);
      });
    });
  }

  ngOnInit() {
    this.signalService.startConnection();
  }

  SendMensaje() {
    this.signalService.SendMessage(this.User, this.Mensaje);
  }

}
