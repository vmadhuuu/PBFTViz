import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PBFTDiagram = ({ data }) => {
  const svgRef = useRef();
  const phases= [
    { name: "Request" },
    { name: "Pre-Prepare" },
    { name: "Prepare" },
    { name: "Commit" },
    { name: "Reply" },
  ];


  useEffect(() => {
    
  if(Object.keys(data).length!=0){
    const width = 1500;
    const height = 500; // Adjusted for better separation of nodes
    const phaseWidth = width / (phases.length + 1);
    // Define colors for each phase
    const phaseColors = {
      propose: "blue",
      pre_prepare: "orange",
      prepare: "green",
      commit: "red",
      reply: "yellow",
    };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background-color", "black");

    // Drawing phase separators
    phases.forEach((phase, index) => {
      svg
        .append("line")
        .attr("x1", phaseWidth * (index + 1))
        .attr("y1", 0)
        .attr("x2", phaseWidth * (index + 1))
        .attr("y2", height)
        .attr("stroke", "white")
        .attr("stroke-dasharray", "5,5");
    });

    // Drawing nodes
    svg
      .append("g")
      .selectAll("circle")
      .data(data.replicas)
      .join("circle")
      .attr("cx", 100)
      .attr("cy", (d, i) => ((i + 1) * height) / (data.replicas.length + 1))
      .attr("r", 20)
      .style("fill", "white");

    // Drawing links
    svg
      .append("g")
      .selectAll("line")
      .data(
        data.replicas.flatMap((replica) =>
          Object.keys(replica.states).map((phase) => ({
            source: replica.id,
            phase,
          }))
        )
      )
      .join("line")
      .attr("x1", 100)
      .attr(
        "y1",
        (d) =>
          ((data.replicas.findIndex((replica) => replica.id === d.source) + 1) *
            height) /
          (data.replicas.length + 1)
      )
      .attr(
        "x2",
        (d) =>
          (phases.findIndex((p) => p.name === d.phase) + 1) * phaseWidth
      )
      .attr(
        "y2",
        (d) =>
          ((data.replicas.findIndex((replica) => replica.id === d.source) + 1) *
            height) /
          (data.replicas.length + 1)
      )
      .attr("stroke", (d) => phaseColors[d.phase])
      .attr("stroke-width", 2)
      .attr("marker-end", (d) => (d.phase === "Reply" ? "url(#arrow)" : ""));

    // Define the arrow marker
    svg
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "white");

    // Adding phase labels
    phases.forEach((phase, index) => {
      svg
        .append("text")
        .attr("x", (index + 1) * phaseWidth)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .text(phase.name);
    });
    console.log("DATA:", data)
  }
  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default PBFTDiagram;
