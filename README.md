# Schedule Booking - Driving School

A mobile-only PWA (Progressive Web App) for booking driving lessons.

## Overview

This is a demo driving school booking application designed exclusively for mobile devices. Desktop users will see a "Mobile App Only" message with instructions to access via mobile.

## Features

### Guest Features
- **Home** - Welcome page with driving school information
- **Schedule** - View weekly timetable and book available slots
- **About** - Learn about the driving school services
- **Contact** - Contact information and operating hours

### Admin Features
- **Dashboard** - View booking statistics
- **Bookings** - Manage booking requests (Approve/Reject)
- **Authentication** - Simple login system

## Tech Stack

- Pure HTML/CSS/JavaScript (No frameworks)
- LocalStorage for data persistence
- PWA-ready with meta tags

## Project Structure

```
schedule-booking/
├── index.html              # Device detector (mobile redirect / desktop block)
├── mobile.html             # Main mobile app
├── admin/
│   ├── index.html          # Admin redirect
│   └── mobile/
│       ├── index.html      # Admin login
│       ├── dashboard.html  # Admin dashboard
│       └── bookings.html   # Bookings management
├── css/
│   ├── main.css            # Design system & variables
│   ├── components.css      # Reusable components
│   └── mobile.css          # Mobile app styles
└── js/
    ├── data.js             # Constants & demo data
    ├── storage.js          # LocalStorage helpers
    ├── utils.js            # Utility functions
    └── mobile.js           # Mobile app logic
```

## Demo Credentials

- **Username:** admin
- **Password:** demo123

## Time Slots

| Time | Duration |
|------|----------|
| 8:00 AM - 10:00 AM | 2 hours |
| 10:00 AM - 12:00 PM | 2 hours |
| 12:00 PM - 2:00 PM | 2 hours |
| 2:00 PM - 4:00 PM | 2 hours |
| 4:00 PM - 6:00 PM | 2 hours |
| 6:00 PM - 8:00 PM | 2 hours |

## Color Scheme

- **Primary:** #2563EB (Blue)
- **Success:** #22C55E (Green - Available)
- **Danger:** #EF4444 (Red - Booked)
- **Warning:** #F59E0B (Orange - Pending)

## Usage

1. Open on a mobile device or use browser dev tools mobile view
2. Browse available time slots
3. Tap an available slot to book
4. Enter name and phone number
5. Admin can approve/reject bookings

## License

Demo project for educational purposes.
