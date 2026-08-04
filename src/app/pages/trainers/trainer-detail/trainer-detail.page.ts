import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-trainer-detail',
  templateUrl: './trainer-detail.page.html',
  styleUrls: ['./trainer-detail.page.scss'],
  standalone: false
})
export class TrainerDetailPage {

  trainer: User | null = null;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  async ionViewWillEnter() {

    await this.loadTrainer();

  }

  async loadTrainer() {

    this.loading = true;

    const uid = this.route.snapshot.paramMap.get('uid');

    if (!uid) {

      this.loading = false;
      return;

    }

    this.trainer = await this.userService.getTrainer(uid);

    this.loading = false;

  }

  editTrainer() {

    if (!this.trainer) return;

    this.router.navigate([
      '/trainers/trainer-edit',
      this.trainer.uid
    ]);

  }

}
