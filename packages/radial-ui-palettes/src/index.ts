/*
 ******************************************************************************
 * File Name: @radial-ui/palette                                              *
 * Author: Xavier Araque xavieraraque@gmail.com                               *
 * Description: This script generates color palettes for @radial-ui.          *
 * Project: @radial-ui library UI for React                                   *
 * Date: November 23, 2023                                                    *
 ******************************************************************************
 */
import fs from "fs";
import tinycolor from "tinycolor2";
import { colorPalettes, opacityValues } from "./colorData";
import { ColorData, ColorPalettes, ColorRanges } from "./types";

function generateColorRanges(colorPalettes: ColorPalettes): ColorRanges {
  const colorRanges: ColorRanges = {};

  Object.entries(colorPalettes).forEach(([colorName, colorHex]) => {
    colorRanges[colorName] = {
      ranges: generateColor(colorHex)
    };
  });

  return colorRanges;
}

function generateColor(baseColorHex: string): string[] {
  const steps = 12;
  const darkenFactor = 1.1;
  const baseColor = tinycolor(baseColorHex);
  const colorArray = [];

  for (let i = 0; i < steps; i++) {
    const factor = i === 10 ? 2 : darkenFactor;
    const modifiedColor: tinycolor.Instance = calculateModifiedColor(baseColor, factor, i);
    const nextColor = modifiedColor.toHexString();
    colorArray.push(nextColor);
  }

  return colorArray;
}

function calculateModifiedColor(color: tinycolor.Instance, factor: number, index: number): tinycolor.Instance {
  return color.darken(factor * index).saturate();
}

function generateCSSVariables(colorName: string, colorData: { ranges: string[] }): string {
  const { ranges } = colorData;
  const rootVarsHex: string = generateVariables(colorName, ranges);
  const rootVarsHex8: string = generateVariablesHex8(colorName, ranges);
  const rootVarsHexA: string = generateVariablesA(colorName, ranges);
  return `
:root {
/* Hex colors */
${rootVarsHex}
/* Hex 8 colors */
${rootVarsHex8}
/* RGBA colors */
${rootVarsHexA}
}
`;
}

function generateVariablesA(colorName: string, colorRanges: string[]): string {
  const rootVars: string[] = colorRanges.map((color, index) => {
    const currentColor: tinycolor.Instance = tinycolor(color);
    const modifiedColor: string = colorName === "gray" ? currentColor.greyscale().toRgbString() : currentColor.toRgbString();
    const alpha: number = opacityValues[index % opacityValues.length];
    const alphaColor: string = tinycolor(modifiedColor).setAlpha(alpha).toRgbString();
    return `--${colorName}-A${index + 1}: ${alphaColor};\n`;
  });

  return rootVars.join('');
}

function generateVariables(colorName: string, colorRanges: string[]): string {
  const rootVars: string[] = colorRanges.map((color, index) => {
    const currentColor: tinycolor.Instance = tinycolor(color);
    const modifiedColor: string = colorName === "gray" ? currentColor.greyscale().toHexString() : currentColor.toHexString();
    return `--${colorName}-${index + 1}: ${modifiedColor};\n`;
  });

  return rootVars.join('');
}

function generateVariablesHex8(colorName: string, colorRanges: string[]): string {
  const rootVars: string[] = colorRanges.map((color, index) => {
    const currentColor: tinycolor.Instance = tinycolor(color);
    const modifiedColor: string = colorName === "gray" ? currentColor.greyscale().toHex8String() : currentColor.toHex8String();
    return `--${colorName}-${index + 1}: ${modifiedColor};\n`;
  });

  return rootVars.join('');
}

function hexToP3(hexColor: string): string {
  if (typeof hexColor !== 'string' || !hexColor.startsWith('#') || hexColor.length !== 7) {
    throw new Error('Invalid hex string!');
  }

  const parsedColor = [
    parseInt(hexColor.substring(1, 3), 16) / 255,
    parseInt(hexColor.substring(3, 5), 16) / 255,
    parseInt(hexColor.substring(5, 7), 16) / 255
  ];

  const formattedColor = `color(display-p3 ${parsedColor[0].toFixed(2)} ${parsedColor[1].toFixed(2)} ${parsedColor[2].toFixed(2)})`;

  return formattedColor;
}

function generateVariablesP3(colorName: string, colorRanges: string[]): string {
  const rootVars: string[] = colorRanges.map((color, index) => {
    return `--${colorName}-${index + 1}: ${hexToP3(color)};\n`;
  });

  return rootVars.join('');
}

function hexToP3Alpha(hexColor: string, alpha: number): string {
  if (typeof hexColor !== 'string' || !hexColor.startsWith('#') || hexColor.length !== 7) {
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

function generateVariablesP3A(colorName: string, colorRanges: string[]) {
  const rootVars: string[] = colorRanges.map((color, index) => {
    const alpha: number = opacityValues[index];
    return `--${colorName}-A${index + 1}: ${hexToP3Alpha(color, alpha)};\n`;
  });

  return rootVars.join('');
}

function generateCSSVariablesP3(colorName: string, colorData: { ranges: string[] }) {
  const { ranges } = colorData;
  const rootVarsP3: string = generateVariablesP3(colorName, ranges);
  const rootVarsP3A: string = generateVariablesP3A(colorName, ranges);
  return `
@supports (color: color(display-p3 1 1 1)) and (color-gamut: p3) {
  :root {
  /* Display P3 */
${rootVarsP3}
  /* Display P3 Alpha */
${rootVarsP3A}
  }
}
`;
}

function generateCSS(colorPalettes: ColorPalettes) {
  const ranges = generateColorRanges(colorPalettes);

  Object.entries(ranges).forEach(([colorName, colorData]) => {
    const cssContent = combineCSSContent(colorName, colorData);
    writeCSSFiles(colorName, cssContent);
  });
}

function combineCSSContent(colorName: string, colorData: ColorData) {
  const cssContents: string[] = [
    generateCSSVariables(colorName, colorData),
    generateCSSVariablesP3(colorName, colorData)
  ];
  return cssContents.join("\n\n");
}

function writeCSSFiles(colorName: string, cssContent: string) {
  const fileName = `${colorName}.css`;
  fs.writeFileSync(`./dist/css-palettes/${fileName}`, cssContent, "utf-8");
  console.log(`${fileName} file generated successfully!`);
}

generateCSS(colorPalettes);
