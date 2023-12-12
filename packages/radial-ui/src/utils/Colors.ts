const ButtonColorArray: string[] = ['inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'];

export const getColorStyle = (color: string): string => {
  if (typeof color === 'string' && ButtonColorArray.includes(color)) {
    return color;
  }
  return 'primary';
};