import generateUtilityClasses from '../utils/generate-utility-clasess';
import generateUtilityClass from '../utils/generate-utility-class';

export interface ButtonClasses {
  /** Class name applied to the root element. */
  root: string;
  /** State class applied to the root `button` element if `active={true}`. */
  active: string;
  /** State class applied to the root `button` element if `disabled={true}`. */
  disabled: string;
  /** State class applied to the root `button` element if `focusVisible={true}`. */
  focusVisible: string;
}

export type ButtonClassKey = keyof ButtonClasses;

export const buttonClasses: ButtonClasses = generateUtilityClasses('MuiButton', [
  'root',
  'active',
  'disabled',
  'focusVisible',
]);

export function getButtonUtilityClass(slot: string): string {
  return generateUtilityClass('MuiButton', slot);
}

