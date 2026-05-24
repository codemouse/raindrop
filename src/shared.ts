interface SharedState {
  lastTimestamp: number | null;
  counterStart: number | null;
}

export const shared: SharedState = {
  lastTimestamp: null,
  counterStart: null,
};
