const navElements = {
  home: {
    html: `<li><a href="../html/index.html">home</a></li>`,
  },
  register: {
    html: `<li><a href="../html/register.html">login or register</a></li>`,
  },
  create: {
    html: `<li><a href="../html/create.html">create post</a></li>`,
  },
  read: {
    html: `<li><a href="../html/read.html">read posts</a></li>`,
  },
  logout: {
    html: `<li><a href="" id="logout-btn">Log out</a></li>`,
  },
};

// ! THIS LOOP WILL BE LATER USED FOR CONDITIONAL RENDERING OF THE HEADER
const navEL = document.getElementsByTagName("nav")[0];
const navUl = document.createElement("ul");
navUl.id = "nav-ul";

Object.values(navElements).forEach((item) => {
  navUl.innerHTML += item.html;
});

navEL.appendChild(navUl);
