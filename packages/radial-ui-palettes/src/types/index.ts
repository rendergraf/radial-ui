export interface ColorPalettes {
  [key: string]: string;
}

export interface OpacityValues extends Array<number> {}

export interface ColorRange {
  ranges: string[];
}

export interface ColorRanges {
  [colorName: string]: ColorRange;
}

export interface ColorData {
  ranges: string[];
}