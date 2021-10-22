const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".video__comment-delete");

const addComment = (text, id, ownerName) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";
  const span = document.createElement("span");
  span.innerText = ownerName;
  const div = document.createElement("div");
  div.innerText = ` ${text}`;
  const hr = document.createElement("hr");
  const div2 = document.createElement("div");
  div2.className = "video__comment-btn";
  const span2 = document.createElement("span");
  span2.innerText = "수정";
  span2.className = "video__comment-edit";
  const span3 = document.createElement("span");
  span3.innerText = "삭제";
  span3.className = "video__comment-delete";
  newComment.appendChild(span);
  newComment.appendChild(div);
  newComment.appendChild(hr);
  div2.appendChild(span2);
  div2.appendChild(span3);
  newComment.appendChild(div2);
  videoComments.prepend(newComment);
  span3.addEventListener("click", handleClickDelete);
};

const handleClickDelete = async (event) => {
  const videoId = videoContainer.dataset.id;
  const comment = event.target.parentNode.parentNode;
  const commentId = comment.dataset.id;

  const response = await fetch(`/api/video/${videoId}/comment`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });
  if (response.status === 201) {
    comment.remove();
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("input");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/video/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, ownerName } = await response.json();
    addComment(text, newCommentId, ownerName);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtn.length > 0) {
  for (i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", handleClickDelete);
  }
}
