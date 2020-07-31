export const percentOfNumber = (number, percent) => number * (percent / 100);

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
