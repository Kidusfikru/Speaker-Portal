export interface Speaker {
  _id: string;
  name: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  dateTime: string;
  zoomLink?: string;
  speakerIds: (string | Speaker)[];
  rsvpStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface RSVP {
  _id: string;
  speakerId: Speaker;
  eventId: string;
  status: "yes" | "no" | "maybe";
  createdAt: string;
  updatedAt: string;
}
