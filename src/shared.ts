interface SharedState {
  lastTimestamp: number;
  counterStart: number;
}

export const shared: SharedState = {
  lastTimestamp: -1,
  counterStart: 0,
};
