/**
 * Mock utility for Google Calendar Sync.
 */
export const syncToGoogleCalendar = async (booking: any, user: any) => {
  console.log(`Syncing booking ${booking.id} to Google Calendar for ${user.email}`);
  // In production, this would use the Google Calendar API (v3) 
  // with an OAuth2 token for the user.
  return {
    success: true,
    eventId: `gc_${Math.random().toString(36).substr(2, 9)}`
  };
};

/**
 * Generates an .ics file content for phone calendar sync.
 */
export const generateICS = (booking: any, pg: any) => {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RentEase//PG Booking//EN
BEGIN:VEVENT
UID:${booking.id}@rentease.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(booking.checkIn).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(booking.checkOut).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:PG Move-in: ${pg.name}
DESCRIPTION:Move-in to your new PG at ${pg.location}. Rent: ₹${pg.monthlyRent}.
END:VEVENT
END:VCALENDAR`;
};
