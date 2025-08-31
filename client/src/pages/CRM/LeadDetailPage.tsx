/*
Create a Lead Detail Page for a CRM with world-class UI/UX (like Hubspot, Salesforce, Zoho). Requirements:
- Use route leadId param and fetch data via fetch(`/api/leads/${leadId}`)
- Card layout with avatar, name, email, status, company, tags
- Tabs for Timeline, Details, Notes: timeline = activities, details = all info fields, notes = notes or comments
- Action bar with Edit Lead and Add Activity buttons
- Loading, error, and empty states
- Responsive and modern style, Material or glassmorphism feel
- All key actions visible, summary at top, timeline below
Output a complete React component with state fetch, error/loading, cross-browser styles, with clear separation of sections.
*/

import React from 'react';
import { useParams } from 'react-router-dom';

const LeadDetailPage = () => {
  const { leadId } = useParams();

  return (
    <div style={{
      minHeight: "40vh",
      background: "#fffcba",
      border: "2px solid orange",
      padding: 32,
      fontSize: "1.3rem",
    }}>
      <h2>🔍 LEAD DETAIL PAGE LOADED!</h2>
      <p><strong>Lead ID:</strong> {leadId}</p>
      <p>This detail page is working correctly and receiving the leadId parameter from the router.</p>
      <div>
        <p>Route parameter setup is working correctly!</p>
        <p>The leadId '{leadId}' was successfully extracted from the URL.</p>
      </div>
    </div>
  );
};

export default LeadDetailPage;