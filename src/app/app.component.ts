import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  usuario:any;
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(){

    this.auth.logout();

    this.auth.getUserLogged().subscribe(async user =>{
      console.log(user?.email);
     this.usuario = user;
     console.log(this.usuario);
      
    })

    console.log(this.auth.getUserLogged);
    this.router.navigateByUrl('splash');
    console.log(this.auth.getUserLogged);
    
  }

  cerrarSesion(){
    this.auth.logout();
    this.router.navigateByUrl('auth');
  }
}
