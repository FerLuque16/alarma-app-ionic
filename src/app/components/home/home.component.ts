import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  encendido:boolean = false;

  constructor(private auth: AuthService ,private router: Router) { }

  ngOnInit() {}

  volverSinCerrarSesion(){
    this.router.navigate(['/auth']);

  }
  volverYCerrarSesion(){
    this.auth.logout();
    this.router.navigate(['/auth']);

  }

  encender(){

    this.encendido = this.encendido ? false : true;
  }

}
