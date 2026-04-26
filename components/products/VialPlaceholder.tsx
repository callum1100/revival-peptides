'use client';

import React from 'react';

const VIAL_NAMES = [
  { name: 'BPC-157', mg: '10', category: 'REPAIR PEPTIDE' },
  { name: 'GLP-3R', mg: '10', category: 'GLP AGONIST' },
  { name: 'TB-500', mg: '5', category: 'REPAIR PEPTIDE' },
  { name: 'GLP-2T', mg: '10', category: 'GLP AGONIST' },
  { name: 'Sermorelin', mg: '5', category: 'GROWTH HORMONE' },
  { name: 'BPC-157', mg: '5', category: 'REPAIR PEPTIDE' },
  { name: 'Semax', mg: '10', category: 'NOOTROPIC' },
  { name: 'AOD-9604', mg: '5', category: 'METABOLIC' },
];

interface VialPlaceholderProps {
  seed?: number;
  className?: string;
  name?: string;
  mg?: string;
  bare?: boolean;
}

export default function VialPlaceholder({ seed = 0, className = '', name, mg, bare = false }: VialPlaceholderProps) {
  const vial = VIAL_NAMES[seed % VIAL_NAMES.length];
  const displayName = name || vial.name;
  const displayMg = mg || vial.mg;
  const id = `vial-${seed}`;

  const svg = (
    <svg
      viewBox="0 0 120 220"
      className={bare ? `w-full h-full ${className}` : 'w-[55%] max-w-[130px] drop-shadow-2xl'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
        <defs>
          <linearGradient id={`cap-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8c84a"/>
            <stop offset="40%" stopColor="#D4AF37"/>
            <stop offset="100%" stopColor="#9a7c1f"/>
          </linearGradient>
          <linearGradient id={`cap-side-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#888" stopOpacity="0.9"/>
            <stop offset="30%" stopColor="#cccccc" stopOpacity="1"/>
            <stop offset="70%" stopColor="#aaaaaa" stopOpacity="1"/>
            <stop offset="100%" stopColor="#666" stopOpacity="0.9"/>
          </linearGradient>
          <linearGradient id={`body-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b0b0b0" stopOpacity="0.6"/>
            <stop offset="20%" stopColor="#e8e8e8" stopOpacity="0.85"/>
            <stop offset="50%" stopColor="#f5f5f5" stopOpacity="0.95"/>
            <stop offset="80%" stopColor="#e0e0e0" stopOpacity="0.85"/>
            <stop offset="100%" stopColor="#a0a0a0" stopOpacity="0.6"/>
          </linearGradient>
          <linearGradient id={`label-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="100%" stopColor="#f0f0f0"/>
          </linearGradient>
          <linearGradient id={`shine-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0"/>
            <stop offset="35%" stopColor="white" stopOpacity="0.4"/>
            <stop offset="50%" stopColor="white" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </linearGradient>
          <filter id={`shadow-${id}`}>
            <feDropShadow dx="3" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.5"/>
          </filter>
        </defs>

        <g filter={`url(#shadow-${id})`}>
          <rect x="42" y="0" width="36" height="20" rx="4" fill={`url(#cap-${id})`}/>
          <rect x="40" y="18" width="40" height="10" rx="2" fill={`url(#cap-side-${id})`}/>
          <rect x="40" y="26" width="40" height="3" rx="1" fill="#D4AF37" opacity="0.7"/>
          <rect x="38" y="29" width="44" height="138" rx="8" fill={`url(#body-${id})`}/>
          <rect x="40" y="165" width="40" height="2" rx="1" fill="#c0c0c0" opacity="0.5"/>
          <rect x="38" y="167" width="44" height="8" rx="2" fill={`url(#cap-side-${id})`}/>
          <rect x="38" y="173" width="44" height="6" rx="3" fill={`url(#cap-${id})`} opacity="0.8"/>

          <rect x="42" y="34" width="36" height="128" rx="5" fill={`url(#label-${id})`}/>

          <rect x="43" y="35" width="34" height="22" rx="4" fill="#1a1a1a"/>
          <svg x="44" y="36" width="32" height="20" viewBox="0 0 32 20">
            <circle cx="9" cy="10" r="8" fill="#D4AF37" opacity="0.15"/>
            <circle cx="9" cy="10" r="6" fill="#D4AF37" opacity="0.3"/>
            <path d="M9 4 Q5 7 5 10 Q5 13 9 15 Q13 13 13 10 Q13 7 9 4Z" fill="#D4AF37" opacity="0.8"/>
            <text x="17" y="8" fontFamily="serif" fontWeight="900" fontSize="7" fill="#ffffff">REVIVAL</text>
            <text x="17" y="15" fontFamily="sans-serif" fontSize="4" fill="#D4AF37" letterSpacing="1">PEPTIDES</text>
          </svg>

          <text
            x="60"
            y="78"
            textAnchor="middle"
            fontFamily="serif"
            fontWeight="900"
            fontSize="18"
            fill="#111111"
            letterSpacing="-0.5"
          >
            {displayName}
          </text>

          <rect x="44" y="83" width="32" height="16" rx="2" fill="#D4AF37"/>
          <text x="56" y="94" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="14" fill="#000000">{displayMg}</text>
          <text x="68" y="93" textAnchor="start" fontFamily="sans-serif" fontWeight="700" fontSize="8" fill="#000000">MG</text>

          <text x="60" y="114" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="10" fill="#D4AF37" letterSpacing="0.5">99% PURITY</text>
          <line x1="44" y1="118" x2="76" y2="118" stroke="#e0e0e0" strokeWidth="0.5"/>

          <text x="44" y="128" fontFamily="sans-serif" fontSize="5" fill="#444444">RESEARCH USE ONLY</text>
          <text x="44" y="136" fontFamily="sans-serif" fontSize="4.5" fill="#444444">NOT FOR HUMAN / ANIMAL USE</text>

          <rect x="62" y="140" width="14" height="10" rx="1" fill="#b22234"/>
          <rect x="62" y="140" width="14" height="2" fill="#b22234"/>
          <rect x="62" y="142" width="14" height="2" fill="white"/>
          <rect x="62" y="144" width="14" height="2" fill="#b22234"/>
          <rect x="62" y="146" width="14" height="2" fill="white"/>
          <rect x="62" y="148" width="14" height="2" fill="#b22234"/>
          <rect x="62" y="140" width="6" height="5" fill="#3c3b6e"/>

          <rect x="38" y="29" width="44" height="138" rx="8" fill={`url(#shine-${id})`}/>
        </g>
      </svg>
  );

  if (bare) return svg;

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{ background: 'linear-gradient(160deg, #0f0f0f 0%, #0a0a0a 100%)' }}
    >
      {svg}
    </div>
  );
}
