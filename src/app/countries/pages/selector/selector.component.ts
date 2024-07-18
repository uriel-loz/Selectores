import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent {
  private formBuilder = inject(FormBuilder);
  public myForm: FormGroup = this.formBuilder.group({
    region: ['', Validators.required]
  });
}
