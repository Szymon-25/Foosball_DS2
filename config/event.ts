export const eventConfig = {
  eventDate: "FRIDAY, 26TH JUNE",
  eventTime: "21:00",
  eventLocation: "DS2",
  rules: [
    { text: "10 goals to win", icon: "Check" },
    { text: "No spinning", icon: "X" },
    { text: "Play fair", icon: "Check" }
  ],
  adminPassword: process.env.ADMIN_PASSWORD || "ds2foosball",
  registrationDeadline: "2026-06-26T20:45:00+02:00"
};
