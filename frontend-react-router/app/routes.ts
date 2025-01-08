import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("layout/authWrapper.tsx", [route("login", "routes/login.tsx")]),
] satisfies RouteConfig;
