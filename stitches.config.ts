import {
  sage,
  sageDark,
  green,
  greenDark,
  teal,
  tealDark,
  red,
  redDark,
  amber,
  amberDark,
  blue,
  blueDark,
} from '@radix-ui/colors';
import { createStitches, PropertyValue } from '@stitches/react';

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      ...sage,
      ...green,
      ...teal,
      ...red,
      ...amber,
      ...blue,
    },
    space: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '16px',
      4: '24px',
      5: '32px',
      6: '48px',
      7: '64px',
      8: '96px',
      9: '128px',
    },
    fontSizes: {
      1: '10px',
      2: '12px',
      3: '14px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '32px',
      8: '40px',
      9: '48px',
      hero: '72px',
    },
    fonts: {
      copy: '"Inter", apple-system, sans-serif',
      heading: '"Inter", apple-system, sans-serif',
    },
    fontWeights: {
      thin: 100,
      light: 300,
      regular: 500,
      bold: 700,
    },
    lineHeights: {},
    letterSpacings: {},
    sizes: {},
    borderWidths: {
      none: '0',
      thin: '1px',
      medium: '2px',
    },
    borderStyles: {
      solid: 'solid',
      dashed: 'dashed',
    },
    radii: {
      none: '0',
      light: '4px',
      normal: '8px',
      round: '9999px',
    },
    shadows: {
      popover:
        'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;',
    },
    zIndices: {},
    transitions: {
      normal: '150ms all ease-in-out',
    },
  },
  media: {
    bp1: '(min-width: 480px)',
  },
  utils: {
    // Abbreviated margin properties
    m: (value: PropertyValue<'margin'>) => ({
      margin: value,
    }),
    mt: (value: PropertyValue<'margin'>) => ({
      marginTop: value,
    }),
    mr: (value: PropertyValue<'margin'>) => ({
      marginRight: value,
    }),
    mb: (value: PropertyValue<'margin'>) => ({
      marginBottom: value,
    }),
    ml: (value: PropertyValue<'margin'>) => ({
      marginLeft: value,
    }),
    mx: (value: PropertyValue<'margin'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: PropertyValue<'margin'>) => ({
      marginTop: value,
      marginBottom: value,
    }),
    // Abbreviated padding properties
    p: (value: PropertyValue<'padding'>) => ({
      padding: value,
    }),
    pt: (value: PropertyValue<'padding'>) => ({
      paddingTop: value,
    }),
    pr: (value: PropertyValue<'padding'>) => ({
      paddingRight: value,
    }),
    pb: (value: PropertyValue<'padding'>) => ({
      paddingBottom: value,
    }),
    pl: (value: PropertyValue<'padding'>) => ({
      paddingLeft: value,
    }),
    px: (value: PropertyValue<'padding'>) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: PropertyValue<'padding'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),

    // A property for applying width/height together
    square: (value: PropertyValue<'width' | 'height'>) => ({
      width: value,
      height: value,
    }),

    // A property to apply linear gradient
    linearGradient: (value: PropertyValue<'backgroundImage'>) => ({
      backgroundImage: `linear-gradient(${value})`,
    }),

    // An abbreviated property for border-radius
    br: (value: PropertyValue<'borderRadius'>) => ({
      borderRadius: value,
    }),
  },
});

export const darkTheme = createTheme({
  colors: {
    ...sageDark,
    ...greenDark,
    ...tealDark,
    ...redDark,
    ...amberDark,
    ...blueDark,
  },
});

export const globalStyles = globalCss({
  '@import':
    'https://fonts.googleapis.com/css2?family=Inter:wght@100;300;500;700&display=swap',
  body: {
    margin: '0',
    padding: '0',
    fontFamily: '$copy',
    fontWeight: '$light',
    fontSize: '$4',
    backgroundColor: '$sage1',
    color: '$sage12',
  },
  '*': {
    boxSizing: 'border-box',
  },
});
