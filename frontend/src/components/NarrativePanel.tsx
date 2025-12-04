import { AlertTriangle, Ship, Snowflake, TrendingUp } from 'lucide-react';

interface NarrativePanelProps {
  day: number;
}

export function NarrativePanel({ day }: NarrativePanelProps) {
  const forecasts = [
    {
      day: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      confidence: 95,
      summary: 'Current ice conditions show moderate coverage across Lake Superior and western Lake Erie. Fast ice forming along southern shores of Lake Superior.',
      iceConditions: 'Fast ice development in protected bays. Pack ice concentration 30-40% in Lake Superior, 20-30% in Lake Erie.',
      shippingImpact: 'Moderate impact to shipping routes in Lake Superior. Northern routes experiencing 2-3 hour delays.',
      recommendations: [
        'Stage icebreaker assets at Duluth and Sault Ste. Marie',
        'Monitor shipping lane congestion in Whitefish Bay',
        'Prepare for escort operations in Lake Superior western basin',
      ],
      risks: 'Low',
    },
    {
      day: 1,
      date: new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      confidence: 87,
      summary: 'Ice coverage expanding in Lake Michigan with favorable freeze conditions. Fast ice extent increasing by 15-20 nautical miles along northwest shores.',
      iceConditions: 'Fast ice expansion continues. Pack ice concentration increasing to 45-50% in Lake Superior, stable at 25-30% in Lake Erie.',
      shippingImpact: 'Increased delays expected in Lake Superior (4-6 hours). St. Marys River traffic requires icebreaker escort.',
      recommendations: [
        'Deploy USCGC Mackinaw to St. Marys River for escort operations',
        'Position secondary assets at Thunder Bay',
        'Issue navigation warnings for increased ice in shipping lanes',
        'Coordinate with commercial vessels on convoy timing',
      ],
      risks: 'Moderate',
    },
    {
      day: 2,
      date: new Date(Date.now() + 172800000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      confidence: 78,
      summary: 'Continued ice growth across all Great Lakes. Strong northeast winds driving pack ice movement toward southern Lake Huron shipping lanes.',
      iceConditions: 'Fast ice: 50+ nautical mile extent. Pack ice: 55-65% in Superior, 35-45% in Huron, 30-40% in Erie. New ice forming in Lake Michigan.',
      shippingImpact: 'Significant disruption to multiple shipping routes. Lake Huron traffic diverted to western corridors. Erie routes partially obstructed.',
      recommendations: [
        'Full deployment of icebreaker fleet across Great Lakes',
        'Establish convoy system for Lake Superior and Lake Huron',
        'Pre-position emergency response teams at Detroit and Cleveland',
        'Consider temporary closure of marginal shipping routes',
        'Increase surveillance flights for ice reconnaissance',
      ],
      risks: 'High',
    },
    {
      day: 3,
      date: new Date(Date.now() + 259200000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      confidence: 65,
      summary: 'Peak ice conditions expected. Extensive fast ice and heavy pack ice concentrations may restrict navigation in multiple lakes simultaneously.',
      iceConditions: 'Fast ice: 75+ nautical miles. Pack ice: 70-80% Superior, 50-60% Huron, 45-55% Erie, 25-35% Michigan, 30-40% Ontario.',
      shippingImpact: 'Severe restrictions on all major shipping lanes. Multiple routes impassable without icebreaker escort. Extended delays (12+ hours) anticipated.',
      recommendations: [
        'Activate full ice operations protocol',
        'Coordinate with Canadian Coast Guard for joint operations',
        'Establish 24/7 convoy operations in all major shipping corridors',
        'Pre-stage rescue and emergency assets at key ports',
        'Issue marine safety bulletins for hazardous ice conditions',
        'Consider restricting non-essential commercial traffic',
      ],
      risks: 'High',
    },
  ];

  const forecast = forecasts[day];

  return (
    <aside className="w-96 bg-slate-800 border-l border-slate-700 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-white mb-1">Forecast Analysis</h2>
        </div>

        {/* Confidence Score */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300">Forecast Confidence</span>
            <span className={`px-2 py-1 rounded text-sm ${
              forecast.confidence >= 85 ? 'bg-green-900/50 text-green-300' :
              forecast.confidence >= 70 ? 'bg-yellow-900/50 text-yellow-300' :
              'bg-orange-900/50 text-orange-300'
            }`}>
              {forecast.confidence}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                forecast.confidence >= 85 ? 'bg-green-500' :
                forecast.confidence >= 70 ? 'bg-yellow-500' :
                'bg-orange-500'
              }`}
              style={{ width: `${forecast.confidence}%` }}
            />
          </div>
        </div>

        {/* Executive Summary */}
        <div>
          <h3 className="text-white mb-2 flex items-center gap-2">
            <Snowflake className="w-4 h-4" />
            Executive Summary
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {forecast.summary}
          </p>
        </div>

        {/* Ice Conditions */}
        <div>
          <h3 className="text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Ice Conditions
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {forecast.iceConditions}
          </p>
        </div>

        {/* Shipping Impact */}
        <div>
          <h3 className="text-white mb-2 flex items-center gap-2">
            <Ship className="w-4 h-4" />
            Shipping Impact
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            {forecast.shippingImpact}
          </p>
        </div>

        {/* Risk Level */}
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className={`w-5 h-5 ${
              forecast.risks === 'Critical' ? 'text-red-500' :
              forecast.risks === 'High' ? 'text-orange-500' :
              forecast.risks === 'Moderate' ? 'text-yellow-500' :
              'text-green-500'
            }`} />
            <span className="text-white">Risk Level</span>
          </div>
          <span className={`px-3 py-1 rounded ${
            forecast.risks === 'Critical' ? 'bg-red-900/50 text-red-300' :
            forecast.risks === 'High' ? 'bg-orange-900/50 text-orange-300' :
            forecast.risks === 'Moderate' ? 'bg-yellow-900/50 text-yellow-300' :
            'bg-green-900/50 text-green-300'
          }`}>
            {forecast.risks}
          </span>
        </div>

        {/* Data Sources */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-slate-400 text-sm mb-2">Data Sources</h4>
          <ul className="space-y-1 text-slate-500 text-xs">
            <li>• USNIC Satellite Ice Charts (3-week composite)</li>
            <li>• NOAA Surface Temperature Forecasts</li>
            <li>• Great Lakes Navigation System Routes</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
