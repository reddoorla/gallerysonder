import { writable } from 'svelte/store';
import { backgroundColorDefault } from './backgroundColorDefault';

export const backgroundColor = writable('#E4EEEA');

backgroundColorDefault.subscribe(value => {
    backgroundColor.set(value);
  });