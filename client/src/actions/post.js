import axios from 'axios';
import {
	GET_POSTS,
	POST_ERROR
} from './types';
import { setAlert } from './alert';

// Get current users profile 
export const getCurrentProfile = () => async dispatch => {

	try {
		const res = await axios.get('/api/profile/me');
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}
// Get all profiles
export const getPosts = () => async dispatch => {
	try {
		const res = await axios.get('/api/post');
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

// Get profile by Id
export const getProfileById = userId => async dispatch => {

	try {
		const res = await axios.get(`/api/profile/user/${userId}`);
		dispatch({
			type: GET_PROFILE,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}

// Get githubRpos
export const getGithubRpos = username => async dispatch => {

	try {
		const res = await axios.get(`/api/profile/github/${username}`);
		dispatch({
			type: GET_REPOS,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}
