import { useFetcher } from "react-router";
import type { Route } from "./+types/profile";
import { api } from "~/apiCalls";
import { useEffect } from "react";

export async function clientLoader({ params, request }: Route.LoaderArgs) {
  let profile = await api.getProfile(params.username);
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
  console.log("sent request to profile");
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const imageFetcher = useFetcher();

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
  }, [profile_img]);

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
            <strong>verified</strong>
          ) : (
            <strong>not verified</strong>
          )}
        </p>
      </div>
    </>
  );
}
