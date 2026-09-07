import { calculateTournamentPoints } from "./points";

console.log(
  "District Gold:",
  calculateTournamentPoints({
    tournamentType: "DISTRICT",
    medal: "GOLD",
  })
);

console.log(
  "State Silver:",
  calculateTournamentPoints({
    tournamentType: "STATE",
    medal: "SILVER",
  })
);

console.log(
  "District Bronze:",
  calculateTournamentPoints({
    tournamentType: "DISTRICT",
    medal: "BRONZE",
  })
);

console.log(
  "National Gold:",
  calculateTournamentPoints({
    tournamentType: "NATIONAL",
    medal: "GOLD",
  })
);

console.log(
  "International Bronze:",
  calculateTournamentPoints({
    tournamentType: "INTERNATIONAL",
    medal: "BRONZE",
  })
);

console.log(
  "Invalid:",
  calculateTournamentPoints({
    tournamentType: "UNKNOWN",
    medal: "GOLD",
  })
);