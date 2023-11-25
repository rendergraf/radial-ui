import * as fs from "fs";
import tinycolor from "tinycolor2";

const colorData = {
  "blue": "#FBFDFF",
  "gray": "#FBFDFF",
  "red": "#FFF7F7",
  "green": "#FBFEFC",
  "yellow": "#FDFDF9",
};

function getColorInfo(hexColor) {
  const rgbColor = tinycolor(hexColor).toRgb();
  return {
    rgb: `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`,
    rgbObject: rgbColor,
  };
}

function colorDisplay(rgbColor) {
  const toPercentage = (component) => (component === 255 ? '1' : (component / 255).toFixed(3));
  const p3Color = `${toPercentage(rgbColor.r)} ${toPercentage(rgbColor.g)} ${toPercentage(rgbColor.b)}`;
  return p3Color;
}

function generateHexColorVariables(hexColor, color, steps = 12, darkenFactor = 1.2) {
  const baseColor = tinycolor(hexColor);
  let cssContent = '';

  for (let i = 0; i < steps; i++) {
    const nextColor = baseColor.darken(darkenFactor * i).toHexString();
    cssContent += `--${color}${i + 1}: ${nextColor};\n`;
  }

  return cssContent;
}

function colorVariants(colorData) {
  const variants = {};
  
  Object.entries(colorData).forEach(([color, hex]) => {
    variants[color] = {
      "A": `rgba(${getColorInfo(hex).rgb} `,
      "P3A": `color(display-p3 ${colorDisplay(getColorInfo(hex).rgbObject)} / `,
      "HEX": hex,
    };
  });

  return variants;
}

const opacityValues = ["0.05", "0.1", "0.15", "0.2", "0.3", "0.4", "0.5", "0.6", "0.7", "0.8", "0.9", "0.95"];

const colorVariantsObj = colorVariants(colorData);

generateAndWriteCSSFiles(colorVariantsObj, opacityValues);

function generateAndWriteCSSFiles(colorVariants, opacityValues) {
  Object.entries(colorVariants).forEach(([color, variants]) => {
    const cssContent = generateCSSVariables(variants, opacityValues, color);
    const fileName = `${color}.css`;
    fs.writeFileSync(`./dist/${fileName}`, cssContent, 'utf-8');
    console.log(`Archivo ${fileName} generado con éxito.`);
  });
}

function generateCSSVariables(variants, opacityValues, color) {
  return `
:root {
${opacityValues.map((opacity, index) => `--${color}-a${index + 1}: ${variants.A},${opacity});`).join('\n')}
}

:root, .light, .light-theme {
${generateHexColorVariables(variants.HEX, color)}
}

@supports (color: color(display-p3 1 1 1)) and (color-gamut: p3) {
  :root {
${opacityValues.map((opacity, index) => `--${color}-a${index + 1}: ${variants.P3A}${opacity});`).join('\n')}
  }
}
`;
}

export {};