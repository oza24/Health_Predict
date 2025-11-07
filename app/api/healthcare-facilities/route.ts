import { NextRequest, NextResponse } from 'next/server';
import { HealthcareFacilityManager, HEALTHCARE_FACILITIES } from '@/lib/data/healthcare-facilities';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const type = searchParams.get('type');
    const query = searchParams.get('query');
    const radius = searchParams.get('radius');

    let facilities = HEALTHCARE_FACILITIES;

    // Filter by location if coordinates provided
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusMiles = radius ? parseFloat(radius) : 10;
      
      if (!isNaN(latitude) && !isNaN(longitude)) {
        facilities = HealthcareFacilityManager.getFacilitiesNearLocation(
          latitude, 
          longitude, 
          radiusMiles
        );
      }
    }

    // Filter by type
    if (type && type !== 'all') {
      facilities = facilities.filter(facility => facility.type === type);
    }

    // Search by query
    if (query) {
      facilities = facilities.filter(facility =>
        facility.name.toLowerCase().includes(query.toLowerCase()) ||
        facility.address.toLowerCase().includes(query.toLowerCase()) ||
        facility.specialties?.some(specialty => specialty.toLowerCase().includes(query.toLowerCase())) ||
        facility.services?.some(service => service.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Sort by distance if location provided
    if (lat && lng) {
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      if (!isNaN(latitude) && !isNaN(longitude)) {
        facilities.sort((a, b) => {
          const distanceA = HealthcareFacilityManager.calculateDistance(
            latitude, longitude, a.coordinates.lat, a.coordinates.lng
          );
          const distanceB = HealthcareFacilityManager.calculateDistance(
            latitude, longitude, b.coordinates.lat, b.coordinates.lng
          );
          return distanceA - distanceB;
        });
      }
    }

    return NextResponse.json({
      success: true,
      facilities: facilities.slice(0, 50), // Limit to 50 results
      total: facilities.length,
      location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : null
    });

  } catch (error) {
    console.error('Healthcare facilities API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch healthcare facilities',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'search':
        const results = HealthcareFacilityManager.searchFacilities(data.query || '');
        return NextResponse.json({
          success: true,
          facilities: results
        });

      case 'nearby':
        const { lat, lng, radius = 10, type } = data;
        const nearby = HealthcareFacilityManager.getFacilitiesNearLocation(lat, lng, radius);
        const filtered = type && type !== 'all' 
          ? nearby.filter(f => f.type === type)
          : nearby;
        
        return NextResponse.json({
          success: true,
          facilities: filtered
        });

      case 'by_specialty':
        const specialtyResults = HealthcareFacilityManager.getFacilitiesBySpecialty(data.specialty);
        return NextResponse.json({
          success: true,
          facilities: specialtyResults
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: search, nearby, by_specialty' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Healthcare facilities POST error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
