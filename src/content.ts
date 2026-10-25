// All the words on the site live here. Edit freely.
// Images are NOT listed here: drop files into the matching folder under src/assets/
// (about/, photos/, experience/<id>/, projects/<id>/) and they show up automatically.

export const profile = {
  name: 'Chitraksha Kashyap',
  tagline: 'Building things people love.',
  subtitle: 'Aspiring Product Manager',
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
    'Chitraksha was born in San Diego and spent most of his childhood building Legos, usually ignoring the instructions to build whatever he had in his head.',
    'In high school, he was involved in his food bank club, where they gave back to the community and raised $50k+. He also started his own business, Hye, where he served as CEO, designing hoodies and donating 20% of the profits to underserved dance communities.',
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
}

export const experiences: Experience[] = [
  {
    id: 'qualcomm',
    org: 'Qualcomm',
    role: 'Software Engineer Intern',
    dates: 'May 2026 – Aug 2026',
    location: 'San Diego, CA',
  },
  {
    id: 'matcha-flow',
    org: 'Matcha Flow',
    role: 'Technical Product Lead',
    dates: 'Jan 2026 – May 2026',
    location: 'Boston, MA',
  },
  {
    id: 'soundry-ai',
    org: 'Soundry AI',
    role: 'Product Designer Intern',
    dates: 'Jul 2025 – Aug 2025',
    location: 'Seattle, WA',
  },
  {
    id: 'insulet',
    org: 'Insulet Corporation',
    role: 'Software Engineer Intern',
    dates: 'Jan 2025 – Aug 2025',
    location: 'Acton, MA',
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
  note: 'Open to APM roles and internships. The fastest way to reach me is email.',
}
