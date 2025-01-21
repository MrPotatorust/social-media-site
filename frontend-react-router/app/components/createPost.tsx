import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

export default function CreatePost() {
  const fetcher = useFetcher();

  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [fetcher.state]);

  return (
    <fetcher.Form method="post" className="flex flex-col">
      <input
        type="textarea"
        className="border-solid border-2"
        placeholder="Share your thoughts"
        name="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
      />
      <input type="text" name="action" defaultValue="createPost" hidden />
      <button type="submit" className="border-solid border-2">
        Post
      </button>
    </fetcher.Form>
  );
}
