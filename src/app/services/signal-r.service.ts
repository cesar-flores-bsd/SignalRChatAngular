import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { ChartModel } from '../interfaces/ChartModel';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  public data: ChartModel[];

  private hubConnection: signalR.HubConnection;
  public bradcastedData: string;

    public startConnection = () => {
      this.hubConnection = new signalR.HubConnectionBuilder()
                              .withUrl('http://localhost:5001/chart')
                              .configureLogging(signalR.LogLevel.Information)
                              .build();

      this.hubConnection
        .start()
        .then(() => {
            console.log('Connection started');
            this.addBroadcastChartDataListener();
          })
        .catch(err => console.log('Error while starting connection: ' + err));

      this.hubConnection.onclose(() => {
        setTimeout(function() {
          this.hubConnection.start()
                     .done(() => {
                          this.startingSubject.next();
                          console.log('Connection started');
                          this.addBroadcastChartDataListener();
                         })
                        .fail((error: any) => {
                              this.startingSubject.error(error);
                         });
             }, 3000);
        });
    }

    public addTransferChartDataListener = () => {
      this.hubConnection.on('transferchartdata', (data) => {
        this.data = data;
        console.log(data);
      });
    }

    public broadcastChartData = (msg: string) => {
      this.hubConnection.invoke('broadcastchartdata', msg)
      .catch(err => console.error(err));
    }

    public addBroadcastChartDataListener = () => {
      console.log('Se registro el evento broadcast');
      this.hubConnection.on('broadcastchartdata', (data) => {
        this.bradcastedData =  data;
      });
    }
}
