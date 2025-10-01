// Minimal ambient declarations for yet-another-react-lightbox
// Placed in the project's `types/` folder so TypeScript will pick it up.
// These are intentionally loose (`any`) for plugin exports and advanced props —
// they provide enough typing to use the default Lightbox component
// and common props used in the codebase without pulling a full declaration.

declare module "yet-another-react-lightbox" {
  import * as React from "react";

  export type Slide = {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
    title?: string;
    [k: string]: any;
  };

  export interface LightboxProps {
    open?: boolean;
    close?: () => void;
    slides?: Slide[];
    index?: number;
    plugins?: any[];
    carousel?: any;
    controller?: any;
    zoom?: any;
    animation?: any;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    [k: string]: any;
  }

  const Lightbox: React.FC<LightboxProps>;
  export default Lightbox;

  // Common plugin placeholders (loose typing)
  export const Zoom: any;
  export const Thumbs: any;
  export const Captions: any;
  export const Slideshow: any;
  export const Inline: any;
  export const Keyboard: any;
  export const Rotate: any;

  // Re-export any other things as `any` so consumers can import them without TS errors
  export const __anyExports: any;
}
