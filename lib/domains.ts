import {
  BookOpen,
  Brain,
  Lightbulb,
  Eye,
  Zap,
  FileText,
  Code,
} from 'lucide-react'

export const DOMAINS = [
  'ML Fundamentals',
  'Deep Learning',
  'NLP/LLMs',
  'Computer Vision',
  'MLOps/Deployment',
  'Research Papers',
  'Coding/Projects',
]

export const domainConfig = {
  'ML Fundamentals': {
    label: 'ML Fundamentals',
    icon: BookOpen,
    color: '#6366f1', // indigo
    description: 'Master the core concepts of machine learning',
  },
  'Deep Learning': {
    label: 'Deep Learning',
    icon: Brain,
    color: '#3b82f6', // blue
    description: 'Neural networks and deep learning architectures',
  },
  'NLP/LLMs': {
    label: 'NLP/LLMs',
    icon: Lightbulb,
    color: '#06b6d4', // cyan
    description: 'Natural Language Processing and Large Language Models',
  },
  'Computer Vision': {
    label: 'Computer Vision',
    icon: Eye,
    color: '#8b5cf6', // violet
    description: 'Image processing and visual recognition systems',
  },
  'MLOps/Deployment': {
    label: 'MLOps/Deployment',
    icon: Zap,
    color: '#10b981', // emerald
    description: 'Production ML systems and model deployment',
  },
  'Research Papers': {
    label: 'Research Papers',
    icon: FileText,
    color: '#f59e0b', // amber
    description: 'Reading and understanding academic research',
  },
  'Coding/Projects': {
    label: 'Coding/Projects',
    icon: Code,
    color: '#ec4899', // pink
    description: 'Hands-on coding and building projects',
  },
}

export const getDomainConfig = (domain: string) => {
  return domainConfig[domain as keyof typeof domainConfig]
}
