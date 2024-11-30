import { fromEvent, of, pipe, takeUntil } from 'rxjs';

export const takeUntilAborted = (signal: AbortSignal) => {
  const aborted = signal.aborted ? of(true) : fromEvent(signal, 'abort');
  return pipe(takeUntil(aborted));
};
