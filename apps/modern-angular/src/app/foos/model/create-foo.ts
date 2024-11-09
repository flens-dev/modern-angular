import type { CreateFoo } from '../public';

export const validateCreateFoo = (command: CreateFoo): CreateFoo => {
  if (command == null) {
    throw new Error('Invalid CreateFoo command!');
  }

  return command;
};
