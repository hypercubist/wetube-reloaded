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
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", fakeUser, videos });
};
export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("upload video");
export const watch = (req, res) => {
  return res.render("watch", {
    pageTitle: `Watching`,
    fakeUser,
  });
};

export const getEdit = (req, res) => {
  return res.render("edit", {
    pageTitle: `Editing`,
    fakeUser,
  });
};
export const remove = (req, res) => res.send("remove video");

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/video/${id}`);
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
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      fakeUser,
      errorMessage: error._message,
    });
  }
};
