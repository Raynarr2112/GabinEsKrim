import React from 'react';

/**
 * High-quality vector illustration for ice cream flavors
 * Handles cone vs cup and single vs double scoop, plus toppings
 */
export default function FlavorIllustration({
  flavorId = 'choco-therapy',
  serving = 'cone',
  size = 'single',
  toppings = [],
  className = 'w-48 h-48',
}) {
  // Theme gradients & colors per flavor
  const flavorStyles = {
    'choco-therapy': {
      scoop1: '#4A2C21',
      scoop2: '#2F180F',
      swirl: '#1F0F09',
      highlight: '#7D4D3D',
      drops: '#3B1D12',
    },
    'berry-blast': {
      scoop1: '#F43F5E',
      scoop2: '#FB7185',
      swirl: '#BE123C',
      highlight: '#FDA4AF',
      drops: '#E11D48',
    },
    'vanilla-dream': {
      scoop1: '#FEF08A',
      scoop2: '#FDE047',
      swirl: '#F59E0B',
      highlight: '#FEF9C3',
      drops: '#EAB308',
    },
    'caramel-crunch': {
      scoop1: '#D97706',
      scoop2: '#B45309',
      swirl: '#78350F',
      highlight: '#FCD34D',
      drops: '#92400E',
    },
    'matcha-zen': {
      scoop1: '#15803D',
      scoop2: '#166534',
      swirl: '#14532D',
      highlight: '#86EFAC',
      drops: '#166534',
    },
  };

  const style = flavorStyles[flavorId] || flavorStyles['choco-therapy'];
  const isDouble = size === 'double';
  const isCup = serving === 'cup';

  const hasOreo = toppings.includes('oreo');
  const hasBoba = toppings.includes('boba');
  const hasChips = toppings.includes('choco-chips');
  const hasAlmond = toppings.includes('almond');

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 200 240"
        className="w-full h-full drop-shadow-xl animate-float transition-all duration-300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad-scoop1-${flavorId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.highlight} />
            <stop offset="60%" stopColor={style.scoop1} />
            <stop offset="100%" stopColor={style.scoop2} />
          </linearGradient>

          <linearGradient id={`grad-scoop2-${flavorId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={style.highlight} />
            <stop offset="50%" stopColor={style.scoop2} />
            <stop offset="100%" stopColor={style.swirl} />
          </linearGradient>

          <linearGradient id="cone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          <linearGradient id="cup-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE4EC" />
            <stop offset="50%" stopColor="#FFD1DC" />
            <stop offset="100%" stopColor="#FCA5B7" />
          </linearGradient>

          <pattern id="waffle-pattern" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#92400E" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="0" y1="0" x2="12" y2="0" stroke="#92400E" strokeWidth="1.5" strokeOpacity="0.4" />
          </pattern>
        </defs>

        {/* Ambient Glow */}
        <circle cx="100" cy="110" r="75" fill={style.scoop1} opacity="0.15" filter="blur(16px)" />

        {/* SPARKLES */}
        <g className="animate-pulse-glow">
          <path d="M 40 45 Q 43 45 44 41 Q 45 45 48 45 Q 45 46 44 50 Q 43 46 40 45 Z" fill="#FBBF24" />
          <path d="M 160 55 Q 163 55 164 51 Q 165 55 168 55 Q 165 56 164 60 Q 163 56 160 55 Z" fill="#FBBF24" />
          <path d="M 155 130 Q 158 130 159 127 Q 160 130 163 130 Q 160 131 159 134 Q 158 131 155 130 Z" fill="#FB7185" />
        </g>

        {/* SECOND SCOOP (IF DOUBLE) */}
        {isDouble && (
          <g transform="translate(0, -32)">
            <ellipse cx="100" cy="80" rx="42" ry="38" fill={`url(#grad-scoop2-${flavorId})`} />
            <path
              d="M 62 88 C 65 102 75 106 82 98 C 88 106 98 106 104 98 C 110 106 122 104 126 96 C 132 102 140 94 138 88"
              fill={style.scoop2}
              opacity="0.9"
            />
            {/* Top Shine */}
            <path d="M 76 60 Q 86 52 108 52 Q 95 62 76 60 Z" fill="#FFFFFF" opacity="0.45" />
          </g>
        )}

        {/* MAIN FIRST SCOOP */}
        <g>
          {/* Main body of scoop */}
          <ellipse cx="100" cy={isDouble ? "105" : "90"} rx="46" ry="42" fill={`url(#grad-scoop1-${flavorId})`} />
          
          {/* Flavor swirls & texture */}
          <path
            d={isDouble 
              ? "M 75 90 Q 95 80 125 95" 
              : "M 70 75 Q 100 65 130 80"}
            stroke={style.swirl}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Dripping Bottom Skirt of Gelato Scoop */}
          <path
            d={isDouble 
              ? "M 54 115 C 56 130 68 134 76 126 C 84 136 96 136 104 126 C 112 136 126 134 132 124 C 138 132 148 122 146 115 Z"
              : "M 54 100 C 56 118 68 122 76 114 C 84 124 96 124 104 114 C 112 124 126 122 132 112 C 138 120 148 110 146 100 Z"}
            fill={`url(#grad-scoop1-${flavorId})`}
          />

          {/* Drip droplet */}
          <path
            d={isDouble 
              ? "M 78 128 C 76 135 77 142 80 142 C 83 142 84 135 82 128 Z"
              : "M 78 114 C 76 122 77 130 80 130 C 83 130 84 122 82 114 Z"}
            fill={style.drops}
          />

          {/* Shine highlight */}
          <path
            d={isDouble 
              ? "M 74 88 Q 88 78 114 80 Q 98 90 74 88 Z"
              : "M 72 72 Q 86 60 114 62 Q 98 74 72 72 Z"}
            fill="#FFFFFF"
            opacity="0.5"
          />
        </g>

        {/* EXTRA TOPPINGS VISUALS */}
        {/* Boba pearls */}
        {hasBoba && (
          <g>
            <circle cx="82" cy={isDouble ? "80" : "75"} r="6" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
            <circle cx="80" cy={isDouble ? "78" : "73"} r="1.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="118" cy={isDouble ? "95" : "85"} r="6.5" fill="#1C1917" stroke="#44403C" strokeWidth="1" />
            <circle cx="116" cy={isDouble ? "93" : "83"} r="1.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="98" cy={isDouble ? "115" : "105"} r="5.5" fill="#1C1917" />
          </g>
        )}

        {/* Oreo crumble */}
        {hasOreo && (
          <g fill="#18181B">
            <rect x="70" y={isDouble ? "68" : "60"} width="6" height="5" rx="1.5" transform="rotate(15 70 68)" />
            <rect x="125" y={isDouble ? "78" : "70"} width="7" height="6" rx="2" transform="rotate(-25 125 78)" />
            <rect x="92" y={isDouble ? "88" : "76"} width="5" height="4" rx="1" transform="rotate(40 92 88)" />
            <rect x="62" y={isDouble ? "98" : "86"} width="6" height="4" rx="1.5" transform="rotate(-15 62 98)" />
            <rect x="110" y={isDouble ? "115" : "100"} width="5" height="5" rx="1" transform="rotate(10 110 115)" />
          </g>
        )}

        {/* Choco Chips */}
        {hasChips && (
          <g fill="#3B1D12">
            <path d={isDouble ? "M 86 64 L 92 64 L 89 57 Z" : "M 86 54 L 92 54 L 89 47 Z"} />
            <path d={isDouble ? "M 106 82 L 112 82 L 109 75 Z" : "M 106 68 L 112 68 L 109 61 Z"} />
            <path d={isDouble ? "M 74 105 L 80 105 L 77 98 Z" : "M 74 92 L 80 92 L 77 85 Z"} />
            <path d={isDouble ? "M 126 102 L 132 102 L 129 95 Z" : "M 126 88 L 132 88 L 129 81 Z"} />
          </g>
        )}

        {/* Roasted Almonds */}
        {hasAlmond && (
          <g fill="#D97706" stroke="#92400E" strokeWidth="0.8">
            <ellipse cx="64" cy={isDouble ? "82" : "72"} rx="5" ry="3" transform="rotate(-30 64 82)" />
            <ellipse cx="132" cy={isDouble ? "90" : "78"} rx="5.5" ry="3" transform="rotate(25 132 90)" />
            <ellipse cx="98" cy={isDouble ? "68" : "58"} rx="4.5" ry="2.5" transform="rotate(50 98 68)" />
          </g>
        )}

        {/* CONTAINER: CONE OR CUP */}
        {!isCup ? (
          /* WAFFLE CONE */
          <g id="cone-container">
            {/* Cone Triangle */}
            <polygon
              points={isDouble ? "56,124 144,124 100,225" : "56,110 144,110 100,215"}
              fill="url(#cone-grad)"
            />
            {/* Waffle Grid Overlay */}
            <polygon
              points={isDouble ? "56,124 144,124 100,225" : "56,110 144,110 100,215"}
              fill="url(#waffle-pattern)"
            />
            {/* Cone Lip Rim */}
            <path
              d={isDouble 
                ? "M 52 124 C 52 120 148 120 148 124 C 148 127 52 127 52 124 Z"
                : "M 52 110 C 52 106 148 106 148 110 C 148 113 52 113 52 110 Z"}
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="1.5"
            />
          </g>
        ) : (
          /* ECO CUP */
          <g id="cup-container">
            {/* Cup Body */}
            <path
              d={isDouble 
                ? "M 48 120 L 58 200 C 60 208 140 208 142 200 L 152 120 Z"
                : "M 48 106 L 58 190 C 60 198 140 198 142 190 L 152 106 Z"}
              fill="url(#cup-grad)"
              stroke="#FB7185"
              strokeWidth="2"
            />
            {/* Cup Rim Band */}
            <rect
              x="44"
              y={isDouble ? "116" : "102"}
              width="112"
              height="10"
              rx="4"
              fill="#FFFFFF"
              stroke="#FDA4AF"
              strokeWidth="1.5"
            />
            {/* Cup Label / Cute Logo */}
            <g transform={isDouble ? "translate(100, 162)" : "translate(100, 150)"}>
              <circle cx="0" cy="0" r="16" fill="#FFFFFF" opacity="0.9" />
              <text x="0" y="4" textAnchor="middle" fontSize="12" fill="#E11D48" fontWeight="bold">
                🍦
              </text>
            </g>
            {/* Cup subtle shadow */}
            <ellipse cx="100" cy={isDouble ? "205" : "195"} rx="44" ry="4" fill="#000000" opacity="0.08" />
          </g>
        )}
      </svg>
    </div>
  );
}
