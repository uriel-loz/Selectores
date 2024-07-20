import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private countriesService = inject(CountriesService);
  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];
  
  public myForm: FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required]
  });

  ngOnInit(): void {
    this.onRegionChange();
    this.onCountryChange();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange(): void{
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.borders = []),
        switchMap(region => this.countriesService.getCountriesByRegion(region)),
      )
      .subscribe( countries => {
        this.countriesByRegion = countries;
      });
  }

  onCountryChange(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap((alphaCode) => this.countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap(country => this.countriesService.getCountryByCodes(country.borders ?? []))
      )
      .subscribe( countries => {
        this.borders = countries;
      });
  }
}
