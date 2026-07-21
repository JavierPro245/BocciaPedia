import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { MatchService } from '../services/match.service';

@Component({

selector:'app-match-create',

templateUrl:'./match-create.page.html',

styleUrls:['./match-create.page.scss'],

standalone:false

})

export class MatchCreatePage{

players=[

{id:'1',name:'Javier Bastias'},

{id:'2',name:'Carlos Pérez'},

{id:'3',name:'Felipe Soto'}

];

redPlayer = '';

bluePlayer = '';

category = 'BC3';

totalEnds = 4;

// Tiempo editable por el usuario (en minutos)
minutes = 6;

// Tiempo en segundos que se enviará al partido
secondsPerPlayer = 360;

constructor(

private service:MatchService,

private router:Router

){}

get playersAreValid(): boolean {

  return !!this.redPlayer &&
         !!this.bluePlayer &&
         this.redPlayer !== this.bluePlayer;

}

categoryChanged(): void {

  switch (this.category) {

    case 'BC1':
      this.minutes = 5;
      break;

    case 'BC2':
      this.minutes = 3.5;
      break;

    case 'BC3':
      this.minutes = 6;
      break;

    case 'BC4':
      this.minutes = 3.5;
      break;

  }

  this.secondsPerPlayer = Math.round(this.minutes * 60);

}

startMatch(){

this.secondsPerPlayer = Math.round(this.minutes * 60);

const red=this.players.find(x=>x.id===this.redPlayer);

const blue=this.players.find(x=>x.id===this.bluePlayer);

if(!red||!blue){

return;

}

this.service.createMatch({

id:Date.now().toString(),

redPlayerId:red.id,

redPlayer:red.name,

bluePlayerId:blue.id,

bluePlayer:blue.name,

category:this.category as any,

totalEnds:this.totalEnds,

currentEnd:1,

secondsPerPlayer:this.secondsPerPlayer,

redTime:this.secondsPerPlayer,

blueTime:this.secondsPerPlayer,

redScore:0,

blueScore:0,

currentEndRedScore:0,

currentEndBlueScore:0,

redBallsPlayed:0,

blueBallsPlayed:0,

startingColor:'red',

jackPlayed:false,

turn:null,

timerRunning:false,

isTieBreak:false,

tieBreakWinner:null,

ends: [],

penalty: null,

state:'waiting'

});

this.router.navigate([

'/matches/match-run'

]);

}

}