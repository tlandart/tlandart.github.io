import {
  getImages,
  addImage,
  deleteImage,
  getComments,
  addComment,
  deleteComment,
  getImageComments,
} from "./api.mjs";

const COMMENTS_PER_PAGE = 10;

// IMAGE FUNCTIONALITY

// draws the current image (with currentImageIndex) and makes other visual checks
function drawImageGallery() {
  let imageArr = getImages();
  if (currentImageIndex === imageArr.length) currentImageIndex--;
  // draw or hide image gallery and comments
  if (imageArr.length === 0) {
    document.getElementById("current_image_panel").style.display = "none";
    document.getElementById("comment_panel").style.display = "none";
  } else {
    document.getElementById("current_image_panel").style.display = "flex";
    document.getElementById("comment_panel").style.display = "flex";

    // draw or hide left image button
    if (currentImageIndex === 0) {
      document.getElementById("current_image_panel_left").style.display =
        "none";
    } else {
      document.getElementById("current_image_panel_left").style.display =
        "inline";
    }

    // draw or hide right image button
    if (currentImageIndex === imageArr.length - 1) {
      document.getElementById("current_image_panel_right").style.display =
        "none";
    } else {
      document.getElementById("current_image_panel_right").style.display =
        "inline";
    }

    // draw image
    document.getElementById("current_image_title").innerHTML =
      imageArr[currentImageIndex].title;
    document.getElementById("current_image_author").innerHTML =
      "by " + imageArr[currentImageIndex].author;
    document.getElementById("current_image").src =
      imageArr[currentImageIndex].url;
    document.getElementById("current_image").alt =
      imageArr[currentImageIndex].title;

    drawComments(imageArr[currentImageIndex].imageId);
  }
}

let currentImageIndex = 0;
let currentCommentIndex = 0;
drawImageGallery();

// add-image form toggle button
let form = document.getElementById("image_form");
form.style.display = "none";
document
  .getElementById("image_form_toggle")
  .addEventListener("click", function (e) {
    if (form.style.display === "none") {
      form.style.display = "flex";
      e.target.innerHTML = "▲";
    } else {
      form.style.display = "none";
      e.target.innerHTML = "▼";
    }
  });

// add-image form submit button
form.addEventListener("submit", function (e) {
  // prevent from refreshing the page on submit
  e.preventDefault();
  // read form elements
  let title = document.getElementById("post_image_title").value;
  let author = document.getElementById("post_image_author").value;
  let url = document.getElementById("post_image_url").value;
  // clean form
  document.getElementById("image_form").reset();

  addImage(title, author, url);
  currentImageIndex = 0;
  drawImageGallery();
});

// left image button
document
  .getElementById("current_image_panel_left")
  .addEventListener("click", function (e) {
    currentImageIndex--;
    currentCommentIndex = 0;
    drawImageGallery();
  });

// right image button
document
  .getElementById("current_image_panel_right")
  .addEventListener("click", function (e) {
    currentImageIndex++;
    currentCommentIndex = 0;
    drawImageGallery();
  });

// delete image button
document
  .getElementById("current_image_panel_delete")
  .addEventListener("click", function (e) {
    deleteImage(getImages()[currentImageIndex].imageId);
    drawImageGallery();
  });

// COMMENT FUNCTIONALITY

// add comment form submit button
document
  .getElementById("comment_form")
  .addEventListener("submit", function (e) {
    // prevent from refreshing the page on submit
    e.preventDefault();
    // read form elements
    let author = document.getElementById("post_comment_author").value;
    let content = document.getElementById("post_comment_content").value;
    // clean form
    document.getElementById("comment_form").reset();

    addComment(getImages()[currentImageIndex].imageId, author, content);
    drawImageGallery();
  });

// draw a comment object
function drawComment(comment) {
  let commentElem = document.createElement("div");
  commentElem.className = "comment";
  // date-parsing code taken from https://stackoverflow.com/a/16714931
  commentElem.innerHTML = `
    <div class="comment_top">
        <h1>${comment.author}</h1>
        <p id="comment_date">${new Date(comment.date)
          .toISOString()
          .substring(0, 10)}</p>
    </div>
    <p>${comment.content}</p>
  `;

  // comment delete button
  let commentDeleteElem = document.createElement("button");
  commentDeleteElem.id = "comment_delete";
  commentDeleteElem.innerHTML = "Delete";
  commentDeleteElem.addEventListener("click", function (e) {
    deleteComment(comment.commentId);
    drawImageGallery();
  });

  commentElem
    .getElementsByClassName("comment_top")[0]
    .appendChild(commentDeleteElem);

  document.getElementById("comment_list").append(commentElem);
}

// draw all of an image's comments (and nav buttons)
function drawComments(imageId) {
  document.getElementById("comment_list").innerHTML = "";
  let imageComments = getImageComments(imageId);
  for (
    let i = currentCommentIndex;
    i < currentCommentIndex + COMMENTS_PER_PAGE && i < imageComments.length;
    i++
  ) {
    drawComment(imageComments[i]);
  }

  // draw or hide newer comment button
  if (currentCommentIndex === 0) {
    document.getElementById("comment_panel_newer").style.display = "none";
  } else {
    document.getElementById("comment_panel_newer").style.display = "inline";
  }

  // draw or hide older comment button
  if (currentCommentIndex + COMMENTS_PER_PAGE > imageComments.length - 1) {
    document.getElementById("comment_panel_older").style.display = "none";
  } else {
    document.getElementById("comment_panel_older").style.display = "inline";
  }

  // update comment section header
  document.getElementById("comment_header").innerHTML =
    imageComments.length + " Comments";
}

// newer comment button
document
  .getElementById("comment_panel_newer")
  .addEventListener("click", function (e) {
    currentCommentIndex -= COMMENTS_PER_PAGE;
    drawImageGallery();
  });

// older comment button
document
  .getElementById("comment_panel_older")
  .addEventListener("click", function (e) {
    currentCommentIndex += COMMENTS_PER_PAGE;
    drawImageGallery();
  });
