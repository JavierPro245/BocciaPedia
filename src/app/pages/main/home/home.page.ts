import { Component, OnInit } from '@angular/core';
import { AthleteService } from 'src/app/services/athlete.service';
import { AuthService } from 'src/app/services/auth.service';
import { Athlete } from 'src/app/models/athlete.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  athleteCount = 0;

  constructor(

  private athleteService: AthleteService,

  private authService: AuthService

) {}

  ngOnInit() {

  this.authService.listenAuthState(user => {

    if (!user) {

      this.athleteCount = 0;

      return;

    }

    this.athleteService.listenAthletesByTrainer(

      user.uid,

      (athletes: Athlete[]) => {

        this.athleteCount = athletes.length;

      }

    );

  });

}

}
