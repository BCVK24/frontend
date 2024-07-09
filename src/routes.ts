import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  RoutesConfig,
} from "@vkontakte/vk-mini-apps-router";

export const routes = RoutesConfig.create([
  createRoot("default_root", [
    createView("default_view", [
      createPanel("home", "/", []),
      createPanel("recording", `/:recording_id`, [], ["recording_id"] as const),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
