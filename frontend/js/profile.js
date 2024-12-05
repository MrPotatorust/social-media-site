import { getProfile } from "./apiCalls.js";

let params = new URLSearchParams(location.search);

let user = 1

// console.log(user);

async function a() {
    console.log(await getProfile(user))
}

a()