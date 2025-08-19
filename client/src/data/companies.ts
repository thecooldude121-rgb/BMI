// Shared company data for Lead Generation module
// This will be synchronized with CRM Accounts as primary source
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

// Local fallback companies - CRM Accounts will take priority
export const localCompanies: CompanyData[] = [
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

// Function to convert CRM Account to CompanyData format
export const convertCrmAccountToCompanyData = (crmAccount: any): CompanyData => {
  return {
    id: crmAccount.id,
    name: crmAccount.name || 'Unknown Company',
    logo: crmAccount.name ? crmAccount.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : '🏢',
    domain: crmAccount.domain || `${crmAccount.name?.toLowerCase().replace(/\s+/g, '')}.com`,
    website: crmAccount.website || `https://${crmAccount.domain || 'company.com'}`,
    linkedinUrl: crmAccount.linkedinUrl || `https://linkedin.com/company/${crmAccount.name?.toLowerCase().replace(/\s+/g, '-')}`,
    industry: crmAccount.industry || 'Technology',
    location: crmAccount.location || 'Unknown',
    employeeCount: crmAccount.employeeCount || '1-50',
    revenue: crmAccount.revenue || 'N/A',
    founded: crmAccount.founded || 2020,
    description: crmAccount.description || `${crmAccount.name} is a growing company in the ${crmAccount.industry || 'Technology'} sector.`,
    technologies: crmAccount.technologies || ['Technology'],
    keywords: crmAccount.keywords || [crmAccount.industry || 'Technology', 'Business'],
    funding: crmAccount.funding || 'Unknown',
    saved: false
  };
};

// Primary companies function - prioritizes CRM Accounts over local data
export const getCompanies = (crmAccounts: any[] = []): CompanyData[] => {
  // Convert CRM Accounts to CompanyData format
  const crmCompanies = crmAccounts.map(convertCrmAccountToCompanyData);
  
  // If we have CRM data, use it as primary source
  if (crmCompanies.length > 0) {
    return crmCompanies;
  }
  
  // Fall back to local data if no CRM accounts available
  return localCompanies;
};

// Export the getCompanies function as the default companies export
// This maintains backward compatibility while enabling CRM sync
export const companies = localCompanies;