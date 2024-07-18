export const Normalize = (seconds: number, alter: number = 0) => {
  seconds = Math.round(seconds);
  const hours = Math.floor(seconds / 3600);
  const min = Math.floor((seconds / 60) % 60);
  const sec = seconds % 60;

  let str = `${min}:${sec < 10 ? "0" : ""}${sec}`;

  if (Math.max(seconds, alter) >= 3600) {
    str = `${hours}:` + str;
  }

  return str;
};

export const TagToNormalized = (from: number, to: number) => {
  const toString = Normalize(to);
  const fromString = Normalize(from);

  return `${fromString} - ${toString}`;
};
