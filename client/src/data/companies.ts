// Shared company data for Lead Generation module
export interface CompanyData {
  id: string;
  name: string;
  logo: string;
  domain: string;
  website: string;
  linkedinUrl: string;
  industry: string;
  location: string;
  employeeCount: string;
  revenue: string;
  founded: number;
  description: string;
  technologies: string[];
  keywords: string[];
  funding: string;
  saved: boolean;
}

export const companies: CompanyData[] = [
  {
    id: 'comp-1',
    name: 'TechCorp Solutions',
    logo: '⚡',
    domain: 'techcorp.com',
    website: 'https://techcorp.com',
    linkedinUrl: 'https://linkedin.com/company/techcorp-solutions',
    industry: 'Software Development',
    location: 'Chicago, IL',
    employeeCount: '301-500',
    revenue: '$15M-$25M',
    founded: 2016,
    description: 'Custom software development and consulting',
    technologies: ['React', 'Python', 'AWS', 'Docker'],
    keywords: ['Software', 'Consulting', 'Custom Development', 'Agile'],
    funding: 'Bootstrap',
    saved: false
  },
  {
    id: 'comp-2',
    name: 'Global Manufacturing Inc',
    logo: '🏭',
    domain: 'globalmanufacturing.com',
    website: 'https://globalmanufacturing.com',
    linkedinUrl: 'https://linkedin.com/company/global-manufacturing',
    industry: 'Manufacturing',
    location: 'Detroit, MI',
    employeeCount: '1,001-5,000',
    revenue: '$100M-$500M',
    founded: 1985,
    description: 'Leading global manufacturing solutions provider',
    technologies: ['IoT', 'SAP', 'Oracle', 'Automation'],
    keywords: ['Manufacturing', 'Industrial', 'Automation', 'Supply Chain'],
    funding: 'Public Company',
    saved: true
  },
  {
    id: 'comp-3',
    name: 'StartupX',
    logo: '🚀',
    domain: 'startupx.io',
    website: 'https://startupx.io',
    linkedinUrl: 'https://linkedin.com/company/startupx',
    industry: 'Technology',
    location: 'San Francisco, CA',
    employeeCount: '11-50',
    revenue: '$1M-$5M',
    founded: 2021,
    description: 'Innovative startup disrupting the tech industry',
    technologies: ['React', 'Node.js', 'AWS', 'MongoDB'],
    keywords: ['Startup', 'Innovation', 'Technology', 'Disruptive'],
    funding: 'Seed - $2M',
    saved: false
  },
  {
    id: 'comp-4',
    name: 'HealthTech Innovations',
    logo: '🏥',
    domain: 'healthtech-innovations.com',
    website: 'https://healthtech-innovations.com',
    linkedinUrl: 'https://linkedin.com/company/healthtech-innovations',
    industry: 'Healthcare Technology',
    location: 'Boston, MA',
    employeeCount: '201-500',
    revenue: '$25M-$50M',
    founded: 2018,
    description: 'Revolutionary healthcare technology solutions',
    technologies: ['AI/ML', 'Python', 'FHIR', 'Cloud Computing'],
    keywords: ['Healthcare', 'Medical Technology', 'AI', 'Patient Care'],
    funding: 'Series B - $20M',
    saved: true
  },
  {
    id: 'comp-5',
    name: 'Green Energy Corp',
    logo: '🌱',
    domain: 'greenenergy.com',
    website: 'https://greenenergy.com',
    linkedinUrl: 'https://linkedin.com/company/green-energy-corp',
    industry: 'Renewable Energy',
    location: 'Austin, TX',
    employeeCount: '501-1,000',
    revenue: '$50M-$100M',
    founded: 2015,
    description: 'Sustainable energy solutions for the future',
    technologies: ['Solar', 'Wind', 'Battery Storage', 'Smart Grid'],
    keywords: ['Renewable Energy', 'Sustainability', 'Clean Tech', 'Environment'],
    funding: 'Series C - $45M',
    saved: false
  },

];