import {
  createHashRouter,
  createPanel,
  createRoot,
  createView,
  createModal,
  RoutesConfig,
} from "@vkontakte/vk-mini-apps-router";

export const routes = RoutesConfig.create([
  createRoot("default_root", [
    createView("default_view", [
      createPanel("home", "/", [createModal("dnd", `/drop`, [])]),
      createPanel("recording", `/recording/:recording_id`, [], [
        "recording_id",
      ] as const),
    ]),
  ]),
]);

export const router = createHashRouter(routes.getRoutes());
