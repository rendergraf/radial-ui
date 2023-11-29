import * as fs from "fs";
import tinycolor from "tinycolor2";
import { colorPalettes, opacityValues } from "./colorData.js";

function generateColorRanges(colorPalettes) {
  const colorRanges = {};

  Object.entries(colorPalettes).forEach(([colorName, colorHex]) => {
    colorRanges[colorName] = {
      ranges: generateColor(colorHex)
    };
  });

  return colorRanges;
}

function generateColor(baseColorHex) {
  const steps = 12;
  const darkenFactor = 1.1;
  const baseColor = tinycolor(baseColorHex);
  const colorArray = [];

  for (let i = 0; i < steps; i++) {
    const factor = i === 10 ? 2 : darkenFactor;
    const modifiedColor = calculateModifiedColor(baseColor, factor, i);
    const nextColor = modifiedColor.toHexString();
    colorArray.push(nextColor);
  }

  return colorArray;
}

function calculateModifiedColor(color, factor, index, colorName) {
  if (colorName === "gray" && index === 10) {
    return color.darken((factor + 0.2) * index).saturate().greyscale();
  }
  return color.darken(factor * index).saturate();
}

function generateCSSVariables(colorName, colorData) {
  const { ranges } = colorData;
  const rootVars = generateVariables(colorName, ranges);
  return `
/* Hex colors */
:root {
${rootVars}
}
`;
}

function generateVariables(colorName, colorRanges) {
  const rootVars = colorRanges.map((color, index) => {
    const currentColor = tinycolor(color);
    const modifiedColor = colorName === "gray" ? currentColor.greyscale().toHexString() : currentColor.toHexString();
    return `--${colorName}-${index + 1}: ${modifiedColor};\n`;
  });

  return rootVars.join('');
}

function generateCSSVariablesHex8(colorName, colorData) {
  const { ranges } = colorData;
  const rootVars = generateVariablesHex8(colorName, ranges);
  return `
/* Hex 8 colors */
:root {
${rootVars}
}
`;
}

function generateVariablesHex8(colorName, colorRanges) {
  const rootVars = colorRanges.map((color, index) => {
    const currentColor = tinycolor(color);
    const modifiedColor = colorName === "gray" ? currentColor.greyscale().toHex8String() : currentColor.toHex8String();
    return `--${colorName}-${index + 1}: ${modifiedColor};\n`;
  });

  return rootVars.join('');
}

function hexToP3(hexColor) {
  if (typeof hexColor !== 'string' || hexColor.charAt(0) !== '#' || hexColor.length !== 7) {
    throw new Error('Invalid hex string!');
  }

  const parsedColor = [
    parseInt(hexColor.substring(1, 3), 16) / 255,
    parseInt(hexColor.substring(3, 5), 16) / 255,
    parseInt(hexColor.substring(5, 7), 16) / 255
  ];

  const formattedColor = `color(display-p3 ${parsedColor[0].toFixed(2)} ${parsedColor[1].toFixed(2)} ${parsedColor[2].toFixed(2)} / 1)`;

  return formattedColor;
}

function generateVariablesP3(colorName, colorRanges) {
  const rootVars = colorRanges.map((color, index) => {
    return `--${colorName}-${index + 1}: ${hexToP3(color)};\n`;
  });

  return rootVars.join('');
}

function hexToP3Alpha(hexColor, alpha) {
  if (typeof hexColor !== 'string' || hexColor.charAt(0) !== '#' || hexColor.length !== 7) {
    throw new Error('Invalid hex string!');
  }

  const parsedColor = [
    parseInt(hexColor.substring(1, 3), 16) / 255,
    parseInt(hexColor.substring(3, 5), 16) / 255,
    parseInt(hexColor.substring(5, 7), 16) / 255
  ];

  const formattedColor = `color(display-p3 ${parsedColor[0].toFixed(2)} ${parsedColor[1].toFixed(2)} ${parsedColor[2].toFixed(2)} / ${alpha})`;

  return formattedColor;
}

function generateVariablesP3A(colorName, colorRanges) {
  const rootVars = colorRanges.map((color, index) => {
    const alpha = opacityValues[index];
    return `--${colorName}-A${index + 1}: ${hexToP3Alpha(color, alpha)};\n`;
  });

  return rootVars.join('');
}

function generateCSSVariablesP3(colorName, colorData) {
  const { ranges } = colorData;
  const rootVars = generateVariablesP3(colorName, ranges);
  return `
/* Display P3 */
@supports (color: color(display-p3 1 1 1)) and (color-gamut: p3) {
:root {
${rootVars}
  }
}
`;
}

function generateCSSVariablesP3A(colorName, colorData) {
  const { ranges } = colorData;
  const rootVars = generateVariablesP3A(colorName, ranges);
  return `
/* Display P3 Alpha*/
@supports (color: color(display-p3 1 1 1)) and (color-gamut: p3) {
:root {
${rootVars}
  }
}
`;
}

function generateCSS(colorPalettes) {
  const ranges = generateColorRanges(colorPalettes);

  Object.entries(ranges).forEach(([colorName, colorData]) => {
    const cssContent = combineCSSContent(colorName, colorData);
    writeCSSFiles(colorName, cssContent);
  });
}

function combineCSSContent(colorName, colorData) {
  const cssContents = [
    generateCSSVariables(colorName, colorData),
    generateCSSVariablesHex8(colorName, colorData),
    generateCSSVariablesP3(colorName, colorData),
    generateCSSVariablesP3A(colorName, colorData)
  ];
  return cssContents.join("\n\n");
}

function writeCSSFiles(colorName, cssContent) {
  const fileName = `${colorName}.css`;
  fs.writeFileSync(`./dist/${fileName}`, cssContent, "utf-8");
  console.log(`Archivo ${fileName} generado con éxito.`);
}

generateCSS(colorPalettes);
