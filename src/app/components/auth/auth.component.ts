import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

import { initializeApp } from "firebase/app";

import {environment} from '../../../environments/environment'; 

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { ToastController } from '@ionic/angular';








import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})

export class AuthComponent  implements OnInit {

  user:string = '';
  pass: string = '';
  screen: any = 'signin';
  formData: FormGroup;
  isLoading: boolean = false;

  app: any;
  db:any;

  

  constructor(private authService:AuthService,private fb:FormBuilder, private auth:AuthService, private router:Router,
    private firestore:AngularFirestore, private toastController: ToastController) {

    this.app = initializeApp(environment.firebase);
    this.db = getFirestore(this.app);
    console.log(this.db);
    
    this.formData = this.fb.group({
      name: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
    });


    // this.enviarDatos();


   }

  ngOnInit() {}
  // async enviarDatos(){
  //   try {
  //     const docRef = await addDoc(collection(this.db, "users"), {
  //       first: "Ada",
  //       last: "Lovelace",
  //       born: 1815
  //     });
  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // }
  change(event: any){
    this.screen = event;
  }

  async login(){
    try {
      await this.authService.login(this.formData.value.email,this.formData.value.password);
      this.router.navigate(['/home']);
      const toast = await this.toastController.create({
        message:'Ingreso exitoso',
        duration:3000,
        position:'bottom'
      }) 
      await toast.present();
    } catch{
      console.log("Error");
    }
  }

  async register(){

  }

  presionado(event:any){
    console.log(event);
  }

  completarDatos(user:string,contraseña:string){
    this.formData.controls['email'].patchValue(user);
    this.formData.controls['password'].patchValue(contraseña);
    
  }

  

}
