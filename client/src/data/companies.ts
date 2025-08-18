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
    name: 'Acme Corporation',
    logo: '🏢',
    domain: 'acme.com',
    website: 'https://acme.com',
    linkedinUrl: 'https://linkedin.com/company/acme-corp',
    industry: 'Enterprise Software',
    location: 'San Francisco, CA',
    employeeCount: '1,001-5,000',
    revenue: '$50M-$100M',
    founded: 2010,
    description: 'Leading provider of enterprise software solutions',
    technologies: ['Salesforce', 'AWS', 'React', 'Node.js'],
    keywords: ['Enterprise', 'SaaS', 'Cloud Computing', 'B2B', 'Software'],
    funding: 'Series C - $25M',
    saved: false
  },
  {
    id: 'comp-2',
    name: 'Global Tech Solutions',
    logo: '💻',
    domain: 'globaltech.io',
    website: 'https://globaltech.io',
    linkedinUrl: 'https://linkedin.com/company/global-tech-solutions',
    industry: 'Artificial Intelligence',
    location: 'New York, NY',
    employeeCount: '501-1,000',
    revenue: '$25M-$50M',
    founded: 2015,
    description: 'Innovative cloud computing and AI solutions',
    technologies: ['Google Cloud', 'Python', 'TensorFlow'],
    keywords: ['AI', 'Machine Learning', 'Cloud', 'Analytics', 'Innovation'],
    funding: 'Series B - $15M',
    saved: true
  },
  {
    id: 'comp-3',
    name: 'DataFlow Systems',
    logo: '📊',
    domain: 'dataflow.com',
    website: 'https://dataflow.com',
    linkedinUrl: 'https://linkedin.com/company/dataflow-systems',
    industry: 'Data Analytics',
    location: 'Austin, TX',
    employeeCount: '201-500',
    revenue: '$10M-$25M',
    founded: 2018,
    description: 'Real-time data processing and analytics platform',
    technologies: ['Apache Kafka', 'Elasticsearch', 'Docker', 'Kubernetes'],
    keywords: ['Big Data', 'Real-time', 'Analytics', 'Platform', 'Data Science'],
    funding: 'Series A - $8M',
    saved: false
  },
  {
    id: 'comp-4',
    name: 'CloudSecure Inc',
    logo: '🔒',
    domain: 'cloudsecure.com',
    website: 'https://cloudsecure.com',
    linkedinUrl: 'https://linkedin.com/company/cloudsecure',
    industry: 'Cybersecurity',
    location: 'Seattle, WA',
    employeeCount: '101-200',
    revenue: '$5M-$10M',
    founded: 2019,
    description: 'Next-generation cloud security solutions',
    technologies: ['Azure', 'Terraform', 'Go', 'PostgreSQL'],
    keywords: ['Security', 'Cloud', 'Compliance', 'Infrastructure', 'Protection'],
    funding: 'Seed - $3M',
    saved: true
  },
  {
    id: 'comp-5',
    name: 'FinanceFlow Ltd',
    logo: '💰',
    domain: 'financeflow.co',
    website: 'https://financeflow.co',
    linkedinUrl: 'https://linkedin.com/company/financeflow',
    industry: 'FinTech',
    location: 'Boston, MA',
    employeeCount: '51-100',
    revenue: '$2M-$5M',
    founded: 2020,
    description: 'Revolutionary digital payment solutions for small businesses',
    technologies: ['Stripe', 'React', 'MongoDB', 'Express'],
    keywords: ['Payments', 'FinTech', 'Digital', 'Small Business', 'API'],
    funding: 'Pre-Seed - $1.5M',
    saved: true
  },
  {
    id: 'comp-6',
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
  }
];