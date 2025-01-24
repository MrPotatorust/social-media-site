import type { trendingHashtagsType } from "~/types";

export default function TredingHashtags(props: any) {
  const hashtags = props.hashtags;
  const hashtagsEls = hashtags.map((tag: trendingHashtagsType) => {
    return (
      <span key={tag.id}>
        {tag.mentions} {tag.tag}
      </span>
    );
  });
  return <div className=" float-right mr-60">{hashtagsEls}</div>;
}
