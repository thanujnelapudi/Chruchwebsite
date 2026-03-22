const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/pages/HomePageClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports
content = content.replace(
  "import React from 'react';",
  "import React, { useState, useEffect, Suspense } from 'react';"
);
content = content.replace(
  "import { motion, useScroll, useTransform } from 'framer-motion';",
  "import { LazyMotion, domAnimation, m, useScroll, useTransform } from 'framer-motion';"
);
content = content.replace(
  "import SmartLivePlayer from '../ui/SmartLivePlayer';",
  "const SmartLivePlayer = React.lazy(() => import('../ui/SmartLivePlayer'));"
);

// 2. Replace motion elements with m
content = content.replace(/<motion\./g, '<m.');
content = content.replace(/<\/motion\./g, '</m.');

// 3. Add state and useEffect for video
const targetExport = "export default function HomePageClient({ latestSermon, events, songs, dailyVerse }: Props) {";
const stateToAdd = `
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.src = "/videos/hero-clouds.mp4";
        videoRef.current.play()
          .then(() => setIsVideoPlaying(true))
          .catch((e) => console.warn("Video play failed", e));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
`;
content = content.replace(
  targetExport,
  targetExport + "\n" + stateToAdd
);

// 4. Wrap return with LazyMotion
content = content.replace(
  'return (\n    <div className="min-h-screen',
  'return (\n    <LazyMotion features={domAnimation}>\n    <div className="min-h-screen'
);

// 5. Add closing LazyMotion
const lastDivIndex = content.lastIndexOf('</div>\n  );\n}');
if (lastDivIndex !== -1) {
  content = content.substring(0, lastDivIndex) + '</div>\n    </LazyMotion>\n  );\n}';
}

// 6. Update video block
const videoBlock = `<video
          src="/videos/hero-clouds.mp4"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />`;
const newVideoBlock = `<div 
          className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: "url('" + HERO_IMAGE + "')" }} 
        />
        <video
          ref={videoRef}
          muted loop playsInline preload="none"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ opacity: isVideoPlaying ? 1 : 0 }}
        />`;
content = content.replace(videoBlock, newVideoBlock);

// 7. Add Suspense to SmartLivePlayer
content = content.replace(
  '<SmartLivePlayer',
  '<Suspense fallback={<div className="w-full aspect-video bg-black/50 rounded-xl animate-pulse flex items-center justify-center"><span className="text-white/50">Loading player...</span></div>}>\n              <SmartLivePlayer'
);
content = content.replace(
  'className="w-full max-w-2xl"\n            />',
  'className="w-full max-w-2xl"\n            />\n            </Suspense>'
);

// 8. Add loading="lazy" to images
content = content.replace(/<img /g, '<img loading="lazy" ');

fs.writeFileSync(filePath, content, 'utf8');
console.log('HomePageClient Refactored Successfully');
