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
  }

  setSelectLocation(location: string) {
    this.selectedLocation = location;
    this.searchWeather();
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

  getWeatherIconClass(temperature: number): string {
    if (temperature < 0) {
      return 'wi wi-snow';
    } else if (temperature < 10) {
      return 'wi wi-day-sunny-overcast';
    } else {
      return 'wi wi-day-sunny';
    }
  }
}


