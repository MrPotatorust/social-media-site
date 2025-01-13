import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";
import { routeList } from "./routeList";

// const routes = () => {
//   let returnRoutes = [];
//   for (const key in routeList) {
//     const routeConfig = routeList[key];
//     if (routeConfig.path) {
//       returnRoutes.push(route(routeConfig.path, routeConfig.file));
//     } else {
//       returnRoutes.push(index(routeConfig.file));
//     }
//   }
//   return returnRoutes;
// };

const exportRoutes = [
  layout("layout/authWrapper.tsx", [
    layout("layout/mainLayout.tsx", [
      index("routes/home.tsx"),
      route("profile/:username", "routes/profile.tsx"),
      route("login", "routes/login.tsx"),
    ]),
  ]),
];

export default exportRoutes satisfies RouteConfig;
