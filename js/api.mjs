/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

let idTemp = JSON.parse(localStorage.getItem("idCounter"));
let idCounter = idTemp === null ? 0 : idTemp;

// retrieve all image objects
export function getImages() {
  let imageArr = JSON.parse(localStorage.getItem("imageArr"));
  return imageArr === null ? [] : imageArr;
}

// add an image to the gallery and return it's imageId
export function addImage(title, author, url) {
  let imageArr = getImages();
  let idNew = idCounter++;
  let newImage = {
    imageId: idNew,
    title: title,
    author: author,
    url: url,
    date: new Date(),
  };
  imageArr.unshift(newImage);
  localStorage.setItem("imageArr", JSON.stringify(imageArr));
  localStorage.setItem("idCounter", JSON.stringify(idNew));
  return idNew;
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
  let imageArr = getImages();
  imageArr.splice(
    imageArr.findIndex(function (image) {
      return image.imageId === imageId;
    }),
    1
  );
  // also delete all associated comments
  let newCommentArr = getComments().filter(function (comment) {
    return comment.imageId !== imageId;
  });
  localStorage.setItem("commentArr", JSON.stringify(newCommentArr));
  localStorage.setItem("imageArr", JSON.stringify(imageArr));
}

// retrieve all comment objects
export function getComments() {
  let commentArr = JSON.parse(localStorage.getItem("commentArr"));
  return commentArr === null ? [] : commentArr;
}

// retrieve all comment objects for an image
export function getImageComments(imageId) {
  let commentArr = getComments();
  return commentArr.filter(function (comment) {
    return comment.imageId === imageId;
  });
}

// add a comment to an image
export function addComment(imageId, author, content) {
  let commentArr = getComments();
  let idNew = idCounter++;
  let newComment = {
    commentId: idNew++,
    imageId: imageId,
    author: author,
    content: content,
    date: new Date(),
  };
  commentArr.unshift(newComment);
  localStorage.setItem("commentArr", JSON.stringify(commentArr));
  localStorage.setItem("idCounter", JSON.stringify(idNew));
}

// delete a comment to an image
export function deleteComment(commentId) {
  let commentArr = getComments();
  commentArr.splice(
    commentArr.findIndex(function (comment) {
      return comment.commentId === commentId;
    }),
    1
  );
  localStorage.setItem("commentArr", JSON.stringify(commentArr));
}
