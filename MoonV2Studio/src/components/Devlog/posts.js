export const POSTS = [
  {
    id: 'overhaul',
    img: '/images/game_emberfall.png',
    date: 'MAY 20',
    year: '2025',
    title: 'SYSTEM OVERHAUL',
    excerpt: 'Refactored core systems for better performance and flexibility across all active projects.',
    tag: 'ENGINEERING',
    num: '01',
    dek: 'A full pass on the shared gameplay foundation: cleaner state flow, lighter update loops, and less duplicated project logic.',
    points: ['Core loop audit', 'Reusable gameplay services', 'Reduced frame spikes'],
    body: [
      {
        heading: 'Why it changed',
        text: 'The active projects were starting to repeat the same setup work: boot flow, save hooks, input routing, scene transitions, and debug toggles. This pass pulled those pieces into a cleaner foundation so each prototype can move faster without carrying one-off code.',
      },
      {
        heading: 'What improved',
        text: 'The heaviest per-frame checks were reduced, repeated state branches were consolidated, and project-specific logic now sits closer to the feature that owns it. The result is a calmer base that is easier to test and easier to extend.',
      },
      {
        heading: 'Next target',
        text: 'The next engineering pass focuses on editor tools and build-time validation so broken content is caught before it reaches a playable build.',
      },
    ],
  },
  {
    id: 'combat',
    img: '/images/game_aeondrive.png',
    date: 'MAY 10',
    year: '2025',
    title: 'NEW COMBAT TEST',
    excerpt: 'Testing new enemy AI behaviours, combat flow and hit-feel dynamics in the field.',
    tag: 'GAMEPLAY',
    num: '02',
    dek: 'A combat slice built around readable attacks, sharper impact feedback, and enemies that pressure the player without turning chaotic.',
    points: ['Enemy behaviour pass', 'Hit reaction timing', 'Arena pacing'],
    body: [
      {
        heading: 'Combat feel',
        text: 'This test focuses on the moment-to-moment response after every input: startup, contact, hit pause, recovery, and enemy reaction. Small timing changes made the combat feel heavier without slowing down the player.',
      },
      {
        heading: 'Enemy behaviour',
        text: 'The AI now rotates between approach, bait, commit, and retreat states. That gives fights a clearer rhythm and prevents every encounter from collapsing into constant forward pressure.',
      },
      {
        heading: 'What is next',
        text: 'The next build will add more combat telemetry so attack frequency, damage windows, and dodge timing can be tuned from actual playtest data.',
      },
    ],
  },
  {
    id: 'blockout',
    img: '/images/game_lunaris.png',
    date: 'MAY 03',
    year: '2025',
    title: 'ENV. BLOCKOUT',
    excerpt: 'Early layout passes for world building in Project Lunaris open environments.',
    tag: 'LEVEL DESIGN',
    num: '03',
    dek: 'The Lunaris environment moved from mood board to playable space, with route readability and puzzle staging as the main constraints.',
    points: ['Greybox routes', 'Puzzle sightlines', 'Landmark placement'],
    body: [
      {
        heading: 'Shape first',
        text: 'The blockout starts with silhouettes, slopes, and readable paths before visual detail. The goal is to make each route understandable from a distance so exploration feels intentional instead of random.',
      },
      {
        heading: 'Puzzle staging',
        text: 'Puzzle spaces are being arranged around clear entry views, one strong focal point, and short loops back to the main path. This keeps the environment open while still giving each challenge a clean frame.',
      },
      {
        heading: 'Art pass direction',
        text: 'The next pass adds lunar material contrast, low gravity traversal markers, and violet-lit alien devices without covering up the layout language established in the blockout.',
      },
    ],
  },
  {
    id: 'tooling',
    img: '/images/game_fracture.png',
    date: 'APR 28',
    year: '2025',
    title: 'TOOLING & PIPELINE',
    excerpt: 'Improving workflows with better tooling and fully automated build pipelines.',
    tag: 'DEVOPS',
    num: '04',
    dek: 'A production workflow pass focused on faster iteration, fewer manual steps, and cleaner handoff between assets, builds, and tests.',
    points: ['Build automation', 'Asset checks', 'Release packaging'],
    body: [
      {
        heading: 'Pipeline goal',
        text: 'The pipeline is being shaped around one rule: repeated work should be automated, and risky work should be checked before it ships. Build steps, asset naming, and packaging are now being treated as part of the game system.',
      },
      {
        heading: 'Tooling work',
        text: 'Current tooling focuses on validating imported assets, preparing build profiles, and reducing manual setup between prototypes. This makes switching between projects less fragile.',
      },
      {
        heading: 'What ships next',
        text: 'The next milestone is a repeatable release package with predictable output folders, version labels, and a short verification pass before every public build.',
      },
    ],
  },
];
