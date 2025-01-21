import { getProfile, getMedia, sendEmailVerification } from "./apiCalls.js";

let params = new URLSearchParams(location.search);

let user = params.get("user");

const getVerifiedBtn = document.createElement("button");
getVerifiedBtn.innerText = "Get verified";
getVerifiedBtn.id = "email-verification-btn";
getVerifiedBtn.addEventListener("click", emailClickEvent);

const getVerified = document.createElement("label");
getVerified.innerText = "Temporary email verification button";
getVerified.appendChild(getVerifiedBtn);

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
    <span>Last login: ${profileObj.user.last_login}</span>
    <span>Date joined: ${profileObj.user.date_joined}</span>
    <span>Language: ${profileObj.language}</span>
    <p/>
    <img src=${profilePicture}></img>
    `;
  } else {
    profileElInnerHtml = `<h2>${profileObj}</h2>`;
  }

  document.querySelector("div.container").innerHTML = profileElInnerHtml;
  if (profileObj.email_verified === false) {
    document.querySelector(".container").appendChild(getVerified);
  }
}

//! REWORK temporary email verification button

// const verificationBtn = document.getElementById("email-verification-btn");
// verificationBtn.addEventListener("click", emailClickEvent);

async function emailClickEvent() {
  const response = await sendEmailVerification();
  if (response === 200) {
    getVerified.innerHTML += "<p>email succesfully sent</p>";
  } else {
    getVerified.innerHTML += "<p>something went wrong</p>";
  }
}

profileGet();
