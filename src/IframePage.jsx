import React from 'react';

export default function IframePage({ fileUrl }) {
  return (
    <div className="w-full h-[calc(100vh-130px)]"> 
      <iframe 
        src={fileUrl} 
        className="w-full h-full border-0"
        title="MaachiiKnow Content"
      />
    </div>
  );
}