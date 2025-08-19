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
  {
    id: 'comp-6',
    name: 'DataFlow Analytics',
    logo: '📊',
    domain: 'dataflow-analytics.com',
    website: 'https://dataflow-analytics.com',
    linkedinUrl: 'https://linkedin.com/company/dataflow-analytics',
    industry: 'Data Analytics',
    location: 'Seattle, WA',
    employeeCount: '101-200',
    revenue: '$10M-$25M',
    founded: 2019,
    description: 'Advanced data analytics and business intelligence',
    technologies: ['Apache Kafka', 'Elasticsearch', 'Python', 'TensorFlow'],
    keywords: ['Data Analytics', 'Business Intelligence', 'Big Data', 'ML'],
    funding: 'Series A - $12M',
    saved: true
  },
  {
    id: 'comp-7',
    name: 'EduTech Pro',
    logo: '📚',
    domain: 'edutech-pro.com',
    website: 'https://edutech-pro.com',
    linkedinUrl: 'https://linkedin.com/company/edutech-pro',
    industry: 'Education Technology',
    location: 'New York, NY',
    employeeCount: '51-100',
    revenue: '$5M-$10M',
    founded: 2020,
    description: 'Next-generation educational technology platform',
    technologies: ['React', 'Node.js', 'AWS', 'AI/ML'],
    keywords: ['Education', 'E-Learning', 'Technology', 'Students'],
    funding: 'Series A - $8M',
    saved: false
  },
  {
    id: 'comp-8',
    name: 'TransLogistics Corp',
    logo: '🚛',
    domain: 'translogistics.com',
    website: 'https://translogistics.com',
    linkedinUrl: 'https://linkedin.com/company/translogistics',
    industry: 'Transportation & Logistics',
    location: 'Atlanta, GA',
    employeeCount: '1,001-5,000',
    revenue: '$200M-$500M',
    founded: 1995,
    description: 'Global transportation and logistics solutions',
    technologies: ['GPS Tracking', 'Fleet Management', 'IoT', 'Mobile Apps'],
    keywords: ['Logistics', 'Transportation', 'Supply Chain', 'Fleet'],
    funding: 'Private Equity',
    saved: true
  },
  {
    id: 'comp-9',
    name: 'BioInnovate Labs',
    logo: '🧬',
    domain: 'bioinnovate-labs.com',
    website: 'https://bioinnovate-labs.com',
    linkedinUrl: 'https://linkedin.com/company/bioinnovate-labs',
    industry: 'Biotechnology',
    location: 'San Diego, CA',
    employeeCount: '201-500',
    revenue: '$15M-$25M',
    founded: 2017,
    description: 'Cutting-edge biotechnology research and development',
    technologies: ['Genomics', 'CRISPR', 'Bioinformatics', 'AI/ML'],
    keywords: ['Biotechnology', 'Research', 'Genomics', 'Innovation'],
    funding: 'Series B - $18M',
    saved: false
  },
  {
    id: 'comp-10',
    name: 'VGI Partners',
    logo: '💼',
    domain: 'vgipartners.com',
    website: 'https://vgipartners.com',
    linkedinUrl: 'https://linkedin.com/company/vgi-partners',
    industry: 'Investment Management',
    location: 'Sydney, NSW',
    employeeCount: '51-200',
    revenue: '$50M-$100M',
    founded: 2008,
    description: 'Australian investment manager focused on long-term wealth creation',
    technologies: ['Portfolio Management', 'Risk Analytics', 'Trading Systems'],
    keywords: ['Investment', 'Portfolio Management', 'Finance', 'Wealth Management'],
    funding: 'Private Company',
    saved: true
  }
];