import { GooglePlace } from '@/types/api';

class MapService {
  private map: google.maps.Map | null = null;
  private placesService: google.maps.places.PlacesService | null = null;
  private directionsService: google.maps.DirectionsService | null = null;

  async initializeMap(container: HTMLElement, options: google.maps.MapOptions): Promise<google.maps.Map> {
    // Google Maps APIの遅延読み込み
    if (!window.google) {
      await this.loadGoogleMapsAPI();
    }

    this.map = new google.maps.Map(container, {
      zoom: 13,
      center: { lat: 35.6762, lng: 139.6503 }, // 東京駅
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      ...options,
    });

    this.placesService = new google.maps.places.PlacesService(this.map);
    this.directionsService = new google.maps.DirectionsService();

    return this.map;
  }

  private async loadGoogleMapsAPI(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&language=ja`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Google Maps API の読み込みに失敗しました'));
      document.head.appendChild(script);
    });
  }

  async searchPlaces(query: string, location?: google.maps.LatLng): Promise<GooglePlace[]> {
    if (!this.placesService) {
      throw new Error('Places service is not initialized');
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.TextSearchRequest = {
        query,
        location,
        radius: 5000, // 5km
      };

      this.placesService!.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places: GooglePlace[] = results.map(place => ({
            place_id: place.place_id!,
            name: place.name!,
            formatted_address: place.formatted_address!,
            geometry: {
              location: {
                lat: place.geometry!.location!.lat(),
                lng: place.geometry!.location!.lng(),
              },
            },
            types: place.types!,
            rating: place.rating,
            photos: place.photos,
          }));
          resolve(places);
        } else {
          reject(new Error(`場所の検索に失敗しました: ${status}`));
        }
      });
    });
  }

  async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    if (!this.placesService) {
      throw new Error('Places service is not initialized');
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'photos',
          'formatted_phone_number',
          'opening_hours',
          'website',
          'types',
        ],
      };

      this.placesService!.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject(new Error(`場所の詳細取得に失敗しました: ${status}`));
        }
      });
    });
  }

  getMap(): google.maps.Map | null {
    return this.map;
  }
}

export const mapService = new MapService();