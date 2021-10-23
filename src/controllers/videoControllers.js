import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "동영상 업로드" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;

  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].location,
      thumbUrl: thumb[0].location,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.flash("success", "업로드 성공:)");
    return res.redirect("/");
  } catch (error) {
    req.flash("error", "업로드에 실패했습니다:( 다시 시도해주세요.");
    return res.status(400).render("upload", {
      pageTitle: "동영상 업로드",
    });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "동영상을 찾을 수 없습니다." });
  }
  return res.render("watch", {
    pageTitle: video.title,
    video,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "동영상을 찾을 수 없습니다." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("info", "작성자가 아닌 경우 편집이 불가합니다.");
    return res.status(403).redirect("/");
  }
  return res.render("edit", {
    pageTitle: `동영상편집: ${video.title}`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "동영상을 찾을 수 없습니다." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("info", "작성자가 아닌 경우 편집이 불가합니다.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "동영상 편집이 완료되었습니다.");
  return res.redirect(`/video/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404", { pageTitle: "동영상을 찾을 수 없습니다." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("info", "작성자가 아닌 경우 삭제할 수 없습니다.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  req.flash("success", "동영상이 삭제되었습니다.");
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "검색", videos });
};

export const countView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    ownerName: user.username,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res
    .status(201)
    .json({ newCommentId: comment._id, ownerName: comment.ownerName });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    body: { commentId },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.findById(commentId);
  if (!comment) {
    return res.sendStatus(404);
  }
  if (String(user._id) !== String(comment.owner)) {
    return res.sendStatus(404);
  }
  const result = await Comment.deleteOne({ _id: commentId });
  if (result.deletedCount === 1) {
    return res.sendStatus(201);
  } else {
    return res.sendStatus(404);
  }
};
