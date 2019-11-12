export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const percentOfNumber = (number, percent) => number * (percent / 100);
