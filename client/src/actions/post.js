import axios from 'axios';
import {
	GET_POSTS,
	POST_ERROR,
	UPDATE_LIKES,
	DELETE_POSTS,
	ADD_POSTS,
	GET_POST,
	ADD_COMMENTS,
	REMOVE_COMMENTS
} from './types';
import { setAlert } from './alert';


// Get all posts
export const getPosts = () => async dispatch => {
	try {
		const res = await axios.get('/api/posts');
		dispatch({
			type: GET_POSTS,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}
// Add like
export const addLike = postId => async dispatch => {
	try {
		const res = await axios.put(`/api/posts/like/${postId}`);
		dispatch({
			type: UPDATE_LIKES,
			payload: { postId, likes: res.data }
		})
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}
// Remove like
export const removeLike = postId => async dispatch => {
	try {
		const res = await axios.put(`/api/posts/unlike/${postId}`);
		dispatch({
			type: UPDATE_LIKES,
			payload: { postId, likes: res.data }
		})
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}

// DELETE POST
export const deletePost = postId => async dispatch => {
	try {
		await axios.delete(`/api/posts/${postId}`);
		dispatch({
			type: DELETE_POSTS,
			payload: postId
		})
		dispatch(setAlert('Post Removed', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}

// add POST
export const addPost = formData => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': "application/josn"
			}
		}
		const res = await axios.post(`/api/posts`, formData, config);
		dispatch({
			type: ADD_POSTS,
			payload: res.data
		})
		dispatch(setAlert('Post Added', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}


// Get post
export const getPost = id => async dispatch => {
	try {
		const res = await axios.get(`/api/posts/${id}`);
		dispatch({
			type: GET_POST,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}

// add comment
export const addComment = (postId, formData) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': "application/josn"
			}
		}
		const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);
		dispatch({
			type: ADD_COMMENTS,
			payload: res.data
		})
		dispatch(setAlert('Comment Added', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}
// delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
	try {
		const config = {
			headers: {
				'Content-Type': "application/josn"
			}
		}
		const res = await axios.delete(`/api/posts/comment/${postId}/${commentId}`, formData, config);
		dispatch({
			type: REMOVE_COMMENTS,
			payload: commentId
		})
		dispatch(setAlert('Comment Removed', 'success'));
	} catch (err) {
		dispatch({
			type: POST_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}