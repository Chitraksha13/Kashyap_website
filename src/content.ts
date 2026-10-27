// All the words on the site live here. Edit freely.
// Images are NOT listed here: drop files into the matching folder under src/assets/
// (about/, photos/, experience/<id>/, projects/<id>/) and they show up automatically.

export const profile = {
  name: 'Chitraksha Kashyap',
  email: 'chitraksh.kashyap@gmail.com',
  linkedin: 'https://www.linkedin.com/in/chitraksha-kashyap',
  resume: '/Ckashyap_Resume.pdf',
}

export const about = {
  school: 'Northeastern University',
  degree: 'B.S. Computer Engineering and Computer Science',
  graduation: 'May 2027',
  // One chapter per row on the story page. Photos come from src/assets/about/ in filename order (1.jpg, 2.jpg, ...).
  chapters: [
    'Chitraksha spent his adventurous life growing up in San Diego.',
    'In high school, he led his school’s food bank club, raising more than $50,000 for his city’s food bank. Then, he and his colleagues went on to start Hye, a clothing brand donating 20% of the profits to underserved dance communities.',
    'During his time at Northeastern University, he was inspired by his product development group, Generate, to dig deeper into software engineering and product management. Since then, he’s been working on all kinds of projects and collaborating with amazing people and organizations.',
    'Outside of work, he loves exploring the city with friends, going to the gym, and cooking new dishes.',
  ],
}

export type Experience = {
  id: string // also the folder name under src/assets/experience/
  org: string
  role: string
  dates: string
  location: string
  bullets: string[]
}

export const experiences: Experience[] = [
  {
    id: 'qualcomm',
    org: 'Qualcomm',
    role: 'Software Engineer Intern',
    dates: 'May 2026 – Aug 2026',
    location: 'San Diego, CA',
    bullets: [
      'Built a comparison analysis platform that supported 150+ engineers decompressing and comparing non-volatile (NV) radio data across 5 wireless standards, replacing a legacy Qualcomm analysis tool and reducing analysis time by 80%.',
      'Eliminated gaps in modem configuration analysis by developing a C++ XQCN generation pipeline that captured 100% of previously excluded static NV data, replacing multi-MB filesystem traversal with direct in-memory re-serialization.',
      'Reduced manual search time by 40% by integrating an LLM-powered natural-language chatbot (Flask) and MCP server.',
    ],
  },
  {
    id: 'matcha-flow',
    org: 'Matcha Flow',
    role: 'Technical Product Lead',
    dates: 'Jan 2026 – May 2026',
    location: 'Boston, MA',
    bullets: [
      'Defined 6 product requirements across 10 subsystems from client needs, partnering with 2 leads through weekly check-ins and milestone design reviews to manage product scope, budget, resources, and team guidance.',
      'Led cross-functional development of an automated matcha machine demoing to 400+ attendees, aligning 3 engineering disciplines to consolidate a 4-step manual brewing process into one-touch operation, shipping in 10 weeks.',
      'Scoped the MVP around the core brew experience, deprioritizing drink-size selection to reduce UI control hardware and overall build time, and streamlining the matcha and water dispensing flow to deliver a 45-second brew.',
    ],
  },
  {
    id: 'soundry-ai',
    org: 'Soundry AI',
    role: 'Product Designer Intern',
    dates: 'Jul 2025 – Aug 2025',
    location: 'Seattle, WA',
    bullets: [
      'Conducted 50+ user interviews and analyzed feedback from 100+ community members within Soundry, and evaluated competing platforms to identify key user pain points, engagement barriers, and platform safety concerns.',
      'Designed and iterated on 5+ user research plans, wireframes, and prototypes in Figma, incorporating usability feedback, and delivered a final prototype and roadmap to guide the platform’s engagement and moderation strategy.',
    ],
  },
  {
    id: 'insulet',
    org: 'Insulet Corporation',
    role: 'Software Engineer Intern',
    dates: 'Jan 2025 – Aug 2025',
    location: 'Acton, MA',
    bullets: [
      'Developed Python scripts for 75+ users to parse and analyze diabetes-sensor data logs for device activation and sensor status, reducing processing time from 2 hours to under 15 minutes.',
      'Led reliability testing across 25+ devices, validating sensor connectivity with development boards and smartphones, and confirming zero connectivity errors across all test runs using Tera Term logs.',
      'Redesigned complex finite state diagrams by merging redundant paths, cutting reading time from 5 to under 3 minutes.',
    ],
  },
]

export type Project = {
  id: string // also the folder name under src/assets/projects/
  title: string
  kicker: string
  dates: string
  tags: string[]
  bullets: string[]
  // Optional case-study sections. Fill any of these in and they appear on the page.
  links?: { label: string; url: string }[] // e.g. { label: 'GitHub', url: '...' }
  caseStudy?: { problem?: string; users?: string; decisions?: string; outcome?: string }
}

// To add a project: add an entry here and a folder src/assets/projects/<id>/ with its images.
// The gallery wall grows by itself.
export const projects: Project[] = [
  {
    id: 'sageware',
    title: 'Sageware',
    kicker: 'An automated fabric bead machine',
    dates: 'Dec 2025 – Feb 2026',
    tags: ['Zephyr RTOS', 'Embedded', 'User research'],
    bullets: [
      'Developed firmware on Zephyr RTOS for an automated fabric bead machine within a 12+ member cross-functional team, translating product requirements into reliable button, display, and motor control in 3 months.',
      'Conducted 30+ user interviews to translate customer needs into product requirements, delivering the prototype $200 under a $1.5K budget and presenting the final product to 100+ students and faculty at a university showcase.',
    ],
  },
  {
    id: 'nltk-resume-parser',
    title: 'NLTK Resume Parser',
    kicker: 'Resume screening, minus the busywork',
    dates: 'Jun 2025',
    tags: ['Python', 'NLTK', 'Plotly Dash'],
    bullets: [
      'Built an NLP-powered resume screening tool that parsed and analyzed 200+ PDF resumes, using token similarity and keyword matching to surface candidates aligned with job requirements, reducing manual resume review time by 50%.',
      'Built an interactive Plotly Dash dashboard to visualize candidate-job fit across 10+ job descriptions.',
    ],
  },
]

export const contact = {
  heading: 'Let’s build something people love.',
}
