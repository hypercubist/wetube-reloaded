const fakeUser = {
  username: "kdh",
  loggedIn: false,
};

export const trending = (req, res) => {
  const videos = [
    {
      title: "1st video",
      rating: 4.5,
      comments: 2,
      createdAt: "5 hours ago",
      views: 321,
      id: 100001,
    },
    {
      title: "2nd video",
      rating: 4.5,
      comments: 2,
      createdAt: "5 hours ago",
      views: 321,
      id: 100001,
    },
    {
      title: "3rd video",
      rating: 4.5,
      comments: 2,
      createdAt: "5 hours ago",
      views: 321,
      id: 100001,
    },
  ];
  res.render("home", { pageTitle: "Home", fakeUser, videos });
};

export const search = (req, res) => res.send("search");
export const upload = (req, res) => res.send("upload video");
export const see = (req, res) => res.render("watch");
export const edit = (req, res) => res.send("edit video");
export const remove = (req, res) => res.send("remove video");
