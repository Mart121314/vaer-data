import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/complete.json';
  private geocodeUrl = 'https://api.opencagedata.com/geocode/v1/json';
  private geocodeApiKey = '04073197b19b4513ad2994194f452f99'; 

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const geocodeParams = new HttpParams().set('q', city).set('key', this.geocodeApiKey);
    return this.http.get(this.geocodeUrl, { params: geocodeParams }).pipe(
      switchMap((geocodeResponse: any) => {
        const lat = geocodeResponse.results[0].geometry.lat;
        const lon = geocodeResponse.results[0].geometry.lng;
        const weatherParams = new HttpParams().set('lat', lat.toString()).set('lon', lon.toString());
        return this.http.get(this.apiUrl, { params: weatherParams });
      })
    );
  }
}