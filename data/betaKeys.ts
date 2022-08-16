type BetaKey = {
  issuer: string;
  date: string;
  valid: boolean;
  description: string;
};

export const betaKeys: Record<string, BetaKey> = {
  'M4S5AG3-M4573R-1NN0C3NC3': {
    issuer: 'connor',
    date: '2022-08-13',
    valid: true,
    description: 'Initial beta key for friends/family testing',
  },
};
