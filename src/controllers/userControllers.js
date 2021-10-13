import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import flash from "express-flash";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "회원 가입" });
};

export const postJoin = async (req, res) => {
  const pageTitle = "회원 가입";
  const { name, username, email, password, password2, location } = req.body;
  if (password !== password2) {
    req.flash("error", "비밀번호가 서로 일치하지 않습니다.");
    return res.status(400).render("join", {
      pageTitle,
      //먼저 입력한 정보를 다시 페이지에 입력시켜두는 기능 추가
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    req.flash("error", "아이디 또는 이메일이 이미 사용중입니다.");
    return res.status(400).render("join", {
      pageTitle,
      //먼저 입력한 정보를 다시 페이지에 입력시켜두는 기능 추가
    });
  }
  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    req.flash("success", "가입이 완료되었습니다. 로그인하여 시작하세요:)");
    return res.redirect("/login");
  } catch (error) {
    req.flash("error", "가입에 실패했습니다. 다시 시도해주세요.");
    return res.status(400).render("join", {
      pageTitle,
    });
  }
};

export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "로그인" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "로그인";
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    req.flash("error", "아이디 또는 비밀번호가 잘못되었습니다.");
    return res.status(400).render("login", {
      pageTitle,
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    req.flash("error", "아이디 또는 비밀번호가 잘못되었습니다.");
    return res.status(400).render("login", {
      pageTitle,
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  req.flash("success", "로그인 성공 :)");
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseURL = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const URL = `${baseURL}?${params}`;
  return res.redirect(URL);
};
export const finishGithubLogin = async (req, res) => {
  const baseURL = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const URL = `${baseURL}?${params}`;
  const tokenRequest = await (
    await fetch(URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiURL = "https://api.github.com";
    const userData = await (
      await fetch(`${apiURL}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiURL}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      req.flash(
        "error",
        "이메일 정보를 불러오지 못했습니다:( 다시 로그인해주세요."
      );
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        avatarUrl: userData.avatar_url,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("success", "로그인 성공:)");
    return res.redirect("/");
  } else {
    req.flash("error", "로그인에 실패했습니다:( 다시 로그인 해주세요.");
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  res.render("edit-profile", { pageTitle: "프로필 업데이트" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  console.log(file);
  const updateUser = await User.findByIdAndUpdate(
    _id,
    {
      name,
      email,
      username,
      location,
      avatarUrl: file ? file.location : avatarUrl,
    },
    {
      new: true,
    }
  );
  req.session.user = updateUser;
  req.flash("success", "프로필이 업데이트되었습니다.");
  return res.redirect("/user/edit");
};

export const getChangePassword = (req, res) => {
  return res.render("change-password", { pageTitle: "Change password" });
};
export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    req.flash("error", "잘못된 비밀번호입니다.");
    return res.status(400).render("change-password", {
      pageTitle: "비밀번호 변경",
    });
  }
  if (newPassword !== newPassword2) {
    req.flash("error", "비밀번호가 서로 일치하지 않습니다.");
    return res.status(400).render("change-password", {
      pageTitle: "비밀번호 변경",
    });
  }
  user.password = newPassword;
  await user.save(); //save를 작동시켜야 bcrypt hash가 적용됨(userSchema.pre)
  //send notification
  req.flash("info", "비밀번호가 변경되었습니다. 다시 로그인 해주세요.");
  return res.redirect("/user/logout");
};

export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(400).render("404", { pageTitle: "User not found." });
  }
  return res.render("profile", { pageTitle: user.name, user });
};
