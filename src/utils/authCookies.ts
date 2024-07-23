// import Cookies from "js-cookie";

export const GetAuthConfig = (contentType: string = "application/json") => {
  console.log(`VK ${btoa(window.location.search)}`)

  return {
    headers: {
      Authorization: `VK ${btoa(window.location.search)}`,
      "Content-Type": contentType,
    },
  };
};

export const GetCookies = () => {
  // const params = Cookies.get("fetchedParams");
  const params = localStorage.getItem("fetchedParams");

  if (!params) {
    UpdateCookies();
  }

  return `VK ${localStorage.getItem("fetchedParams")}`;
  // return `VK ${Cookies.get("fetchedParams")}`;
};

const UpdateCookies = () => {
  const HOUR = 3600;
  const lastFetch = +(localStorage.getItem("lastFetch") || 0);
  const now = new Date().getTime() / 1000;

  if (now - lastFetch < HOUR) return false;

  localStorage.setItem("fetchedParams", btoa(window.location.search))
  localStorage.setItem("lastFetch", JSON.stringify(now))

  // Cookies.set("fetchedParams", btoa(window.location.search), {
  //   expires: 1 / 24,
  // });
  // Cookies.set("lastFetch", now);

  return true;
};
