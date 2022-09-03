type BetaKey = {
  issuer: string;
  date: string;
  valid: boolean;
  description: string;
};

export const betaKeys: Record<string, BetaKey> = {
  JOINTHEPOOL: {
    issuer: 'connor',
    date: '2022-09-02',
    valid: true,
    description: 'Initial beta key for friends/family testing',
  },
};
