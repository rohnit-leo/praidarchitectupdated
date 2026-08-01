import React from 'react';

export function VRViewer() {
  return (
    <div className="w-full h-full relative group bg-slate-900 rounded-3xl overflow-hidden">
      <iframe 
        width="100%" 
        height="100%" 
        src="https://my.matterport.com/show/?m=SxQL3iGyoDo&play=1&brand=0&title=0&tourcta=0" 
        frameBorder="0" 
        allowFullScreen 
        allow="xr-spatial-tracking"
        className="absolute inset-0 w-full h-full border-0"
        title="360 Virtual Tour"
      ></iframe>
    </div>
  );
}
