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