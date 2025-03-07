import { inject, Injectable } from '@angular/core';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';
import { combineLatest, map, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';
  private http: HttpClient = inject(HttpClient);

  private _regions: Region[] = [
    Region.Africa, 
    Region.Americas, 
    Region.Asia, 
    Region.Europe, 
    Region.Oceania
  ];

  constructor() { }

  get regions(): Region[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]> {
    if(!region) return of([]);

    const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url)
      .pipe(
        map(countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        }))),
      )
  }

  getCountryByAlphaCode(alphaCode: string): Observable<SmallCountry> {
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;

    return this.http.get<Country>(url)
      .pipe(
        map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        }))
      )
  }

  getCountryByCodes(borders: string[]): Observable<SmallCountry[]>{
    if(!borders || borders.length === 0) return of([]);

    const countryRequests: Observable<SmallCountry>[] = [];

    borders.forEach(alphaCode => {
      const request = this.getCountryByAlphaCode(alphaCode);
      countryRequests.push(request);
    });

    return combineLatest(countryRequests);
  }
}
