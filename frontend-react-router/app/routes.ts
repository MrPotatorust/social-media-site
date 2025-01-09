import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const exportRoutes = [
  layout("layout/authWrapper.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
  ]),
];

export default exportRoutes satisfies RouteConfig;
