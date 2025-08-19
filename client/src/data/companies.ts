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
  }

];