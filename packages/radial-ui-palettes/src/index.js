import * as fs from "fs";
import tinycolor from "tinycolor2";

const colorData = {
  "gray": "FFFFFF",
  "tomato": "#FFFCFC",
  "red": "#FFFCFC",
	"ruby": "#FFFCFD",
  "pink": "#FFFCFE",
  "plum": "#FEFCFF",
  "purple": "#FEFCFE",
  "violet": "#FDFCFE",
  "iris": "#FDFDFF",
  "indigo": "#FDFDFE",
  "blue": "#FBFDFF",
  "cyan": "#fafdfe",
  "teal": "#FAFEFD",
  "jade": "#FBFEFD",
  "green": "#FBFEFC",
  "grass": "#FBFEFB",
  "bronze": "#FDFCFC",
  "gold": "#FDFDFC",
  "brown": "#FEFDFC",
  "orange": "#FEFCFB",
  "amber": "#FEFDFB",
  "yellow": "#FFFFEE",
  "lime": "#FCFDFA",
  "mint": "#F9FEFD",
  "sky": "#F9FEFF"
};

function getColorInfo(hexColor) {
  const rgbColor = tinycolor(hexColor).toRgb();
  return {
    rgb: `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`,
	rgb8: tinycolor(hexColor).toHex8String(),
	rgbObject: rgbColor,
  };
}

function colorDisplay(rgbColor) {
  const toPercentage = (component) => (component === 255 ? '1' : (component / 255).toFixed(3));
  const p3Color = `${toPercentage(rgbColor.r)} ${toPercentage(rgbColor.g)} ${toPercentage(rgbColor.b)}`;
  return p3Color;
}

/* function generateHexColorVariables(hexColor, color, steps = 12, darkenFactor = 1.1) {
  const baseColor = tinycolor(hexColor);
  let cssContent = '';

  for (let i = 0; i < steps; i++) {
    let factor = i === 10 ? 2 : darkenFactor;
    const nextColor = baseColor.darken(factor * i).saturate().toHexString();
    cssContent += `--${color}${i + 1}: ${nextColor};\n`;
  }

  return cssContent;
} */

function generateHexColorVariables(hexColor, color, steps = 12, darkenFactor = 1.1) {
  const baseColor = tinycolor(hexColor);
  let cssContent = '';

  for (let i = 0; i < steps; i++) {
    let modifiedColor = baseColor;
    let factor = i === 10 ? 2 : darkenFactor;
    if (color === 'gray') {
      modifiedColor = baseColor.darken((factor + 0.2) * i).saturate().greyscale();
    } else {
      modifiedColor = baseColor.darken(factor * i).saturate();
    }

    const nextColor = modifiedColor.toHexString();
    cssContent += `--${color}${i + 1}: ${nextColor};\n`;
  }

  return cssContent;
}


function generateHex8ColorVariables(hexColor, color, steps = 12, darkenFactor = 1.2) {
	// ${opacityValues.map((opacity, index) => `--${color}-a${index}: ${variants.HEX8};`).join('\n')}
  const baseColor = tinycolor(hexColor);
  let cssContent = '';

  for (let i = 0; i < steps; i++) {
    const nextColor = baseColor.darken(darkenFactor * i).toHex8String();
    cssContent += `--${color}-a${i + 1}: ${nextColor};\n`;
  }

  return cssContent;
}

function colorVariants(colorData) {
  const variants = {};

  Object.entries(colorData).forEach(([color, hex]) => {
    variants[color] = {
    	"A": `rgba(${getColorInfo(hex).rgb}`,
    	"P3A": `color(display-p3 ${colorDisplay(getColorInfo(hex).rgbObject)}`,
		"HEX": hex
    };
  });

  return variants;
}

const opacityValues = [".05", ".1", ".15", ".2", ".3", ".4", ".5", ".6", ".7", ".8", ".9", ".95"];

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
${opacityValues.map((opacity, index) => `--${color}-a${index + 1}: ${variants.A}, ${opacity});`).join('\n')}
}

:root, .light, .light-theme {
/* Hex */
${generateHexColorVariables(variants.HEX, color)}
/* Hex8 */
${generateHex8ColorVariables(variants.HEX, color)}
}

@supports (color: color(display-p3 1 1 1)) and (color-gamut: p3) {
  :root {
/* Color Gamut and Display P3 */
${opacityValues.map((opacity, index) => `--${color}${index + 1}: ${variants.P3A});`).join('\n')}

/* Color Gamut and Display P3 alpha */
${opacityValues.map((opacity, index) => `--${color}-a${index + 1}: ${variants.P3A} / ${opacity});`).join('\n')}
  }
}
`;
}

export {};