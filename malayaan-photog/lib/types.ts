export type ProgressStage =
  | "booking_confirmed"
  | "shoot_completed"
  | "photo_selection"
  | "editing"
  | "color_grading"
  | "album_design"
  | "client_review"
  | "final_delivery";

export const STAGE_ORDER: ProgressStage[] = [
  "booking_confirmed",
  "shoot_completed",
  "photo_selection",
  "editing",
  "color_grading",
  "album_design",
  "client_review",
  "final_delivery",
];

export const STAGE_LABEL: Record<ProgressStage, string> = {
  booking_confirmed: "Booking Confirmed",
  shoot_completed: "Shoot Completed",
  photo_selection: "Photo Selection",
  editing: "Editing In Progress",
  color_grading: "Color Grading",
  album_design: "Album Designing",
  client_review: "Client Review",
  final_delivery: "Final Delivery",
};

export type DeliverableStatus = "pending" | "in_progress" | "completed";

export type Booking = {
  id: string;
  booking_id: string;
  tracking_number: string;
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  event_type: string;
  shoot_date: string;
  booking_date: string;
  expected_delivery_date: string;
  current_stage: ProgressStage;
  edited_photos: number;
  total_photos: number;
  album_progress: number;
  video_progress: number;
  deliverables: {
    raw_photos: DeliverableStatus;
    edited_photos: DeliverableStatus;
    album_design: DeliverableStatus;
    wedding_trailer: DeliverableStatus;
    cinematic_film: DeliverableStatus;
  };
  updates: { date: string; note: string }[];
  admin_notes?: string | null;
  download_url?: string | null;
};

export function computeProgress(stage: ProgressStage): number {
  const idx = STAGE_ORDER.indexOf(stage);
  return Math.round(((idx + 1) / STAGE_ORDER.length) * 100);
}

export type PublicProjectStage = {
  stageName: string;
  status: "Pending" | "In Progress" | "Completed";
  completedDate?: string | null;
  remarks?: string;
};

export type PublicBooking = {
  trackingNumber: string;
  approvalStatus: "Pending" | "Approved" | "Rejected" | string;
  personalDetails: { fullName: string };
  eventDetails: {
    shootType: string;
    eventDate: string;
    eventTime?: string;
    venueName?: string;
    venueAddress?: string;
  };
  currentStage?: string;
  estimatedDeliveryDate?: string | null;
  projectTimeline?: PublicProjectStage[];
  createdAt?: string;
};

// Demo fallback bookings — used when Supabase isn't configured.
export const DEMO_BOOKINGS: Booking[] = [
  {
    id: "demo-1",
    booking_id: "MLY-2026-001",
    tracking_number: "TRK-A7K9D2",
    client_name: "Sangeetha & Karthik",
    client_email: "sangeetha@example.com",
    client_phone: "+91 98765 43210",
    event_type: "Wedding & Reception",
    shoot_date: "2026-05-12",
    booking_date: "2026-02-04",
    expected_delivery_date: "2026-07-20",
    current_stage: "color_grading",
    edited_photos: 482,
    total_photos: 1240,
    album_progress: 35,
    video_progress: 60,
    deliverables: {
      raw_photos: "completed",
      edited_photos: "in_progress",
      album_design: "in_progress",
      wedding_trailer: "completed",
      cinematic_film: "in_progress",
    },
    updates: [
      { date: "2026-06-12", note: "Color grading 60% complete on cinematic film" },
      { date: "2026-06-08", note: "Album layout v1 drafted — moving to refinement" },
      { date: "2026-06-01", note: "Editing started on reception highlights" },
      { date: "2026-05-13", note: "All RAW files backed up and catalogued" },
      { date: "2026-05-12", note: "Shoot completed — 14hrs coverage, 1240 frames" },
    ],
    admin_notes: "Client prefers warm tones. Album cover: leather sand finish.",
  },
];
