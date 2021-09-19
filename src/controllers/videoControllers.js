import Video from "../models/Video";

const fakeUser = {
  username: "kdh",
  loggedIn: false,
};

/*const videos = [
  {
    title: "1st video",
    rating: 4.5,
    comments: 2,
    createdAt: "5 hours ago",
    views: 321,
    id: 1,
  },
  {
    title: "2nd video",
    rating: 4.5,
    comments: 2,
    createdAt: "5 hours ago",
    views: 321,
    id: 2,
  },
  {
    title: "3rd video",
    rating: 4.5,
    comments: 2,
    createdAt: "5 hours ago",
    views: 321,
    id: 3,
  },
];*/

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", fakeUser, videos });
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video", fakeUser });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      fakeUser,
      errorMessage: error._message,
    });
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", {
    pageTitle: video.title,
    fakeUser,
    video,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render("edit", {
    pageTitle: `Edit ${video.title}`,
    fakeUser,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/video/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
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
    });
  }
  return res.render("search", { pageTitle: "Search", fakeUser, videos });
};
