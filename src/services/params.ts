import Cookies from "js-cookie";

export const GetAuthConfig = (contentType: string = "application/json") => {
  // console.log(GetCookies());
  return {
    headers: {
      Authorization: GetCookies(),
      "Content-Type": contentType,
    },
  };
};

export const GetCookies = () => {
  const params = Cookies.get("fetchedParams");

  if (!params) {
    UpdateCookies();
  }

  return `VK ${Cookies.get("fetchedParams")}`;
};

const UpdateCookies = () => {
  const HOUR = 3600;
  const lastFetch = Cookies.get("lastFetch") || 0;
  const now = new Date().getTime() / 1000;

  if (now - lastFetch < HOUR) return false;

  Cookies.set("fetchedParams", btoa(window.location.search), {
    expires: 1 / 24,
  });
  Cookies.set("lastFetch", now);

  return true;
};
