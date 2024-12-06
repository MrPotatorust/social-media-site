import { getProfile } from "./apiCalls.js";

let params = new URLSearchParams(location.search);

let user = params.get("user");


async function profileGet() {
  console.log(await getProfile(user));
}

profileGet();
