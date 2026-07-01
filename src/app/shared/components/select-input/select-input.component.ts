import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  standalone: false
})
export class SelectInputComponent {

  @Input() label='';

  @Input() placeholder='';

  @Input() options:string[]=[];

  @Input({required:true}) control!:FormControl;

}