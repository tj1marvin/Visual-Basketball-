export interface BasketballNode {
  id: string;
  label: string;
  description: string;
  category: 'main' | 'history' | 'positions' | 'strategy' | 'training' | 'rules' | 'skills' | 'engagement';
  children?: BasketballNode[];
  content?: string;
  media?: string;
  videoUrl?: string;
}

export const basketballData: BasketballNode = {
  id: 'basketball',
  label: 'Basketball',
  description: 'The core of the sport.',
  category: 'main',
  children: [
    {
      id: 'history',
      label: 'History',
      description: 'Origins and evolution of the game.',
      category: 'history',
      children: [
        {
          id: 'origins',
          label: 'Origins & Evolution',
          description: 'Invented in 1891 by Dr. James Naismith.',
          category: 'history',
          content: 'Basketball was invented in December 1891 by the Canadian clergyman, educator, and physician James Naismith. Naismith introduced the game when he was an instructor at the International Young Men\'s Christian Association (YMCA) Training School (now Springfield College) in Springfield, Massachusetts. At the time, he was looking for a vigorous indoor game to keep his students occupied and at proper levels of fitness during the harsh New England winters.',
          media: 'https://picsum.photos/seed/history/800/450'
        },
        {
          id: 'styles',
          label: 'Major Styles',
          description: 'From set shots to the modern pace-and-space.',
          category: 'history',
          content: 'The game has evolved from a slow-paced, set-shot oriented game to the high-flying, three-point centric "pace and space" era we see today in the NBA.',
          media: 'https://picsum.photos/seed/styles/800/450'
        }
      ]
    },
    {
      id: 'positions',
      label: 'Positions',
      description: 'The five standard roles on a team.',
      category: 'positions',
      children: [
        {
          id: 'pg',
          label: 'Point Guard',
          description: 'The floor general.',
          category: 'positions',
          content: 'The Point Guard (PG) is typically the team\'s best ball handler and passer. They are responsible for directing the offense and getting the ball to the right players at the right time.',
          media: 'https://picsum.photos/seed/pg/800/450'
        },
        {
          id: 'sg',
          label: 'Shooting Guard',
          description: 'The perimeter threat.',
          category: 'positions',
          content: 'The Shooting Guard (SG) is often the team\'s best perimeter shooter and secondary ball handler.',
          media: 'https://picsum.photos/seed/sg/800/450'
        },
        {
          id: 'sf',
          label: 'Small Forward',
          description: 'The versatile wing.',
          category: 'positions',
          content: 'The Small Forward (SF) is often the most versatile player, capable of scoring from the perimeter and inside, while also being a strong defender.',
          media: 'https://picsum.photos/seed/sf/800/450'
        }
      ]
    },
    {
      id: 'strategy',
      label: 'Strategy',
      description: 'Offensive and defensive systems.',
      category: 'strategy',
      children: [
        {
          id: 'offensive',
          label: 'Offensive Strategy',
          description: 'Pick and rolls, motion offense, and isolation.',
          category: 'strategy',
          content: 'Modern offensive strategy focuses on spacing, ball movement, and creating high-percentage shots like layups and three-pointers.',
          media: 'https://picsum.photos/seed/offense/800/450',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      ]
    },
    {
      id: 'training',
      label: 'Training',
      description: 'Developing the athlete.',
      category: 'training',
      children: [
        {
          id: 'drills',
          label: 'Drills',
          description: 'Repetitive practice for skill mastery.',
          category: 'training',
          content: 'Drills are essential for building muscle memory in shooting, dribbling, and defensive footwork.',
          media: 'https://picsum.photos/seed/drills/800/450'
        },
        {
          id: 'conditioning',
          label: 'Conditioning',
          description: 'Physical fitness and stamina.',
          category: 'training',
          content: 'Basketball requires high levels of cardiovascular endurance, explosive power, and agility.',
          media: 'https://picsum.photos/seed/fitness/800/450'
        }
      ]
    },
    {
      id: 'rules',
      label: 'Rules',
      description: 'The laws of the game.',
      category: 'rules',
      children: [
        {
          id: 'structure',
          label: 'Game Structure',
          description: 'Quarters, halves, and shot clocks.',
          category: 'rules',
          content: 'Professional games are typically played in four 12-minute quarters (NBA) or two 20-minute halves (NCAA).',
          media: 'https://picsum.photos/seed/clock/800/450'
        },
        {
          id: 'fouls',
          label: 'Fouls & Violations',
          description: 'Traveling, double dribble, and personal fouls.',
          category: 'rules',
          content: 'Violations result in a turnover, while fouls can lead to free throws or a player being disqualified.',
          media: 'https://picsum.photos/seed/referee/800/450'
        }
      ]
    },
    {
      id: 'skills',
      label: 'Skills',
      description: 'Fundamental abilities.',
      category: 'skills',
      children: [
        {
          id: 'shooting',
          label: 'Shooting',
          description: 'The art of putting the ball in the hoop.',
          category: 'skills',
          content: 'B.E.E.F. technique: Balance, Eyes, Elbow, Follow-through. Shooting is the most important skill in basketball. It requires consistent form, focus, and thousands of repetitions to master.',
          media: 'https://picsum.photos/seed/shooting/800/450',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-basketball-player-making-a-slam-dunk-4048-large.mp4'
        },
        {
          id: 'dribbling',
          label: 'Dribbling',
          description: 'Moving with the ball.',
          category: 'skills',
          content: 'Ball handling involves control, speed, and the ability to change directions while keeping your eyes up. Key moves include crossovers, between-the-legs, and behind-the-back dribbles.',
          media: 'https://picsum.photos/seed/dribbling/800/450',
          videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-basketball-player-dribbling-the-ball-4046-large.mp4'
        },
        {
          id: 'passing',
          label: 'Passing',
          description: 'Moving the ball between teammates.',
          category: 'skills',
          content: 'Effective passing is the key to a great offense. Types of passes include chest passes, bounce passes, overhead passes, and wrap-around passes.',
          media: 'https://picsum.photos/seed/passing/800/450'
        }
      ]
    },
    {
      id: 'engagement',
      label: 'Fan Engagement',
      description: 'The culture and community.',
      category: 'engagement',
      children: [
        {
          id: 'media',
          label: 'Media & Broadcast',
          description: 'How the game is consumed.',
          category: 'engagement',
          content: 'From radio broadcasts to high-definition streaming and social media highlights, fan engagement has transformed how we experience basketball.',
          media: 'https://picsum.photos/seed/media/800/450'
        }
      ]
    }
  ]
};
