// backgroundShapes.js
import React from "react";

const colors = [
  "bg-[#f3eddb]", // بيج فاتح
  "bg-[#e2572c]", // برتقالي محمر
  "bg-[#f0c02d]", // أصفر
  "bg-[#00a7c4]", // سماوي
  "bg-[#b64c9e]", // بنفسجي
  "bg-[#273041]", // كحلي غامق
  "bg-[#faaf42]", // برتقالي متوسط
  "bg-[#e6e6e6]", // رمادي فاتح
];

const shapeTypes = [
  "circle",
  "square",
  "triangle",
  "diamond",
  "hexagon",
  "star",
  "heart",
  "pentagon",
  "oval",
  "cross",
  "arrow",
  "leaf",
];

export const generateShapes = (length = 25) => {
  return Array.from({ length: length }, (_, i) => ({
    id: i,
    type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 30 + Math.random() * 60,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    opacity: 0.1 + Math.random() * 0.2,
  }));
};

export const renderShape = (shape) => {
  const baseStyle = {
    position: "absolute",
    width: `${shape.size}px`,
    height: `${shape.size}px`,
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
    opacity: shape.opacity,
    zIndex: 0,
  };

  const shapeComponents = {
    circle: (
      <div
        key={shape.id}
        className={`${shape.color} rounded-full`}
        style={baseStyle}
      />
    ),

    square: (
      <div
        key={shape.id}
        className={`${shape.color} rounded-lg`}
        style={baseStyle}
      />
    ),

    triangle: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
        }}
      />
    ),

    diamond: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      />
    ),

    hexagon: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      />
    ),

    star: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath:
            "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        }}
      />
    ),

    heart: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath:
            "polygon(50% 100%, 20% 60%, 20% 35%, 30% 20%, 50% 30%, 70% 20%, 80% 35%, 80% 60%)",
        }}
      />
    ),

    pentagon: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
        }}
      />
    ),

    oval: (
      <div
        key={shape.id}
        className={`${shape.color} rounded-full`}
        style={{
          ...baseStyle,
          width: `${shape.size * 1.5}px`,
          height: `${shape.size}px`,
        }}
      />
    ),

    cross: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath:
            "polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)",
        }}
      />
    ),

    arrow: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath:
            "polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)",
        }}
      />
    ),

    leaf: (
      <div
        key={shape.id}
        className={shape.color}
        style={{
          ...baseStyle,
          clipPath: "polygon(0% 50%, 25% 0%, 100% 50%, 25% 100%)",
          borderRadius: "0% 100% 0% 100%",
        }}
      />
    ),
  };

  return shapeComponents[shape.type] || shapeComponents.circle;
};
