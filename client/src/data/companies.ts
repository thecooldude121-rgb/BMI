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
    logo: '💻',
    domain: 'techcorp.com',
    website: 'https://techcorp.com',
    linkedinUrl: 'https://linkedin.com/company/techcorp-solutions',
    industry: 'Technology',
    location: 'San Francisco, CA',
    employeeCount: '501-1000',
    revenue: '$50M',
    founded: 2010,
    description: 'Leading provider of enterprise software solutions with AI integration',
    technologies: ['AI', 'Enterprise Software', 'Cloud Computing', 'Machine Learning'],
    keywords: ['Enterprise', 'Software', 'AI Integration', 'Technology'],
    funding: 'Series C',
    saved: false
  },
  {
    id: 'comp-2',
    name: 'GreenEnergy Dynamics',
    logo: '🌱',
    domain: 'greenenergydynamics.com',
    website: 'https://greenenergydynamics.com',
    linkedinUrl: 'https://linkedin.com/company/greenenergy-dynamics',
    industry: 'Energy',
    location: 'Austin, TX',
    employeeCount: '101-200',
    revenue: '$18M',
    founded: 2015,
    description: 'Renewable energy solutions and smart grid technology',
    technologies: ['Solar Energy', 'Smart Grid', 'Renewable Tech', 'Energy Storage'],
    keywords: ['Renewable Energy', 'Smart Grid', 'Sustainability', 'Clean Tech'],
    funding: 'Series B',
    saved: true
  }

];