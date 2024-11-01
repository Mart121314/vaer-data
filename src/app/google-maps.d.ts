declare namespace google {
    export namespace maps {
      export namespace places {
        export class AutocompleteService {
          getPlacePredictions(
            request: AutocompleteRequest,
            callback: (predictions: AutocompletePrediction[], status: PlacesServiceStatus) => void
          ): void;
        }
        export interface AutocompletePrediction {
          description: string;
          place_id: string;
          structured_formatting: {
            main_text: string;
            secondary_text: string;
          };
        }
        export interface AutocompleteRequest {
          input: string;
          types?: string[];
        }
        export enum PlacesServiceStatus {
          OK = 'OK',
          ZERO_RESULTS = 'ZERO_RESULTS',
          // Add other status codes as needed
        }
      }
    }
  }