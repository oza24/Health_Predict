"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Clock, Star, Navigation, Map, Globe, Mail } from "lucide-react";
import { GoogleMaps } from "@/components/maps/google-maps";
import { HealthcareFacility, HEALTHCARE_FACILITIES } from "@/lib/data/healthcare-facilities";

export function ClinicsFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<HealthcareFacility | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km radius

  // Helper: Convert meters to km
  const toKm = (meters: number) => `${(meters / 1000).toFixed(1)} km`;

  // Helper: Get distance from user location
  const getDistanceFromUser = (facility: HealthcareFacility) => {
    if (!userCoordinates) return facility.distance; // Fallback to static distance
    const distance = haversineDistance(userCoordinates, facility.coordinates);
    return toKm(distance);
  };

  // Haversine distance calculation
  const haversineDistance = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371000;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const aVal = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c;
  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location detected:', position.coords.latitude, position.coords.longitude);
          setUserCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => {
          console.log('Location error:', error);
          setUserCoordinates({ lat: 40.8359, lng: 14.2488 }); // Default Naples
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setUserCoordinates({ lat: 40.8359, lng: 14.2488 }); // Default Naples
    }
  }, []);

  // Search facilities
  const handleSearch = (query: string) => {
    setIsLoading(true);
    const searchLower = query.toLowerCase();
    const filtered = HEALTHCARE_FACILITIES.filter(facility => {
      const matchesQuery =
        facility.name.toLowerCase().includes(searchLower) ||
        facility.address.toLowerCase().includes(searchLower) ||
        facility.specialties?.some(s => s.toLowerCase().includes(searchLower)) ||
        facility.services?.some(s => s.toLowerCase().includes(searchLower));

      const matchesType = filterType === "all" || facility.type === filterType;

      return matchesQuery && matchesType;
    });

    // Sort by distance if user coordinates available
    const sorted = userCoordinates
      ? filtered.sort((a, b) => haversineDistance(userCoordinates, a.coordinates) - haversineDistance(userCoordinates, b.coordinates))
      : filtered;

    setFacilities(sorted);
    setIsLoading(false);
  };

  // Initial load and debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchQuery, filterType, userCoordinates]);

  // Initial load of facilities
  useEffect(() => {
    setFacilities(HEALTHCARE_FACILITIES);
  }, []);

  // Search for nearby facilities when user coordinates are available
  useEffect(() => {
    if (userCoordinates) {
      // Search for real nearby facilities using Google Places API
      searchNearbyFacilities(userCoordinates);
    }
  }, [userCoordinates]);

  // Get badge color
  const getTypeColor = (type: string) => ({
    clinic: "bg-blue-100 text-blue-800 border-blue-200",
    pharmacy: "bg-green-100 text-green-800 border-green-200",
    hospital: "bg-red-100 text-red-800 border-red-200",
    medical_shop: "bg-orange-100 text-orange-800 border-orange-200",
  }[type] ?? "bg-gray-100 text-gray-800 border-gray-200");

  // Directions link
  const getDirections = (address: string) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, "_blank");
  };

  // Search for nearby healthcare facilities using Google Places API
  const searchNearbyFacilities = async (location: { lat: number; lng: number }) => {
    if (!window.google?.maps?.places) {
      console.error('Google Places API not loaded');
      return;
    }

    setIsSearchingNearby(true);
    
    try {
      // Create a temporary div for PlacesService
      const tempDiv = document.createElement('div');
      const service = new google.maps.places.PlacesService(tempDiv);
      
      const searchTypes = ['hospital', 'pharmacy', 'doctor', 'dentist', 'veterinary_care'];
      const searchPromises = searchTypes.map((type) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: new google.maps.LatLng(location.lat, location.lng),
          radius: searchRadius,
          type: type as any,
        };

        return new Promise<google.maps.places.PlaceResult[]>((resolve) => {
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
              resolve(results);
            } else {
              console.log(`Search failed for ${type}:`, status);
              resolve([]);
            }
          });
        });
      });

      const allResults = await Promise.all(searchPromises);
      const combinedResults = allResults.flat();
      
      // Convert Google Places results to our HealthcareFacility format
      const nearbyFacilities: HealthcareFacility[] = combinedResults
        .filter((place) => place.place_id && place.name && place.geometry?.location)
        .map((place, index) => {
          const distance = haversineDistance(
            location, 
            { lat: place.geometry!.location!.lat(), lng: place.geometry!.location!.lng() }
          );
          
          return {
            id: place.place_id!,
            name: place.name!,
            type: getPlaceType(place.types || []),
            address: place.vicinity || place.formatted_address || "Address not available",
            phone: place.formatted_phone_number || "Phone not available",
            rating: place.rating || 0,
            distance: toKm(distance),
            isOpen: place.opening_hours?.open_now || false,
            openHours: place.opening_hours?.weekday_text?.join(", ") || "Hours not available",
            coordinates: {
              lat: place.geometry!.location!.lat(),
              lng: place.geometry!.location!.lng(),
            },
            website: place.website,
            description: `Found via Google Places API - ${place.types?.join(", ") || "healthcare facility"}`,
          };
        })
        .sort((a, b) => haversineDistance(location, a.coordinates) - haversineDistance(location, b.coordinates));

      setFacilities(nearbyFacilities);
      console.log(`Found ${nearbyFacilities.length} nearby healthcare facilities`);
      
    } catch (error) {
      console.error('Error searching nearby facilities:', error);
      // Fallback to static data if API fails
      setFacilities(HEALTHCARE_FACILITIES);
    } finally {
      setIsSearchingNearby(false);
    }
  };

  // Helper function to determine facility type from Google Places types
  const getPlaceType = (types: string[]): "clinic" | "pharmacy" | "hospital" | "medical_shop" => {
    if (types.includes('hospital')) return 'hospital';
    if (types.includes('pharmacy')) return 'pharmacy';
    if (types.includes('doctor') || types.includes('dentist') || types.includes('veterinary_care')) return 'clinic';
    return 'medical_shop';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5" />Find Healthcare Facilities</CardTitle>
          <CardDescription>Search for clinics, pharmacies, hospitals near you</CardDescription>
          
          {/* Location Status */}
          <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isSearchingNearby ? 
                  `🔍 Searching for nearby healthcare facilities...` :
                  userCoordinates ? 
                    `📍 Location detected! Found ${facilities.length} nearby facilities.` : 
                    `📍 Using default location (Naples). Enable location access for real nearby facilities.`
                }
              </span>
            </div>
            {userCoordinates && (
              <div className="text-xs text-blue-600">
                Coordinates: {userCoordinates.lat.toFixed(4)}, {userCoordinates.lng.toFixed(4)}
              </div>
            )}
            <div className="text-xs text-blue-600 mt-1">
              Found {facilities.length} healthcare facilities
            </div>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        console.log('Retry - Location detected:', position.coords.latitude, position.coords.longitude);
                        setUserCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
                      },
                      (error) => {
                        console.log('Retry - Location error:', error);
                        setUserCoordinates({ lat: 40.8359, lng: 14.2488 });
                      },
                      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                    );
                  }
                }}
                className="text-xs"
                disabled={isSearchingNearby}
              >
                🔄 Retry Location
              </Button>
              
              {userCoordinates && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => searchNearbyFacilities(userCoordinates)}
                  className="text-xs"
                  disabled={isSearchingNearby}
                >
                  {isSearchingNearby ? '🔍 Searching...' : '🔍 Search Nearby'}
                </Button>
              )}
              
              <Select value={searchRadius.toString()} onValueChange={(value) => setSearchRadius(parseInt(value))}>
                <SelectTrigger className="w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1000">1 km</SelectItem>
                  <SelectItem value="2000">2 km</SelectItem>
                  <SelectItem value="5000">5 km</SelectItem>
                  <SelectItem value="10000">10 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search for hospitals, clinics, pharmacies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="clinic">Clinics</SelectItem>
                <SelectItem value="pharmacy">Pharmacies</SelectItem>
                <SelectItem value="hospital">Hospitals</SelectItem>
                <SelectItem value="medical_shop">Medical Shops</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      {showMap && userCoordinates && (
        <Card>
          <CardContent className="p-0">
            <GoogleMaps
              facilities={facilities}
              center={userCoordinates}
              zoom={12}
              selectedFacility={selectedFacility}
              onFacilityClick={setSelectedFacility}
              userLocation={userCoordinates}
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
              searchNearby={false}
              searchRadiusMeters={searchRadius}
              searchTypes={['hospital', 'pharmacy', 'doctor', 'dentist']}
              onPlacesResults={(results) => {
                if (results.length > 0) {
                  setFacilities(results);
                }
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {facilities.length ? facilities.map(facility => (
          <Card
            key={facility.id}
            className={`cursor-pointer border-l-4 ${facility.isOpen ? "border-l-green-500" : "border-l-red-500"} ${selectedFacility?.id === facility.id ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setSelectedFacility(facility)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{facility.name}</CardTitle>
                <Badge className={getTypeColor(facility.type)}>{facility.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-500" />{facility.address}</div>
              {facility.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-500" />{facility.phone}</div>}
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gray-500" />{facility.openHours}</div>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-blue-600">{getDistanceFromUser(facility)} away</span>
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" className="flex-1" onClick={() => getDirections(facility.address)}><Navigation className="h-4 w-4 mr-1" />Directions</Button>
                {facility.phone && <Button size="sm" className="flex-1" onClick={() => window.location.href=`tel:${facility.phone}`}><Phone className="h-4 w-4 mr-1"/>Call</Button>}
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No facilities found for "{searchQuery}"
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
