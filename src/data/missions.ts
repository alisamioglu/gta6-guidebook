// placeholder missions for now, swap with the real ones after launch
export type Difficulty = 'easy' | 'medium' | 'hard';

export type Mission = {
  id: string;
  title: string;
  difficulty: Difficulty;
  reward: number;
  steps: string[];
  // 0-1 on the map image
  location: { x: number; y: number };
};

export const missions: Mission[] = [
  {
    id: 'welcome-to-leonida',
    title: 'Welcome to Leonida',
    difficulty: 'easy',
    reward: 500,
    steps: [
      'Follow the marker to the motel.',
      'Talk to the clerk and grab the room key.',
      'Go upstairs and rest in the bed.',
    ],
    location: { x: 0.4, y: 0.62 },
  },
  {
    id: 'easy-money',
    title: 'Easy Money',
    difficulty: 'easy',
    reward: 1500,
    steps: [
      'Drive to the gas station and park out back.',
      'Wait for the white van to show up.',
      'Follow it from a distance, if you get too close it speeds off.',
    ],
    location: { x: 0.45, y: 0.55 },
  },
  {
    id: 'beach-run',
    title: 'Beach Run',
    difficulty: 'easy',
    reward: 2000,
    steps: [
      'Pick up the package at the pier.',
      'Take the coast road to the beach.',
      'Lose the police by cutting through the parking lots.',
    ],
    location: { x: 0.28, y: 0.62 },
  },
  {
    id: 'night-shift',
    title: 'Night Shift',
    difficulty: 'medium',
    reward: 3500,
    steps: [
      'Wait until 22:00 in game.',
      'Sneak into the warehouse from the side door.',
      'Take down the two guards quietly.',
      'Grab the ledger from the office.',
    ],
    location: { x: 0.48, y: 0.78 },
  },
  {
    id: 'swamp-trouble',
    title: 'Swamp Trouble',
    difficulty: 'medium',
    reward: 4000,
    steps: [
      'Take an airboat from the dock.',
      'Stay in the middle of the channel to avoid gators.',
      'Use the shotgun on the boats chasing you.',
    ],
    location: { x: 0.72, y: 0.47 },
  },
  {
    id: 'car-meet',
    title: 'Car Meet',
    difficulty: 'easy',
    reward: 2500,
    steps: [
      'Bring any sports car to the meet.',
      'Start the first race.',
      'Take the inside line on the last two corners to win.',
    ],
    location: { x: 0.52, y: 0.66 },
  },
  {
    id: 'pawn-shop',
    title: 'Pawn Shop',
    difficulty: 'easy',
    reward: 1000,
    steps: [
      'Talk to the pawn shop owner.',
      'Chase the thief on foot.',
      'Cut through the alley on the left to catch him before the main road.',
    ],
    location: { x: 0.36, y: 0.7 },
  },
  {
    id: 'high-rise',
    title: 'High Rise',
    difficulty: 'medium',
    reward: 5000,
    steps: [
      'Take the service elevator to the top floor.',
      'Hack the panel by matching the colors.',
      'Take the stairs down before the alarm ends.',
    ],
    location: { x: 0.43, y: 0.68 },
  },
  {
    id: 'bad-deal',
    title: 'Bad Deal',
    difficulty: 'hard',
    reward: 6000,
    steps: [
      'Go to the meeting at the marina.',
      'When the shooting starts, take cover behind the boxes on the right.',
      'Take out the guys on the boat first.',
    ],
    location: { x: 0.31, y: 0.8 },
  },
  {
    id: 'getaway-driver',
    title: 'Getaway Driver',
    difficulty: 'hard',
    reward: 8000,
    steps: [
      'Wait outside the bank.',
      'When the crew gets in, take the highway on ramp right away.',
      'Switch cars in the underpass to lose the stars.',
    ],
    location: { x: 0.5, y: 0.6 },
  },
  {
    id: 'keys-escape',
    title: 'Keys Escape',
    difficulty: 'medium',
    reward: 4500,
    steps: [
      'Drive south over the long bridge.',
      'Watch out for the roadblock in the middle.',
      'Use the side lane next to the railing to get past it.',
    ],
    location: { x: 0.58, y: 0.74 },
  },
  {
    id: 'old-friends',
    title: 'Old Friends',
    difficulty: 'easy',
    reward: 800,
    steps: [
      'Meet your contact at the diner.',
      'Go along with the conversation.',
      'Drive him home without damaging the car.',
    ],
    location: { x: 0.46, y: 0.35 },
  },
  {
    id: 'fire-sale',
    title: 'Fire Sale',
    difficulty: 'medium',
    reward: 3000,
    steps: [
      'Pour gas around the four marked spots in the store.',
      'Step outside and throw the lighter.',
      'Leave before the fire trucks show up.',
    ],
    location: { x: 0.38, y: 0.58 },
  },
  {
    id: 'air-drop',
    title: 'Air Drop',
    difficulty: 'hard',
    reward: 7000,
    steps: [
      'Get the plane from the airstrip.',
      'Fly low over the swamp to stay off radar.',
      'Drop the crate when the green smoke is right below you.',
    ],
    location: { x: 0.6, y: 0.3 },
  },
  {
    id: 'club-night',
    title: 'Club Night',
    difficulty: 'medium',
    reward: 3500,
    steps: [
      'Change into the club outfit first.',
      'Get the VIP wristband from the bartender.',
      'Find the target in the upstairs lounge.',
    ],
    location: { x: 0.33, y: 0.66 },
  },
  {
    id: 'hot-wheels',
    title: 'Hot Wheels',
    difficulty: 'medium',
    reward: 5500,
    steps: [
      'Steal the three marked cars.',
      'Bring them to the garage one by one.',
      'The last car has a tracker, get it resprayed first.',
    ],
    location: { x: 0.7, y: 0.16 },
  },
  {
    id: 'storm-warning',
    title: 'Storm Warning',
    difficulty: 'medium',
    reward: 4000,
    steps: [
      'Get to the trailer park before the storm hits.',
      'Help the residents into the shelter.',
      'Grab the safe from the main trailer.',
    ],
    location: { x: 0.52, y: 0.21 },
  },
  {
    id: 'inside-man',
    title: 'Inside Man',
    difficulty: 'hard',
    reward: 9000,
    steps: [
      'Get the guard uniform from the laundry room.',
      'Walk slowly past the cameras.',
      'Plant the device in the server room.',
    ],
    location: { x: 0.41, y: 0.74 },
  },
  {
    id: 'double-cross',
    title: 'Double Cross',
    difficulty: 'hard',
    reward: 10000,
    steps: [
      'Go to the meeting with backup.',
      'When the deal goes bad, chase the car to the docks.',
      'Shoot the tires to stop it.',
    ],
    location: { x: 0.53, y: 0.82 },
  },
  {
    id: 'the-big-score',
    title: 'The Big Score',
    difficulty: 'hard',
    reward: 25000,
    steps: [
      'Pick your crew and the stealth plan.',
      'Cut the power to the building.',
      'Go in through the roof and grab the vault.',
      'Leave by boat from the canal.',
    ],
    location: { x: 0.47, y: 0.64 },
  },
];
