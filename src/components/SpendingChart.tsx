/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Order } from '../types';
import { TrendingUp, Award, DollarSign, Calendar } from 'lucide-react';

interface SpentDataPoint {
  date: Date;
  amount: number;
  cumulative: number;
  orderId: string;
}

interface ValidOrder extends Order {
  parsedDate: Date;
}

interface SpendingChartProps {
  orders: Order[];
  baseCurrency: string;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ orders, baseCurrency }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [chartType, setChartType] = useState<'individual' | 'cumulative'>('individual');
  const [dimensions, setDimensions] = useState({ width: 600, height: 260 });
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    orderId: string;
    dateStr: string;
    amount: number;
    cumulative: number;
  } | null>(null);

  // Filter out cancelled orders for spending trend calculations
  const validOrders: ValidOrder[] = orders
    .filter(o => o.status !== 'Cancelled')
    .map(o => ({
      ...o,
      parsedDate: new Date(o.date)
    }))
    .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());

  // Set up container resize tracking according to guidelines
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      
      const { width } = entries[0].contentRect;
      // Calculate optimized height based on width but constrained between 220px and 350px
      const targetHeight = Math.max(220, Math.min(320, width * 0.45));
      
      setDimensions({
        width: Math.max(280, width), // Ensure a minimum scale for extremely narrow views
        height: targetHeight
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Compute points and render chart via d3
  useEffect(() => {
    if (validOrders.length === 0 || !svgRef.current) return;

    // Clear previous elements inside SVG container
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll('*').remove();

    const { width, height } = dimensions;
    const margin = { top: 25, right: 25, bottom: 45, left: 55 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Prepare chart data points
    let runningSum = 0;
    const dataPoints: SpentDataPoint[] = validOrders.map((order) => {
      runningSum += order.total;
      return {
        date: order.parsedDate,
        amount: order.total,
        cumulative: runningSum,
        orderId: order.id
      };
    });

    const isCumulative = chartType === 'cumulative';
    const getValue = (d: SpentDataPoint) => isCumulative ? d.cumulative : d.amount;

    // Domain configuration
    let xDomain = d3.extent(dataPoints, (d: SpentDataPoint) => d.date) as [Date, Date];
    // Pad domain if only one point or same dates to prevent zero-width scale crashes
    if (xDomain[0]?.getTime() === xDomain[1]?.getTime()) {
      const singleDate = xDomain[0] || new Date();
      xDomain = [
        new Date(singleDate.getTime() - 24 * 60 * 60 * 1000 * 3), // -3 days
        new Date(singleDate.getTime() + 24 * 60 * 60 * 1000 * 3)  // +3 days
      ];
    }

    const yMax = (d3.max(dataPoints, getValue) as number) || 100;
    // Set Y scale from 0 to yMax with generous padding
    const yDomain = [0, yMax * 1.15];

    // Scales creation
    const xScale = d3.scaleTime()
      .domain(xDomain)
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([chartHeight, 0]);

    // Create central main plot group
    const plot = svgElement
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Gradient Definitions for Ambient Area Fill
    const defs = svgElement.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'chart-area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', isCumulative ? '#10b981' : '#6366f1')
      .attr('stop-opacity', 0.28);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', isCumulative ? '#10b981' : '#6366f1')
      .attr('stop-opacity', 0.0);

    // Horizontal grid lines
    const yTicks = 4;
    plot.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yScale.ticks(yTicks))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', chartWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#e2e8f0') // slate-200
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.6);

    // X-Axis Drawing
    const xAxis = d3.axisBottom(xScale)
      .ticks(Math.min(dataPoints.length + 1, width < 480 ? 3 : 5))
      .tickFormat((domainValue) => {
        const d = domainValue as Date;
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      });

    plot.append('g')
      .attr('transform', `translate(0, ${chartHeight})`)
      .attr('class', 'x-axis')
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', '9px')
      .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
      .attr('fill', '#94a3b8')
      .attr('dy', '1em');

    // Remove axis border line to keep it clean, but keep ticks
    plot.select('.x-axis path').attr('stroke', '#e2e8f0').attr('stroke-width', 1);

    // Y-Axis Drawing
    const yAxis = d3.axisLeft(yScale)
      .ticks(yTicks)
      .tickFormat(v => `${baseCurrency}${v}`);

    plot.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('font-size', '9px')
      .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace')
      .attr('fill', '#94a3b8');

    plot.select('.y-axis path').attr('stroke', 'none');

    // Smooth Line Creator
    const lineGenerator = d3.line<SpentDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.date))
      .y(d => yScale(getValue(d)));

    // Smooth Area Under the Line Creator
    const areaGenerator = d3.area<SpentDataPoint>()
      .curve(d3.curveMonotoneX)
      .x(d => xScale(d.date))
      .y0(chartHeight)
      .y1(d => yScale(getValue(d)));

    // Append Area underneath
    plot.append('path')
      .datum(dataPoints)
      .attr('class', 'chart-area')
      .attr('d', areaGenerator)
      .attr('fill', 'url(#chart-area-gradient)');

    // Append primary line path
    plot.append('path')
      .datum(dataPoints)
      .attr('class', 'chart-stroke-line')
      .attr('d', lineGenerator)
      .attr('fill', 'none')
      .attr('stroke', isCumulative ? '#10b981' : '#4f46e5') // green-500 or indigo-600
      .attr('stroke-width', 2.5)
      .attr('stroke-linecap', 'round');

    // Interactive Nodes (Circles) for Each Transaction
    const dotsGroup = plot.append('g').attr('class', 'chart-dots');
    
    dotsGroup.selectAll('circle')
      .data(dataPoints)
      .enter()
      .append('circle')
      .attr('cx', (d: SpentDataPoint) => xScale(d.date))
      .attr('cy', (d: SpentDataPoint) => yScale(getValue(d)))
      .attr('r', width < 480 ? 4 : 5)
      .attr('fill', isCumulative ? '#10b981' : '#4f46e5')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('class', 'transition-all cursor-pointer')
      .attr('filter', 'drop-shadow(0px 1.5px 2px rgba(0,0,0,0.15))')
      .on('mouseover', function(event, datum) {
        const d = datum as SpentDataPoint;
        // Enlarge current node
        d3.select(this)
          .transition()
          .duration(120)
          .attr('r', width < 480 ? 6 : 7.5)
          .attr('stroke-width', 2.5);

        // Get coordinates inside container
        const [xCoord, yCoord] = d3.pointer(event);
        
        setActiveTooltip({
          x: xCoord + margin.left,
          y: yCoord + margin.top,
          orderId: d.orderId,
          dateStr: d.date.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          amount: d.amount,
          cumulative: d.cumulative
        });
      })
      .on('mousemove', function(event) {
        // Move tooltip alongside cursor within proximity limits
        const [xCoord, yCoord] = d3.pointer(event);
        setActiveTooltip(prev => prev ? {
          ...prev,
          x: xCoord + margin.left,
          y: yCoord + margin.top
        } : null);
      })
      .on('mouseout', function() {
        // Restore standard node radius
        d3.select(this)
          .transition()
          .duration(150)
          .attr('r', width < 480 ? 4 : 5)
          .attr('stroke-width', 2);
          
        setActiveTooltip(null);
      });

  }, [dimensions, chartType, validOrders, baseCurrency]);

  if (validOrders.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl bg-white/50 max-w-full">
        <DollarSign className="h-6 w-6 text-slate-350 mx-auto mb-2" />
        <span className="block text-xs font-bold text-slate-700">Cumulative Visual Ledger Unmapped</span>
        <span className="block text-[10.5px] text-slate-400 mt-0.5">Place solid acquisitions to chart spending vectors.</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-205 dark:border-slate-800 p-4 sm:p-5 shadow-xs relative overflow-hidden" id="customer-spending-trend-widget">
      
      {/* Visual Header Grid & Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center">
              Aether Spending Dynamics
              <span className="ml-1.5 inline-block text-[8px] font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-bold px-1.5 py-0.25 rounded-md">D3 LIVE</span>
            </h4>
            <span className="block text-[9.5px] font-sans text-slate-405 dark:text-slate-400 leading-none">Statistical vectors spanning customer catalog acquisitions</span>
          </div>
        </div>

        {/* Dynamic Controls Option Rails */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg self-start sm:self-auto border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setChartType('individual')}
            className={`px-2.5 py-1 text-[9.5px] font-bold tracking-tight rounded-md transition-colors cursor-pointer ${
              chartType === 'individual'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Receipt Value
          </button>
          <button
            onClick={() => setChartType('cumulative')}
            className={`px-2.5 py-1 text-[9.5px] font-bold tracking-tight rounded-md transition-colors cursor-pointer ${
              chartType === 'cumulative'
                ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Cumulative Spends
          </button>
        </div>
      </div>

      {/* Primary Canvas Container - responsive resize listener bound here */}
      <div ref={containerRef} className="w-full relative min-h-[170px]">
        <svg 
          ref={svgRef} 
          width={dimensions.width} 
          height={dimensions.height} 
          className="overflow-visible select-none"
        />

        {/* Dynamic Embedded HTML Tooltip Bubble */}
        {activeTooltip && (
          <div 
            className="absolute z-30 pointer-events-none bg-slate-900 border border-slate-800/80 text-white p-2.5 rounded-lg text-[10px] shadow-lg leading-relaxed animate-fade-in flex flex-col space-y-0.5"
            style={{ 
              left: `${activeTooltip.x}px`, 
              top: `${activeTooltip.y - 82}px`,
              transform: 'translateX(-50%)',
              transition: 'left 0.08s ease-out, top 0.08s ease-out'
            }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-1 font-mono text-[9px] text-slate-400">
              <span>{activeTooltip.orderId}</span>
              <span className="flex items-center ml-4">
                <Calendar className="h-2.5 w-2.5 mr-0.5" /> {activeTooltip.dateStr.split(',')[0]}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Transaction Value:</span>
              <span className="font-mono font-bold text-slate-100 ml-3">
                {baseCurrency}{activeTooltip.amount.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-350 text-[9px]">Sum Accumulation:</span>
              <span className="font-mono font-bold text-emerald-400 text-[9px] ml-3">
                {baseCurrency}{activeTooltip.cumulative.toFixed(2)}
              </span>
            </div>
            {/* Tooltip pointing triangle arrow */}
            <div className="absolute left-1/2 bottom-[-4px] transform -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-slate-800/80 rotate-45"></div>
          </div>
        )}
      </div>

      {/* Ambient Quick Fact summary line */}
      <div className="mt-2.5 border-t border-slate-110 dark:border-slate-800/40 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-450 dark:text-slate-400">
        <span className="flex items-center">
          <Award className="h-3 w-3 mr-1 text-amber-500" />
          First order: {validOrders[0]?.parsedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
        </span>
        <span>
          Max transaction: {baseCurrency}{(d3.max(validOrders, (o: ValidOrder) => o.total) as number || 0).toFixed(2)}
        </span>
      </div>

    </div>
  );
};
