import React, { useState } from "react";
import Constants from "./utilities/Constant";
import PostCreateForm from "./components/PostCreateForm";
import PostUpdateForm from "./components/PostUpdateForm";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [showingCreateNewPostFrom, setShowingCreateNewPostForm] = useState(false);
  const [postCurrentlyBeingUpdated, setPostCurrentlyBeingUpdated] = useState(null);

  function getPosts() {
    const url = Constants.API_URL_GET_ALL_POSTS;
    fetch(url, {
      method: 'Get'
    })
      .then(response => response.json())
      .then(postsFromServer => {
        setPosts(postsFromServer);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  function deletePost(postId) {
    const url = `${Constants.API_URL_DELETE_POST_BY_ID}/${postId}`;
    fetch(url, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(responseFromServer => {
        console.log(responseFromServer);
        onPostDeleted(postId);
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  }

  return (
    <div className="container">
      <div className="row min-vh-100">
        <div className="col d-flex flex-column justify-content-center align-items-center">

          {(showingCreateNewPostFrom === false && postCurrentlyBeingUpdated === null) && (
            <div>
              <h1>Asp .Net Core React Practice</h1>
              <div className="mt-5">
                <button onClick={getPosts} className="btn btn-dark btn-lg w-100">Get Posts from server</button>
                <button onClick={() => setShowingCreateNewPostForm(true)} className="btn btn-secondary btn-lg w-100 mt-4">Create Post</button>
              </div>
            </div>
          )}


          {(posts.length > 0 && showingCreateNewPostFrom === false && postCurrentlyBeingUpdated === null) && renderPostsTable()}

          {showingCreateNewPostFrom && <PostCreateForm onPostCreated={onPostCreated} />}
          {postCurrentlyBeingUpdated !== null && <PostUpdateForm post={postCurrentlyBeingUpdated} onPostUpdated={onPostUpdated} />}

        </div>
      </div>
    </div>
  );

  function renderPostsTable() {
    return (
      <div className="table-responsive mt-5">
        <table className="table table-border border-dark">
          <thead>
            <tr>
              <th scope="col">PostId (Pk)</th>
              <th scope="col">Title</th>
              <th scope="col">Content</th>
              <th scope="col">CRUD  Operations</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.postId}>
                <th scope="row">{post.postId}</th>
                <td>{post.title}</td>
                <td>{post.content}</td>
                <td>
                  <button onClick={() => setPostCurrentlyBeingUpdated(post)} className="btn btn-dark btn-lg mx-3 my-3">Update</button>
                  <button onClick={() => { if (window.confirm(`Are you sure you want to delete the post titled "${post.title}"`)) deletePost(post.postId) }} className="btn btn-secondary btn-lg">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => setPosts([])} className="btn btn-dark btn-lg w-100">Empty React post array</button>
      </div>
    )
  }

  function onPostCreated(createdPost) {
    setShowingCreateNewPostForm(false);

    if (createdPost === null) {
      return;
    }

    alert(`Post created successfully. After clicking Ok, your new ost titled "${createdPost.title}" will show up in the table below.`)
    getPosts();
  }

  function onPostUpdated(updatePost) {
    setPostCurrentlyBeingUpdated(null);

    if (updatePost === null) {
      return;
    }
    let postsCopy = [...posts];
    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === updatePost.postId) {
        return true;
      }
    });
    if (index !== -1) {
      postsCopy[index] = updatePost;
    }

    setPosts(postsCopy);
    alert(`Post with title "${updatePost.title}" successfully updated.`);
  }

  function onPostDeleted(deletePostPostId) {

    let postsCopy = [...posts];
    const index = postsCopy.findIndex((postsCopyPost, currentIndex) => {
      if (postsCopyPost.postId === deletePostPostId) {
        return true;
      }
    });
    if (index !== -1) {
      postsCopy.splice(index, 1);
    }

    setPosts(postsCopy);
    alert(`Post Deleted Successfully.`);
  }

}


