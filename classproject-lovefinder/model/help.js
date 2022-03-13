export const follow_check = (data, following_id, follower_id) => {
  if (data) {
    let result = data.split(",");
    const res = result.filter((word) => {
      let r = word.split(":");
      return parseInt(r[0]) === following_id && parseInt(r[1]) === follower_id;
    });
    if (res.length > 0) {
      return true;
    }
  } else {
    return false;
  }
};

export function like_check(data, like_id) {
  if (data) {
    let result = data.split(",");

    let res = result.filter((d) => parseInt(d) === parseInt(like_id));
    if (res.length > 0) {
      return true;
    }
  } else {
    return false;
  }
}
export const excerpt = (post) => {
  return post.slice(0, parseInt(process.env.POST_LENGTH)) + "...";
};
