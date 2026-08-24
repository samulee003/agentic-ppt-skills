import React from 'react';

export interface DesignSystem {
  palette: {
    bg: string;
    text: string;
    accent: string;
    [key: string]: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  typeScale: {
    hero: number;
    body: number;
  };
  radius: number;
}

export interface SlideMeta {
  title: string;
  createdAt: string;
  theme?: string;
}

export type TransitionPhase = {
  keyframes: Keyframe[] | PropertyIndexedKeyframes;
  duration?: number;
  easing?: string;
  delay?: number;
};

export type SlideTransition = {
  duration: number;
  easing?: string;
  enter?: TransitionPhase;
  exit?: TransitionPhase;
  morph?: boolean | { duration?: number; easing?: string; delay?: number };
};

export interface Page extends React.FC {
  transition?: SlideTransition;
}

export const Steps: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div style={{ display: 'contents' }}>{children}</div>;
};

export const Step: React.FC<{ children: React.ReactNode; duration?: number }> = ({ children, duration = 240 }) => {
  return <div style={{ transition: `all ${duration}ms ease-out` }}>{children}</div>;
};

export const MorphElement: React.FC<{ id: string; children: React.ReactElement }> = ({ children }) => children;
export const useIsActivePage = () => true;
export const useSlidePageNumber = () => ({ current: 1, total: 18 });
