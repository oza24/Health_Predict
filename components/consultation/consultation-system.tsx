"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { BookingModal } from "./booking-modal"
import { Star, Video, MessageCircle, Clock, Search, Calendar, Award } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  reviewCount: number
  experience: string
  education: string
  languages: string[]
  availability: "available" | "busy" | "offline"
  nextAvailable: string
  consultationFee: number
  avatar?: string
  verified: boolean
  about: string
}

const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    rating: 4.9,
    reviewCount: 127,
    experience: "8 years",
    education: "MD, Harvard Medical School",
    languages: ["English", "Spanish"],
    availability: "available",
    nextAvailable: "Available now",
    consultationFee: 75,
    verified: true,
    about: "Experienced family physician specializing in preventive care and chronic disease management.",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    rating: 4.8,
    reviewCount: 89,
    experience: "12 years",
    education: "MD, Johns Hopkins University",
    languages: ["English", "Mandarin"],
    availability: "busy",
    nextAvailable: "Available in 2 hours",
    consultationFee: 120,
    verified: true,
    about: "Board-certified cardiologist with expertise in heart disease prevention and treatment.",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatology",
    rating: 4.7,
    reviewCount: 156,
    experience: "6 years",
    education: "MD, Stanford University",
    languages: ["English", "Spanish", "Portuguese"],
    availability: "available",
    nextAvailable: "Available now",
    consultationFee: 90,
    verified: true,
    about: "Dermatologist specializing in skin conditions, acne treatment, and cosmetic dermatology.",
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialty: "Psychiatry",
    rating: 4.6,
    reviewCount: 73,
    experience: "10 years",
    education: "MD, Yale School of Medicine",
    languages: ["English"],
    availability: "offline",
    nextAvailable: "Available tomorrow 9:00 AM",
    consultationFee: 100,
    verified: true,
    about: "Licensed psychiatrist providing mental health support and therapy services.",
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    specialty: "Pediatrics",
    rating: 4.9,
    reviewCount: 201,
    experience: "15 years",
    education: "MD, University of California",
    languages: ["English", "Korean"],
    availability: "available",
    nextAvailable: "Available now",
    consultationFee: 80,
    verified: true,
    about: "Pediatrician dedicated to providing comprehensive healthcare for children and adolescents.",
  },
]

export function ConsultationSystem() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors)
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all")
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const specialties = Array.from(new Set(mockDoctors.map((doctor) => doctor.specialty)))

  const handleSearch = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    let filtered = mockDoctors

    if (searchQuery) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (specialtyFilter !== "all") {
      filtered = filtered.filter((doctor) => doctor.specialty === specialtyFilter)
    }

    if (availabilityFilter !== "all") {
      filtered = filtered.filter((doctor) => doctor.availability === availabilityFilter)
    }

    setDoctors(filtered)
    setIsLoading(false)
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700"
      case "busy":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700"
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
    }
  }

  const handleBookConsultation = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
    setIsBookingModalOpen(true)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Search and Filters */}
      <Card className="border-2 border-primary/20 bg-gradient-to-b from-card to-card/80 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
              <Video className="h-5 w-5 text-primary" />
            </div>
            Find a Doctor
          </CardTitle>
          <CardDescription>Search for healthcare professionals by name, specialty, or availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by doctor name or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Specialties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Availability</SelectItem>
                <SelectItem value="available">Available Now</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={isLoading} className="w-full lg:w-auto">
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {doctors.length} {doctors.length === 1 ? "doctor" : "doctors"} available
          </h2>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Finding doctors...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Doctor Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
                          <AvatarFallback className="text-lg">
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold">{doctor.name}</h3>
                            {doctor.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <Award className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-primary font-medium">{doctor.specialty}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{doctor.rating}</span>
                              <span>({doctor.reviewCount} reviews)</span>
                            </div>
                            <span>• {doctor.experience} experience</span>
                          </div>
                        </div>
                        <Badge className={getAvailabilityColor(doctor.availability)} variant="outline">
                          {doctor.availability === "available"
                            ? "Available"
                            : doctor.availability === "busy"
                              ? "Busy"
                              : "Offline"}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground">{doctor.about}</p>

                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Education</p>
                          <p className="text-muted-foreground">{doctor.education}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Languages</p>
                          <div className="flex flex-wrap gap-1">
                            {doctor.languages.map((language) => (
                              <Badge key={language} variant="outline" className="text-xs">
                                {language}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{doctor.nextAvailable}</span>
                        </div>
                        <span>• Consultation fee: ${doctor.consultationFee}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="lg:w-48 space-y-3">
                      <Button
                        onClick={() => handleBookConsultation(doctor)}
                        disabled={doctor.availability === "offline"}
                        className="w-full"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleBookConsultation(doctor)}
                        disabled={doctor.availability === "offline"}
                        className="w-full"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                      <Button variant="ghost" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Later
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && doctors.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No doctors found matching your criteria.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filter options.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        doctor={selectedDoctor}
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false)
          setSelectedDoctor(null)
        }}
      />
    </div>
  )
}
