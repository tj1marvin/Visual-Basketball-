import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BasketballNode, basketballData } from '../data/basketballData';

interface BasketballWebProps {
  onNodeClick: (node: BasketballNode) => void;
}

const BasketballWeb: React.FC<BasketballWebProps> = ({ onNodeClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom);

    const root = d3.hierarchy(basketballData);
    const links = root.links();
    const nodes = root.descendants();

    const simulation = d3.forceSimulation<any>(nodes)
      .force("link", d3.forceLink<any, any>(links).id(d => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(80));

    const link = g.append("g")
      .attr("stroke", "#333")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 2);

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .each(function(d: any) { d.targetScale = 1; d.targetOpacity = 1; })
      .on("click", (event, d: any) => {
        event.stopPropagation();
        onNodeClick(d.data);
        
        // Focus animation
        const scale = 1.5;
        const x = width / 2 - d.x * scale;
        const y = height / 2 - d.y * scale;
        
        svg.transition()
          .duration(750)
          .call(zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));

        // Highlight node and neighbors
        const neighbors = new Set([d, ...(d.children || []), d.parent].filter(Boolean));
        
        nodes.forEach((n: any) => {
          n.targetOpacity = neighbors.has(n) ? 1 : 0.1;
          n.targetScale = n === d ? 1.2 : (neighbors.has(n) ? 1 : 0.8);
        });

        link.transition().duration(500)
          .style("opacity", (l: any) => neighbors.has(l.source) && neighbors.has(l.target) ? 1 : 0.1);
      })
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Reset focus on background click
    svg.on("click", () => {
      svg.transition()
        .duration(750)
        .call(zoom.transform, d3.zoomIdentity);
      
      nodes.forEach((n: any) => {
        n.targetOpacity = 1;
        n.targetScale = 1;
      });
      
      link.transition().duration(500)
        .style("opacity", 0.6);
    });

    // Node circles
    node.append("circle")
      .attr("r", d => d.depth === 0 ? 40 : 30)
      .attr("class", d => d.depth === 0 ? "animate-node-pulse" : "")
      .attr("fill", d => {
        switch (d.data.category) {
          case 'main': return '#f97316'; // Orange
          case 'history': return '#3b82f6'; // Blue
          case 'positions': return '#10b981'; // Green
          case 'strategy': return '#8b5cf6'; // Purple
          case 'training': return '#ef4444'; // Red
          case 'rules': return '#eab308'; // Yellow
          case 'skills': return '#06b6d4'; // Cyan
          default: return '#6b7280';
        }
      })
      .attr("stroke", d => {
        switch (d.data.category) {
          case 'main': return '#fdba74';
          case 'history': return '#93c5fd';
          case 'positions': return '#6ee7b7';
          case 'strategy': return '#c4b5fd';
          case 'training': return '#fca5a5';
          case 'rules': return '#fde047';
          case 'skills': return '#67e8f9';
          default: return '#9ca3af';
        }
      })
      .attr("stroke-width", 2)
      .on("mouseover", function(event, d: any) {
        d3.select(this).transition().duration(200)
          .attr("r", d.depth === 0 ? 45 : 35)
          .attr("stroke", "#fff")
          .attr("stroke-width", 3);
      })
      .on("mouseout", function(event, d: any) {
        const originalStroke = () => {
          switch (d.data.category) {
            case 'main': return '#fdba74';
            case 'history': return '#93c5fd';
            case 'positions': return '#6ee7b7';
            case 'strategy': return '#c4b5fd';
            case 'training': return '#fca5a5';
            case 'rules': return '#fde047';
            case 'skills': return '#67e8f9';
            default: return '#9ca3af';
          }
        };
        d3.select(this).transition().duration(200)
          .attr("r", d.depth === 0 ? 40 : 30)
          .attr("stroke", originalStroke())
          .attr("stroke-width", 2);
      });

    // Node labels
    node.append("text")
      .attr("dy", d => d.depth === 0 ? 60 : 50)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .text(d => d.data.label);

    // Play button indicator for video nodes
    const playButton = node.filter(d => !!d.data.videoUrl);
    
    playButton.append("circle")
      .attr("r", 15)
      .attr("fill", "rgba(0,0,0,0.3)")
      .attr("stroke", "white")
      .attr("stroke-width", 1)
      .style("pointer-events", "none");

    playButton.append("path")
      .attr("d", "M-4,-6 L8,0 L-4,6 Z")
      .attr("fill", "white")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y}) scale(${d.targetScale || 1})`)
        .style("opacity", (d: any) => d.targetOpacity ?? 1);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [onNodeClick]);

  return (
    <div className="w-full h-full bg-zinc-950 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 text-zinc-400 text-sm font-mono uppercase tracking-widest pointer-events-none">
        Interactive Knowledge Web
      </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default BasketballWeb;
