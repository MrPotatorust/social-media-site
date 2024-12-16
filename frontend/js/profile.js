import { getProfile, getMedia } from "./apiCalls.js";

let params = new URLSearchParams(location.search);

let user = params.get("user");

async function profileGet() {
  const profileObj = await getProfile(user);
  console.log(profileObj);

  let profileElInnerHtml;

  if (typeof profileObj != "string") {
    const profilePicture = URL.createObjectURL(
      await getMedia(profileObj.profile_img.file_path)
    );

    profileElInnerHtml = `
    <h3>${profileObj.user.username}</h3>
    <p>
    <span>Last login: ${profileObj.user.last_login}<span/>
    <span>Date joined: ${profileObj.user.date_joined}<span/>
    <span>Language: ${profileObj.language}<span/>
    <p/>
    <img src=${profilePicture}></img>
    `;
  } else {
    profileElInnerHtml = `<h2>${profileObj}</h2>`;
  }

  document.querySelector("div.container").innerHTML = profileElInnerHtml;
}

profileGet();
