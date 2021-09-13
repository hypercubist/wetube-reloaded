const fakeUser = {
  username: "kdh",
  loggedIn: false,
};

const videos = [
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
];

export const trending = (req, res) => {
  res.render("home", { pageTitle: "Home", fakeUser, videos });
};
export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("upload video");
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("watch", {
    pageTitle: `Watching ${video.title}`,
    fakeUser,
    video,
  });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("edit", { pageTitle: `Editing ${video.title}`, fakeUser, video });
};
export const remove = (req, res) => res.send("remove video");

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/video/${id}`);
};
