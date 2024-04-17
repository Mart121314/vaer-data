import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { WeatherService} from './weather.service'; 
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, NgIf, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', '/node_modules/bootstrap/dist/css/bootstrap.min.css', "/node_modules/weather-icons/css/weather-icons.min.css"],
  providers: [DataService, WeatherService]
})
export class AppComponent implements OnInit {
  data: any;
  location: string = '';
  bgImage = 'assets/sola.jpg'

  constructor(
    private dataService: DataService,
    private weatherService: WeatherService
  ) { }

  searchWeather(){
    this.weatherService.getWeather(this.location).subscribe((response: any) => {
      this.data = response;
    });
    console.log(this.data);
  }
  ngOnInit() {
    this.dataService.fetchData().subscribe((response: any) => {
      this.data = response;
    });
    console.log(this.data);
  }
  getWeatherIconClass(temperature: number): string  {
    if (temperature < 0) {
      return 'wi wi-snow';
    } else if (temperature < 10) {
      return 'wi wi-day-sunny-overcast';
    } else {
      return 'wi wi-day-sunny';
    }
  }

}

