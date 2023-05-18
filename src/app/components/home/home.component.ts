import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

import { DeviceMotion, DeviceMotionAccelerationData } from '@awesome-cordova-plugins/device-motion';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  encendido:boolean = false;

  accelerationX:any = 'Aceleracion X';
  accelerationZ:any = 'Aceleracion Z';
  accelerationY:any = 'Aceleracion Y';

  alarmOnOff: boolean = false;
  showDialog: boolean = false;
  estado = '';
  clave: string = "";

  //Ingresos para flash
  primerIngreso: boolean = true;
  primerIngresoFlash: boolean = true;
 
  //ORIENTACION
  posicionActualCelular = 'actual';
  posicionAnteriorCelular = 'anterior';
 
  mostrarDialog: boolean = true;

  subscription: any;
  //Sonidos
  audioIzquierda = "../../assets/audios/hurtando.wav";
  audioDerecha = "../../assets/audios/epa.wav";
  audioVertical = "../../assets/audios/bajalo.wav";
  audioHorizontal = "../../assets/audios/soltame.wav";
  audioError = "../../assets/audios/sirena.mp3";
  audio = new Audio();

  constructor(private auth: AuthService ,private router: Router, private screenOrientation: ScreenOrientation,
    private flashlight: Flashlight, private vibration:Vibration) { }

  ngOnInit() {
  }
  vibracion(){
    this.vibration.vibrate(5000);
    
  }

  volverSinCerrarSesion(){
    this.router.navigate(['/auth']);

  }
  volverYCerrarSesion(){
    this.auth.logout();
    this.router.navigate(['/auth']);

  }

  cambiarEstadoAlarma(){
    if(this.encendido == true){
      this.checkPassword(); 
    }
    else{
      this.encendido = true;
      this.encender();
    }
  }

  encender(){

    // this.encendido = this.encendido ? false : true;
    
    this.subscription = DeviceMotion.watchAcceleration({ frequency: 300 }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      this.accelerationX = Math.floor(acceleration.x);
      this.accelerationY = Math.floor(acceleration.y);
      this.accelerationZ = Math.floor(acceleration.z);

      if (acceleration.x > 5) {
        //Inclinacion Izquierda

        this.posicionActualCelular = 'izquierda';
        this.movimientoIzquierda();
      }
      else if (acceleration.x < -5) {
        //Inclinacion Derecha

        this.posicionActualCelular = 'derecha';
        this.movimientoDerecha();
      }
      else if (acceleration.y >= 9) {
        //encender flash por 5 segundos y sonido
        this.posicionActualCelular = 'arriba';

        if ((this.posicionActualCelular != this.posicionAnteriorCelular)) {
          // this.audio.src = this.audioVertical;
          this.posicionAnteriorCelular = 'arriba';
        }
         this.audio.play();
        this.movimientoVertical();
      }

      else if (acceleration.z >= 9 && (acceleration.y >= -1 && acceleration.y <= 1) && (acceleration.x >= -1 && acceleration.x <= 1)) {
        //acostado vibrar por 5 segundos y sonido
        this.posicionActualCelular = 'plano';
        this.movimientoHorizontal();
      }
    
    }
    )
    
  }

  parar() {
    this.mostrarDialog = true;
    this.primerIngreso = true;
    this.subscription.unsubscribe();
  }


  movimientoIzquierda() {
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if (this.posicionActualCelular != this.posicionAnteriorCelular) {
      this.posicionAnteriorCelular = 'izquierda';
      this.audio.src = this.audioIzquierda;
    }
    this.audio.play();
  }

  movimientoDerecha() {
    this.primerIngreso = false;
    this.primerIngresoFlash = true;
    if (this.posicionActualCelular != this.posicionAnteriorCelular) {
      this.posicionAnteriorCelular = 'derecha';
      this.audio.src = this.audioDerecha;
    }
    this.audio.play();
  }

  movimientoVertical() {
    if (this.primerIngresoFlash) {
      this.primerIngresoFlash ? this.flashlight.switchOn() : null;
      setTimeout(() => {
        this.primerIngresoFlash = false;
        this.flashlight.switchOff();
      }, 5000);
      this.primerIngreso = false;
    }
  }

  movimientoHorizontal() {
    if (this.posicionActualCelular != this.posicionAnteriorCelular) {
      this.posicionAnteriorCelular = 'plano';
      this.audio.src = this.audioHorizontal;
    }
    this.primerIngreso ? null : this.audio.play();
    this.primerIngreso ? null : this.vibration.vibrate(5000);
    this.primerIngreso = true;
    this.primerIngresoFlash = true;
  }

  errorApagado() {
    if (this.primerIngresoFlash) {
      this.primerIngresoFlash ? this.flashlight.switchOn() : null;
      this.audio.src = this.audioError;
      this.audio.play();
      this.vibration.vibrate(5000);
      setTimeout(() => {
        this.primerIngresoFlash = false;
        this.flashlight.switchOff();
        this.vibration.vibrate(0);
      }, 5000);
    }
  }

  async checkPassword() {
    const { value: password } = await Swal.fire({
      title: 'Ingresa tu contraseña',
      input: 'password',
      inputLabel: 'Contraseña',
      inputPlaceholder: 'Ingresa tu contraseña',
      heightAuto: false
    });
    this.clave = password;
    if (this.clave == this.auth.actualPassword) {//Comparacion de usuario registrado con la clave ingresada recientemente
      console.log("ENTRE");
      this.estado = 'permitido';
      this.encendido = false;
      this.estado = "";
      this.clave = "";
      this.audio.pause();
      this.parar(); ///Paro la subscripcion al acceleration
    }
    else if (this.clave != '') {
      this.estado = 'denegado';
      this.errorApagado();
      setTimeout(() => {
        this.estado = "";
      }, 1000);

    }
    //Tambien hay que agregar la funcionalidad del login y demas.
  }

}
