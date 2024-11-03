import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/complete';
  private geocodeUrl = 'https://api.opencagedata.com/geocode/v1/json';
  private geocodeApiKey = '9851479039a7467bb7bf913c52699b06';
  private weatherApiKey = '9851479039a7467bb7bf913c52699b06';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<any> {
    const geocodeParams = new HttpParams().set('q', city).set('key', this.geocodeApiKey);

    return this.http.get(this.geocodeUrl, { params: geocodeParams }).pipe(
      switchMap((geocodeResponse: any) => {
        if (geocodeResponse.results && geocodeResponse.results.length > 0) {
          const lat = geocodeResponse.results[0].geometry.lat;
          const lon = geocodeResponse.results[0].geometry.lng;
          const weatherUrl = `${this.apiUrl}?lat=${lat}&lon=${lon}`;
          return this.http.get(weatherUrl);
        } else {
          return throwError(() => new Error('Location not found'));
        }
      }),
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        return throwError(() => error);
      })
    );
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    const weatherUrl = `${this.apiUrl}?lat=${lat}&lon=${lon}`;
    return this.http.get(weatherUrl).pipe(
      catchError((error) => {
        console.error('Error fetching weather data by coordinates:', error);
        return throwError(() => error);
      })
    );
  }
}