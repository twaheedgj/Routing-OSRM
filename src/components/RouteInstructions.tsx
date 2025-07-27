'use client';

import { useState } from 'react';
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Move,
  CornerDownRight,
  CornerDownLeft
} from 'lucide-react';
import { motion } from 'framer-motion';

type Step = {
  distance: number;
  duration: number;
  name: string;
  maneuver: {
    instruction: string;
    type: string;
    modifier?: string;
  };
};

export default function RouteInstructions({ steps }: { steps?: Step[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  if (!Array.isArray(steps) || steps.length === 0) return null;

  const getIcon = (type: string, modifier?: string) => {
    switch (modifier) {
      case 'left':
        return <ArrowLeft className="w-4 h-4 text-blue-500" />;
      case 'right':
        return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case 'slight right':
        return <CornerDownRight className="w-4 h-4 text-blue-500" />;
      case 'slight left':
        return <CornerDownLeft className="w-4 h-4 text-blue-500" />;
      case 'straight':
        return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
      default:
        return <Move className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatDistance = (meters: number) =>
    meters > 1000
      ? `${(meters / 1000).toFixed(1)} km`
      : `${Math.round(meters)} m`;

  const formatDuration = (seconds: number) =>
    seconds > 60
      ? `${Math.floor(seconds / 60)} min`
      : `${Math.round(seconds)} sec`;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ top: -1000, bottom: 1000, left: -1000, right: 1000 }}
      className="absolute z-30 top-4 left-4 cursor-move"
      style={{ x: position.x, y: position.y }}
    >
      <div className="max-w-sm w-[320px] bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-100 border-b">
          <h3 className="text-base font-semibold text-gray-700">Directions</h3>
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="text-xs text-blue-500 hover:underline"
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>

        {!collapsed && (
          <div className="max-h-96 overflow-y-auto px-4 py-2 space-y-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-gray-50 p-2 rounded-md shadow-sm"
              >
                <div className="mt-1">{getIcon(step.maneuver.type, step.maneuver.modifier)}</div>
                <div>
                  <p className="text-sm text-gray-800">{step.maneuver.instruction}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistance(step.distance)} • {formatDuration(step.duration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
