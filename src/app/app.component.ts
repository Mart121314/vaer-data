import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService } from './weather.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf, isPlatformBrowser } from '@angular/common';
/// <reference types="@types/google.maps" />

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, NgIf, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '/node_modules/bootstrap/dist/css/bootstrap.min.css', '/node_modules/weather-icons/css/weather-icons.min.css'],
  providers: [DataService, WeatherService]
})
export class AppComponent implements OnInit {
  data: any;
  location: string = '';
  selectedLocation: string = '';
  suggestions: google.maps.places.AutocompletePrediction[] = [];
  bgImage = 'assets/sola.jpg';
  error: string | null = null;
  currentLocationWeather: any = null;
  staticLocations: any[] = [
    { name: 'Oslo', lat: 59.91, lon: 10.75, data: null },
    { name: 'Stockholm', lat: 59.33, lon: 18.06, data: null },
    { name: 'London', lat: 51.51, lon: -0.13, data: null },
    { name: 'New York', lat: 40.71, lon: -74.01, data: null }
  ];

  private autocompleteService!: google.maps.places.AutocompleteService;

  constructor(
    private dataService: DataService,
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Only initialize Google Maps AutocompleteService in the browser
    if (isPlatformBrowser(this.platformId)) {
      const initAutocompleteService = () => {
        if (typeof google !== 'undefined' && google.maps && google.maps.places) {
          this.autocompleteService = new google.maps.places.AutocompleteService();
        } else {
          setTimeout(initAutocompleteService, 100); // Retry every 100 ms if not yet loaded
        }
      };
      initAutocompleteService();
    }

    // Fetch initial data if necessary
    this.dataService.fetchData().subscribe((response: any) => {
      this.data = response;
    });

    // Fetch weather data for static locations
    this.fetchStaticLocationsWeather();

    // Fetch weather data for the user's current location
    this.fetchCurrentLocationWeather();
  }

  fetchStaticLocationsWeather() {
    this.staticLocations.forEach(location => {
      this.weatherService.getWeatherByCoordinates(location.lat, location.lon).subscribe((data: any) => {
        location.data = data;
      });
    });
  }

  fetchCurrentLocationWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.weatherService.getWeatherByCoordinates(lat, lon).subscribe((data: any) => {
          this.currentLocationWeather = data;
        });
      }, error => {
        console.error('Error getting location:', error);
        this.error = 'Unable to retrieve your location';
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
      this.error = 'Geolocation is not supported by this browser';
    }
  }

  setSelectLocation(location: string) {
    this.selectedLocation = location;
    this.searchWeather();
  }

  searchWeather() {
    if (this.location.trim()) {
      this.weatherService.getWeather(this.location).subscribe({
        next: (response) => {
          this.data = response;
          this.error = null;
        },
        error: (err) => {
          console.error('Error:', err);
          this.error = err.message || 'An error occurred';
          this.data = null;
        }
      });
    }
  }

  onLocationInput() {
    if (!this.autocompleteService) {
      console.error("AutocompleteService is not initialized.");
      return;
    }

    if (this.location.trim()) {
      this.autocompleteService.getPlacePredictions(
        { input: this.location, types: ['(cities)'] },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            this.suggestions = predictions;
            console.log(predictions);
          } else {
            this.suggestions = [];
          }
        }
      );
    } else {
      this.suggestions = [];
    }
  }

  selectLocation(description: string) {
    this.location = description;
    this.selectedLocation = description; // Update selectedLocation for display
    this.suggestions = [];
    this.searchWeather();
  }

  getWeatherIconClass(temperature: number, condition: string): string {
    if (!condition) {
      return 'wi wi-na'; // Return a default icon if condition is undefined
    }

    if (condition.includes('clear')) {
      return 'wi wi-day-sunny';
    } else if (condition.includes('cloud')) {
      return 'wi wi-cloudy';
    } else if (condition.includes('rain')) {
      return 'wi wi-rain';
    } else if (condition.includes('snow')) {
      return 'wi wi-snow';
    } else if (condition.includes('storm')) {
      return 'wi wi-thunderstorm';
    } else {
      return 'wi wi-day-sunny'; // Default icon
    }
  }
}