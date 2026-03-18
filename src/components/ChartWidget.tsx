import React, { useMemo, useRef, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  ScatterChart, Scatter, ComposedChart, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { Widget } from '../store/dashboardStore';
import { generateMockData } from '../services/mockData';
import { Download, MoreVertical, AlertCircle, ExternalLink } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

// Refined color palette: Indigo, Emerald, Amber, Rose, Sky, Violet
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#0ea5e9', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-100 shadow-xl rounded-xl">
        <p className="text-sm font-semibold text-slate-800 mb-3">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-600 capitalize">{entry.name}</span>
              </div>
              <span className="font-semibold text-slate-900">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const ChartWidget: React.FC<{ widget: Widget; filters?: any }> = ({ widget, filters }) => {
  const data = useMemo(() => generateMockData(widget.dataSourceUrl, filters), [widget.dataSourceUrl, filters]);
  const chartRef = useRef<HTMLDivElement>(null);
  
  // State to track which legend items are hidden
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});

  const handleLegendClick = (e: any) => {
    const dataKey = e.dataKey;
    if (dataKey) {
      setHiddenSeries(prev => ({
        ...prev,
        [dataKey]: !prev[dataKey]
      }));
    }
  };

  const handleExport = async (format: 'png' | 'csv') => {
    if (format === 'png' && chartRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(chartRef.current, { 
          backgroundColor: '#ffffff',
          pixelRatio: 2,
          cacheBust: true
        });
        const link = document.createElement('a');
        link.download = `${widget.title}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error('Failed to export image', err);
      }
    } else if (format === 'csv') {
      if (!data || data.length === 0) return;
      const keys = Object.keys(data[0]);
      const csvContent = [
        keys.join(','),
        ...data.map(row => keys.map(k => row[k]).join(','))
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${widget.title}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderChart = () => {
    const commonAxisProps = {
      axisLine: false,
      tickLine: false,
      tick: { fill: '#94a3b8', fontSize: 12 },
    };

    const commonGrid = <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />;
    
    const gradients = (
      <defs>
        {COLORS.map((color, index) => (
          <linearGradient key={`color-${index}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        ))}
      </defs>
    );

    switch (widget.type) {
      case 'area':
      case 'line':
        if (widget.groupByField) {
          const groupedData = data.reduce((acc: any, curr: any) => {
            const xVal = curr[widget.xAxisField];
            const groupVal = curr[widget.groupByField!];
            if (!acc[xVal]) acc[xVal] = { [widget.xAxisField]: xVal };
            acc[xVal][groupVal] = curr[widget.yAxisFields[0]];
            return acc;
          }, {});
          const chartData = Object.values(groupedData);
          const groups = Array.from(new Set(data.map((d: any) => d[widget.groupByField!])));
          
          return (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {gradients}
                {commonGrid}
                <XAxis dataKey={widget.xAxisField} {...commonAxisProps} dy={10} />
                <YAxis {...commonAxisProps} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '3 3' }} />
                <Legend onClick={handleLegendClick} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '20px', cursor: 'pointer' }} />
                {groups.map((group: any, index) => (
                  <Area 
                    key={group} 
                    type="monotone" 
                    dataKey={group} 
                    hide={hiddenSeries[group]}
                    stroke={COLORS[index % COLORS.length]} 
                    fill={`url(#color-${index % COLORS.length})`}
                    strokeWidth={2}
                    activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[index % COLORS.length] }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          );
        }
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {gradients}
              {commonGrid}
              <XAxis dataKey={widget.xAxisField} {...commonAxisProps} dy={10} />
              <YAxis {...commonAxisProps} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '3 3' }} />
              <Legend onClick={handleLegendClick} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '20px', cursor: 'pointer' }} />
              {widget.yAxisFields.map((field, index) => (
                <Area 
                  key={field} 
                  type="monotone" 
                  dataKey={field} 
                  hide={hiddenSeries[field]}
                  stroke={COLORS[index % COLORS.length]} 
                  fill={`url(#color-${index % COLORS.length})`}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[index % COLORS.length] }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {commonGrid}
              <XAxis dataKey={widget.xAxisField} {...commonAxisProps} dy={10} />
              <YAxis {...commonAxisProps} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend onClick={handleLegendClick} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '20px', cursor: 'pointer' }} />
              {widget.yAxisFields.map((field, index) => (
                <Bar 
                  key={field} 
                  dataKey={field} 
                  hide={hiddenSeries[field]}
                  fill={COLORS[index % COLORS.length]} 
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={data.filter((d: any) => !hiddenSeries[d[widget.xAxisField]])} 
                dataKey={widget.yAxisFields[0]} 
                nameKey={widget.xAxisField} 
                cx="50%" 
                cy="50%" 
                innerRadius={60}
                outerRadius={80} 
                paddingAngle={5}
                stroke="none"
              >
                {data.filter((d: any) => !hiddenSeries[d[widget.xAxisField]]).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[data.findIndex((d: any) => d[widget.xAxisField] === entry[widget.xAxisField]) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                onClick={(e: any) => {
                  const dataKey = e.value;
                  if (dataKey) {
                    setHiddenSeries(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
                  }
                }} 
                iconType="circle" 
                wrapperStyle={{ fontSize: '12px', color: '#64748b', cursor: 'pointer' }} 
                payload={data.map((item: any, index: number) => ({
                  id: item[widget.xAxisField],
                  type: 'circle',
                  value: item[widget.xAxisField],
                  color: hiddenSeries[item[widget.xAxisField]] ? '#cbd5e1' : COLORS[index % COLORS.length]
                }))}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {gradients}
              {commonGrid}
              <XAxis dataKey={widget.xAxisField} {...commonAxisProps} dy={10} />
              <YAxis yAxisId="left" {...commonAxisProps} dx={-10} />
              <YAxis yAxisId="right" orientation="right" {...commonAxisProps} dx={10} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend onClick={handleLegendClick} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '20px', cursor: 'pointer' }} />
              <Bar yAxisId="left" dataKey={widget.yAxisFields[0]} hide={hiddenSeries[widget.yAxisFields[0]]} barSize={32} fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              {widget.yAxisFields[1] && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey={widget.yAxisFields[1]} 
                  hide={hiddenSeries[widget.yAxisFields[1]]}
                  stroke={COLORS[1]} 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 0, fill: COLORS[1] }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[1] }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
              {commonGrid}
              <XAxis type="category" dataKey={widget.xAxisField} name={widget.xAxisField} {...commonAxisProps} dy={10} />
              <YAxis type="number" dataKey={widget.yAxisFields[0]} name={widget.yAxisFields[0]} {...commonAxisProps} dx={-10} />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#e2e8f0' }} />
              <Legend onClick={handleLegendClick} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '20px', cursor: 'pointer' }} />
              <Scatter name="Performance" data={data} fill={COLORS[0]} hide={hiddenSeries['Performance']}>
                {data.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.errorRate > 10 ? COLORS[3] : COLORS[0]} // Flag outliers with Rose color
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );
      default:
        return <div className="flex items-center justify-center h-full text-slate-400">Unsupported chart type</div>;
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col transition-shadow hover:shadow-md"
      style={{ gridColumn: `span ${widget.colSpan} / span ${widget.colSpan}` }}
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
            {widget.title}
            {widget.type === 'scatter' && <AlertCircle size={16} className="text-rose-500" />}
          </h3>
          {widget.description && <p className="text-sm text-slate-500 mt-1">{widget.description}</p>}
        </div>
        <div className="relative group">
          <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
            <MoreVertical size={18} />
          </button>
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-100 hidden group-hover:block z-10 overflow-hidden">
            <button onClick={() => handleExport('png')} className="block w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Export as PNG</button>
            <button onClick={() => handleExport('csv')} className="block w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">Export as CSV</button>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-[320px]" ref={chartRef}>
        {renderChart()}
      </div>
      {widget.sourceLink && (
        <div className="mt-4 flex justify-end">
          <a 
            href={widget.sourceLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors"
            title="View original source"
          >
            <ExternalLink size={14} />
            <span>Source</span>
          </a>
        </div>
      )}
    </div>
  );
};
