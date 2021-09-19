import User from "../models/User";

const fakeUser = {
  username: "kdh",
  loggedIn: false,
};

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Create Account", fakeUser });
};

export const postJoin = async (req, res) => {
  const pageTittle = "Join";
  const { name, username, email, password, location } = req.body;
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      fakeUser,
      errorMessage: "This username or email is already taken.",
    });
  }
  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  res.redirect("/login");
};

export const login = (req, res) => res.send("login");

export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see profile");
export const edit = (req, res) => res.send("edit user");
export const remove = (req, res) => res.send("remove user");
