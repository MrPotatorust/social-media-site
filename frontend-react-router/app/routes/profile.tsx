import { useFetcher, useOutletContext } from "react-router";
import type { Route } from "./+types/profile";
import { api } from "~/apiCalls";
import { useEffect, useState } from "react";
import type { OutletContextType } from "~/types";

export async function clientLoader({ params, request }: Route.LoaderArgs) {
  let profile = await api.getProfile(params.username);

  if (profile === "Profile is not setup") {
    return "setup your profile";
  }
  if (profile === "Profile is private") {
    return "profile is private";
  }
  if (profile === false) {
    return false;
  }
  if (request) {
    const url = request.url;
    const searchParams = new URLSearchParams(
      url.substr(url.lastIndexOf("?") + 1)
    );
    let imgPath = searchParams.get("imgPath");

    if (imgPath) {
      let profileImg = await api.getMedia(imgPath);
      if (profileImg instanceof Blob) {
        return { profileImg };
      }
      return null;
    }
  }
  return { profile };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  if (formData.get("action") === "sendVerificationEmail") {
    const response = await api.sendEmailVerification();
    if (response === 200) {
      return true;
    }
  }
  return false;
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const imageFetcher = useFetcher();
  const verificationEmailFetcher = useFetcher();
  const [verificationSent, setVerificationSent] = useState<boolean>(false);

  if (loaderData === "setup your profile"){
    return <h2>Setup your profile</h2>
  }
  if (loaderData === "profile is private") {
    return <h2 className=" text-4xl">Profile is private</h2>;
  }

  if (loaderData === false) {
    return <h2 className="text-red-600 text-4xl">Failed to get the profile</h2>;
  }
  const {
    country,
    description,
    email_verified,
    last_action,
    user,
    profile_img,
  } = loaderData?.profile;

  useEffect(() => {
    imageFetcher.submit({ imgPath: profile_img.file_path }, { method: "get" });
    if (verificationEmailFetcher.data === true && !verificationSent) {
      setVerificationSent(true);
    }
  }, [profile_img, verificationEmailFetcher.data]);

  function sendEmailVerification() {
    verificationEmailFetcher.submit(
      { action: "sendVerificationEmail" },
      { method: "post" }
    );
  }

  return (
    <>
      <h1>You are looking at the profile page</h1>
      <div>
        <h2>{user.username}</h2>
        {imageFetcher.state != "idle" ? (
          <p>Loading profile picture...</p>
        ) : imageFetcher.data?.profileImg ? (
          <img
            src={URL.createObjectURL(imageFetcher.data?.profileImg)}
            alt={profile_img.image_name}
          />
        ) : (
          <p className="text-red-700">Get of image failed</p>
        )}
        <h3>Bio:</h3>
        <p>{description}</p>
        <p>Country: {country.iso}</p>
        <p>
          Email verified:{" "}
          {email_verified ? (
            <strong className="text-green-800">verified</strong>
          ) : (
            <>
              <strong className="text-red-800">not verified</strong>{" "}
              {!verificationSent ? (
                <button onClick={sendEmailVerification}>Verify</button>
              ) : (
                <p className="text-green-700">Verification sent!</p>
              )}
            </>
          )}
        </p>
      </div>
    </>
  );
}
