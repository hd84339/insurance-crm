import React from 'react';
import { useParams } from 'react-router-dom';

const ClientDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-4">Client Details</h2>
      <p className="text-gray-600">Client ID: {id}</p>
      <p className="text-sm text-gray-500 mt-4">Full implementation with tabs for policies, claims, and history</p>
    </div>
  );
};

export default ClientDetails;
