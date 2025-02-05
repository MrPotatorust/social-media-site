import { useFetcher, useOutletContext, Link } from "react-router";
import type { Route } from "./+types/profile";
import { api } from "~/apiCalls";
import { useEffect, useState } from "react";
import type { OutletContextType } from "~/types";

//! this code is a copy of the code from profileSetup.tsx
export async function clientLoader({ params, request }: Route.LoaderArgs) {
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

  let profile;

  if (params.username) {
    profile = await api.getProfile(params.username);
  } else if (typeof localStorage.getItem("username") === "string") {
    profile = await api.getProfile(localStorage.getItem("username") as string);
  } else {
    profile = await api.getProfile("&&null");
  }

  if (profile.error === "Profile is not setup") {
    return { error: "profile is not setup", data: profile.data };
  }
  if (profile.error === "Profile is private") {
    return { error: "profile is private" };
  }
  if (profile === false) {
    return { error: "something went wrong" };
  }
  return { data: profile.data };
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
  const editProfileFetcher = useFetcher();
  const [verificationSent, setVerificationSent] = useState<boolean>(false);

  const {
    country,
    description,
    email_verified,
    last_action,
    user,
    profile_img,
  } = loaderData?.data;

  useEffect(() => {
    imageFetcher.submit({ imgPath: profile_img.file_path }, { method: "get" });
  }, [profile_img]);

  useEffect(() => {
    if (verificationEmailFetcher.data === true && !verificationSent) {
      setVerificationSent(true);
    }
  }, [verificationEmailFetcher.data]);

  function sendEmailVerification() {
    verificationEmailFetcher.submit(
      { action: "sendVerificationEmail" },
      { method: "post" }
    );
  }

  if (loaderData?.error === "profile is not setup") {
    return (
      <>
        <h2 className="text-orange-600 font-bold">
          Your profile isnt setup yet so for other people its private by default
        </h2>
        <editProfileFetcher.Form>
          <input type="text" defaultValue={user.username} />
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
          <input type="text" defaultValue={description} />
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
        </editProfileFetcher.Form>
      </>
    );
  }
  if (loaderData?.error === "profile is private") {
    return <h2 className=" text-4xl">Profile is private</h2>;
  }

  if (loaderData?.error === "something went wrong") {
    return <h2 className="text-red-600 text-4xl">Failed to get the profile</h2>;
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
