"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Video, MessageCircle, CreditCard, Info } from "lucide-react"

interface Doctor {
  id: string
  name: string
  specialty: string
  consultationFee: number
  avatar?: string
}

interface BookingModalProps {
  doctor: Doctor | null
  isOpen: boolean
  onClose: () => void
}

export function BookingModal({ doctor, isOpen, onClose }: BookingModalProps) {
  const [consultationType, setConsultationType] = useState<"video" | "chat">("video")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [reason, setReason] = useState("")
  const [isBooking, setIsBooking] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)

  if (!doctor) return null

  const availableTimes = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
  ]

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsBooking(true)

    // Simulate booking process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setBookingComplete(true)
    setIsBooking(false)
  }

  const handleClose = () => {
    setBookingComplete(false)
    setSelectedDate("")
    setSelectedTime("")
    setReason("")
    setConsultationType("video")
    onClose()
  }

  if (bookingComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Video className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <p className="font-medium">Your consultation with {doctor.name} has been scheduled</p>
              <p className="text-sm text-muted-foreground">
                {selectedDate} at {selectedTime}
              </p>
              <p className="text-sm text-muted-foreground">
                You'll receive a confirmation email with the meeting link shortly.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Consultation</DialogTitle>
          <DialogDescription>Schedule your appointment with {doctor.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={doctor.avatar || "/placeholder.svg"} alt={doctor.name} />
              <AvatarFallback>
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{doctor.name}</h3>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${doctor.consultationFee}</p>
              <p className="text-sm text-muted-foreground">consultation fee</p>
            </div>
          </div>

          <form onSubmit={handleBooking} className="space-y-4">
            {/* Consultation Type */}
            <div className="space-y-2">
              <Label>Consultation Type</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={consultationType === "video" ? "default" : "outline"}
                  onClick={() => setConsultationType("video")}
                  className="justify-start"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
                <Button
                  type="button"
                  variant={consultationType === "chat" ? "default" : "outline"}
                  onClick={() => setConsultationType("chat")}
                  className="justify-start"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Only
                </Button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label>Preferred Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Reason for Visit */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Consultation</Label>
              <Textarea
                id="reason"
                placeholder="Please describe your symptoms or reason for the consultation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
              />
            </div>

            {/* Payment Info */}
            <Alert>
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                Payment of ${doctor.consultationFee} will be processed after the consultation is completed.
              </AlertDescription>
            </Alert>

            {/* Terms */}
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                By booking this consultation, you agree to our terms of service and privacy policy. Consultations can be
                cancelled up to 2 hours before the scheduled time.
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" disabled={isBooking} className="flex-1">
                {isBooking ? "Booking..." : `Book Consultation - $${doctor.consultationFee}`}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
