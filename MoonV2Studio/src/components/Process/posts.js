export const POSTS = [
  {
    id: 'prototyping',
    img: '/images/process_prototype.png',
    date: 'PHASE',
    year: '01',
    title: 'PROTOTYPING',
    excerpt: 'Where every idea starts. Raw, fast, and deliberately ugly — finding the fun before finding the form.',
    tag: 'CONCEPT & DESIGN',
    num: '01',
    dek: 'We prototype before we polish. The goal of every prototype is to answer one question: is this fun? If yes, we build on it. If no, we kill it without regret.',
    points: ['Rapid iteration', 'Kill-or-keep decisions', 'Paper design first'],
    body: [
      { type: 'heading', content: 'Start ugly on purpose' },
      { type: 'paragraph', content: 'Every Moon V2 Studio project starts with a single rule: it must be playable within 48 hours. Not good. Not pretty. Just playable. The earliest version of any game we\'ve shipped was a single grey cube that could jump. That cube eventually became Emberfall.' },
      { type: 'paragraph', content: 'This philosophy forces us to find the core mechanic — the thing that makes the game worth playing — before we commit any real time to art, sound, or story. If the core loop isn\'t fun with a grey cube and placeholder audio, it won\'t be fun with a cinematic trailer and 3 years of work behind it.' },
      { type: 'image', url: '/images/process_prototype.png', caption: 'Early greybox session for Project Lunaris. The entire open world was blocked out in one weekend.' },
      { type: 'quote', content: 'A prototype is a question. The playtest is the answer. Everything in between is just noise.', author: 'Creative Director' },
      { type: 'heading', content: 'Paper before pixels' },
      { type: 'paragraph', content: 'Before a single line of code is written, every major feature or game mechanic goes through a Paper Design phase. We draw the system on a whiteboard: the inputs, the outputs, the edge cases. This alone has saved us from spending weeks coding systems that are fundamentally broken at the design level.' },
      { type: 'list', items: [
        'Define the Win Condition first — what does the player want?',
        'Define the Failure Condition — what stops them from having it?',
        'Define the Loop — what do they do over and over to try again?',
        'Estimate complexity — can this be prototyped in a day or a week?',
      ]},
      { type: 'heading', content: 'Kill-or-keep decisions' },
      { type: 'paragraph', content: 'This is the hardest part of prototyping for any studio: knowing when to kill an idea. We run structured playtests after every 48-hour sprint. If the playtesters aren\'t engaged within the first 5 minutes, the prototype gets shelved. We keep a "Graveyard" folder of shelved prototypes. There are currently 23 ideas in it. Two of them became our best games.' },
    ],
  },
  {
    id: 'engineering',
    img: '/images/process_engineering.png',
    date: 'PHASE',
    year: '02',
    title: 'ENGINEERING',
    excerpt: 'How we architect systems that scale. From a single script to a multi-project shared engine.',
    tag: 'SYSTEMS & CODE',
    num: '02',
    dek: 'When the prototype is greenlit, we build the real architecture. Systems that are modular, testable, and built to be thrown away and rebuilt when something better comes along.',
    points: ['Service Locator pattern', 'Event-driven architecture', 'Shared engine core'],
    body: [
      { type: 'heading', content: 'Architecture principles' },
      { type: 'paragraph', content: 'We write code as if someone else will maintain it — because usually, six months from now, that someone else is us. Every system in the Moon V2 engine follows three rules: it must be modular (swappable without breaking other systems), testable (can be exercised in isolation), and documented (every public method has a comment explaining the "why", not just the "what").' },
      { type: 'code', language: 'C#', content: `// BAD: Tight coupling
public class Player : MonoBehaviour {
    void TakeDamage(float dmg) {
        AudioManager.Instance.PlayHitSound(); // Hard reference
        HUDManager.Instance.FlashRed();       // Hard reference
        hp -= dmg;
    }
}

// GOOD: Event-driven decoupling
public class Player : MonoBehaviour {
    void TakeDamage(float dmg) {
        hp -= dmg;
        EventBus.Emit(new DamageEvent { target = this, amount = dmg });
    }
}` },
      { type: 'quote', content: 'The best code is the code you delete. We threw away 40,000 lines last quarter and the game got faster.', author: 'Lead Engineer' },
      { type: 'heading', content: 'The shared engine core' },
      { type: 'paragraph', content: 'All our active projects share a single base engine layer. This layer handles: input routing, save/load hooks, scene transitions, object pooling, and the Event Bus. When we fix a performance issue in this layer, every game we are building benefits simultaneously. When we add a new feature, every project inherits it overnight.' },
      { type: 'list', items: [
        'Shared input system with remappable bindings across all titles',
        'Centralized Object Pool — no runtime instantiation in gameplay code',
        'Fixed-timestep physics update loop, decoupled from render framerate',
        'Strongly-typed Event Bus replacing all string-based messaging',
      ]},
      { type: 'image', url: '/images/process_engineering.png', caption: 'Internal node graph showing how systems communicate via the Event Bus without direct references.' },
      { type: 'heading', content: 'Performance targets' },
      { type: 'paragraph', content: 'Every system we write has a documented performance budget. Gameplay systems must complete their update in under 0.5ms. AI must complete in under 1.2ms. Rendering is handled separately by the GPU. If any system exceeds its budget in a profiler session, it goes on the refactor list for the next sprint.' },
      { type: 'code', language: 'C++', content: `// AI budget enforcer — fails loudly in dev builds
void AISystem::Update(float dt) {
    PROFILE_BEGIN("AISystem");
    for (auto& agent : m_agents) {
        agent.Tick(dt);
    }
    float elapsed = PROFILE_END("AISystem");
    ASSERT_MSG(elapsed < 1.2f, "AI budget exceeded: %.2fms", elapsed);
}` },
    ],
  },
  {
    id: 'aesthetics',
    img: '/images/process_aesthetics.png',
    date: 'PHASE',
    year: '03',
    title: 'AESTHETICS',
    excerpt: 'Our art direction philosophy. Why we chose 2D/3D anime and how we execute it technically.',
    tag: 'ART & ANIMATION',
    num: '03',
    dek: 'Art direction is a deliberate choice. We chose the 2D/3D anime aesthetic because it is timeless, scalable, and immediately recognizable — the opposite of chasing photorealism.',
    points: ['Cel-shaded rendering', 'Ink outline pass', 'Character-driven design'],
    body: [
      { type: 'heading', content: 'Why we chose anime' },
      { type: 'paragraph', content: 'When we started Moon V2 Studio, we made a deliberate decision to not chase photorealism. It\'s a race we can\'t win against studios with 300-person art teams. Instead, we leaned into a 2D/3D anime aesthetic — a style that is instantly identifiable, ages beautifully (Jet Set Radio still looks incredible today), and gives our small team a massive creative advantage through stylization.' },
      { type: 'quote', content: 'Photorealism is a technology race. Stylization is an identity race. We chose the one we can actually win.', author: 'Art Director' },
      { type: 'heading', content: 'The technical pipeline' },
      { type: 'paragraph', content: 'Achieving a convincing anime look in 3D requires intentional decisions at every stage of the pipeline, from the modelling phase to the final shader pass.' },
      { type: 'list', items: [
        'Models are built with lower poly counts to preserve hard, readable silhouettes',
        'All materials use a Toon shader with stepped (not smooth) lighting falloff',
        'A separate Outline Pass renders thick black ink lines around every object',
        'Animations are stepped at 12fps to mimic traditional hand-drawn animation',
        'Post-processing adds a subtle film grain and chromatic aberration',
      ]},
      { type: 'image', url: '/images/process_aesthetics.png', caption: 'Material breakdown: base color, toon shading step, and final outline pass composited together.' },
      { type: 'heading', content: 'Character design rules' },
      { type: 'paragraph', content: 'Every character in a Moon V2 game must be readable as a pure silhouette. If you can\'t immediately identify the character from a black shadow alone, we send the design back. This forces our character artists to create distinctive shapes — unusual hairstyles, asymmetric silhouettes, unique proportions — rather than relying on color or texture to differentiate characters.' },
    ],
  },
  {
    id: 'polish',
    img: '/images/process_polish.png',
    date: 'PHASE',
    year: '04',
    title: 'POLISH',
    excerpt: 'The final 20% that takes 80% of the time. How we turn a good game into an unforgettable one.',
    tag: 'GAME FEEL & JUICE',
    num: '04',
    dek: 'Polish is not cosmetic. Hit-stop, screen-shake, particle bursts, and audio layers are what separate a game that feels "okay" from one that feels absolutely incredible to play.',
    points: ['Hit-stop & screen-shake', 'Particle VFX layers', 'Spatial audio design'],
    body: [
      { type: 'heading', content: 'What is "game feel"?' },
      { type: 'paragraph', content: 'Game feel — sometimes called "juice" — is the collection of micro-moments that happen around every player input. When you swing a sword and it connects: the screen shakes, a particle burst fires, time freezes for 3 frames, the audio plays a heavy crunch, and the camera zooms in a fraction. None of those things individually make the game more fun. Together, they make every single sword swing feel epic.' },
      { type: 'quote', content: 'Our alpha testers said the combat felt "floaty". We added 6 layers of juice and kept the exact same numbers. The beta said it felt "incredible".', author: 'Lead Designer' },
      { type: 'heading', content: 'Our polish checklist' },
      { type: 'paragraph', content: 'Every interaction in our games goes through a formal polish checklist before it ships. If a checklist item is missing, the feature is not considered complete, regardless of whether the underlying logic works correctly.' },
      { type: 'list', items: [
        '✔ Does every button press have immediate visual feedback within 1 frame?',
        '✔ Does every significant action have a screen-shake of appropriate intensity?',
        '✔ Does every hit or impact have at least 2 frames of hit-stop?',
        '✔ Does every state change have a transition animation (even 50ms)?',
        '✔ Does every action have a unique audio cue that varies with repetition?',
        '✔ Does every mistake (death, fail) have a clear, readable moment of "oh no"?',
      ]},
      { type: 'image', url: '/images/process_polish.png', caption: 'VFX particle budget breakdown across a single combat hit event with all 6 layers active.' },
      { type: 'heading', content: 'Spatial audio design' },
      { type: 'paragraph', content: 'Audio is the most underrated tool in game polish. We layer every major sound effect with at least three samples: the physical impact layer, the resonance tail, and a subtle harmonic chord that reinforces the emotional tone of the moment. Our sword hits, for example, play a metallic clang, a low reverb rumble, and a very quiet musical chord — all within 80ms. Players don\'t hear it consciously, but they feel it deeply.' },
    ],
  },
];
