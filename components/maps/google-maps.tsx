"use client";

import { useEffect, useRef } from "react";
import { HealthcareFacility } from "@/lib/data/healthcare-facilities";

interface GoogleMapsProps {
  facilities: HealthcareFacility[];
  center: { lat: number; lng: number };
  zoom?: number;
  selectedFacility?: HealthcareFacility | null;
  onFacilityClick?: (facility: HealthcareFacility) => void;
  apiKey: string;
  userLocation?: { lat: number; lng: number };
  searchNearby?: boolean;
  searchRadiusMeters?: number;
  searchTypes?: string[];
  onPlacesResults?: (results: HealthcareFacility[]) => void;
}

export function GoogleMaps({
  facilities,
  center,
  zoom = 13,
  selectedFacility,
  onFacilityClick,
  apiKey,
  userLocation,
  searchNearby = false,
  searchRadiusMeters = 5000,
  searchTypes = ["pharmacy", "doctor"],
  onPlacesResults,
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map>();
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey) {
      console.error("Google Maps API key is required");
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      // Script already loaded, initialize map if not already done
      if (mapRef.current && !mapInstance.current && window.google) {
        mapInstance.current = new google.maps.Map(mapRef.current, {
          center,
          zoom,
          gestureHandling: "greedy",
        });
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google Maps script loaded");
      // Initialize map after script loads
      if (mapRef.current && !mapInstance.current) {
        try {
          mapInstance.current = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            gestureHandling: "greedy",
          });
          console.log("Map initialized successfully");
        } catch (error) {
          console.error("Error initializing map:", error);
        }
      }
    };
    script.onerror = () => {
      console.error("Failed to load Google Maps script");
    };
    
    document.head.appendChild(script);

    return () => {
      // Don't remove script on cleanup to avoid reloading
    };
  }, [apiKey]);

  // Update map center and zoom when props change
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(center);
      mapInstance.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // Clear existing markers
  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  };

  // Add facility markers
  useEffect(() => {
    if (!mapInstance.current) return;
    clearMarkers();

    facilities.forEach((facility) => {
      const marker = new google.maps.Marker({
        position: facility.coordinates,
        map: mapInstance.current,
        title: facility.name,
        icon: selectedFacility?.id === facility.id
          ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          : undefined,
      });

      marker.addListener("click", () => {
        onFacilityClick && onFacilityClick(facility);
      });

      markersRef.current.push(marker);
    });
  }, [facilities, selectedFacility, onFacilityClick]);

  // Add user location marker
  useEffect(() => {
    if (!mapInstance.current || !userLocation) return;

    const userMarker = new google.maps.Marker({
      position: userLocation,
      map: mapInstance.current,
      title: "You are here",
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });

    markersRef.current.push(userMarker);
  }, [userLocation]);

  // Optional: search nearby facilities using Places API
  useEffect(() => {
    if (!searchNearby || !mapInstance.current || !userLocation) return;
    if (!window.google?.maps?.places) return;

    const service = new google.maps.places.PlacesService(mapInstance.current);
    
    // Search for each type separately and combine results
    const searchPromises = searchTypes.map((type) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: userLocation,
        radius: searchRadiusMeters,
        type: type as any,
      };

      return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      });
    });

    Promise.all(searchPromises).then((allResults) => {
      const combinedResults = allResults.flat();
      const nearbyFacilities: HealthcareFacility[] = combinedResults
        .filter((place) => place.place_id && place.name && place.geometry?.location)
        .map((place) => ({
          id: place.place_id!,
          name: place.name!,
          type: "clinic" as const, // Default type for places results
          address: place.vicinity || "Address not available",
          phone: place.formatted_phone_number || "Phone not available",
          rating: place.rating || 0,
          distance: "0 km", // Will be calculated by parent component
          isOpen: place.opening_hours?.open_now || false,
          openHours: place.opening_hours?.weekday_text?.join(", ") || "Hours not available",
          coordinates: {
            lat: place.geometry!.location!.lat(),
            lng: place.geometry!.location!.lng(),
          },
        }));

      onPlacesResults && onPlacesResults(nearbyFacilities);
    });
  }, [searchNearby, userLocation, searchRadiusMeters, searchTypes, onPlacesResults]);

  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <div 
        ref={mapRef} 
        style={{ width: "100%", height: "100%" }}
      />
      {!apiKey && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="text-gray-500 mb-2">Map not available</div>
            <div className="text-sm text-gray-400">Google Maps API key required</div>
          </div>
        </div>
      )}
    </div>
  );
}
