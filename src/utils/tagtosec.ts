export const MilToNorm = (milliseconds: number, alter: number = 0) => {
  const seconds = Math.floor(milliseconds / 1000);
  alter /= 1000;

  const hours = Math.floor(seconds / 3600);
  const min = Math.floor((seconds / 60) % 60);
  const sec = seconds % 60;

  let str = `${sec}`;

  if (Math.max(seconds, alter) >= 60) {
    str = `${min}:` + str;

    if (Math.max(seconds, alter) >= 3600) {
      str = `${hours}:` + str;
    }
  }

  return str;
};

export const TagToSeconds = (from: number, to: number) => {
  const toString = MilToNorm(to);
  const fromString = MilToNorm(from);

  if (toString == fromString) {
    return toString;
  }

  return `${fromString} - ${toString}`;
};
