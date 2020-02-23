import axios from 'axios';
import {
	GET_PROFILE,
	GET_PROFILES,
	PROFILE_ERROR,
	UPDATE_PROFILE,
	ACCOUNT_DELETE,
	CLEAR_PROFILE
} from '../actions/types';
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
export const getProfiles = () => async dispatch => {
	dispatch({ type: CLEAR_PROFILE })
	try {
		const res = await axios.get('/api/profile');
		dispatch({
			type: GET_PROFILES,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
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


// Create or update profile
export const createProfile = (formData, history, edit = false) => async dispatch => {

	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const res = await axios.post('/api/profile', formData, config);
		dispatch({
			type: GET_PROFILE,
			payload: res.payload
		})
		dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created'));
		if (!edit) {
			history.push('/dashboard');
		}
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => {
				dispatch(setAlert(error.msg, 'danger'))
			});
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}

// Add Experience
export const addExperience = (formData, history) => async dispatch => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const res = await axios.post('/api/profile/experience', formData, config);
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.payload
		})
		dispatch(setAlert('Experience added ', 'Success'));

		history.push('/dashboard');

	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => {
				dispatch(setAlert(error.msg, 'danger'))
			});
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}

// Add Education
export const addEducation = (formData, history) => async dispatch => {
	try {
		const config = {
			headers: {
				"Content-Type": "application/json"
			}
		};
		const res = await axios.post('/api/profile/education', formData, config);
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.payload
		})
		dispatch(setAlert('Education added ', 'Success'));

		history.push('/dashboard');

	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach(error => {
				dispatch(setAlert(error.msg, 'danger'))
			});
		}
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}

// Delete Experience
export const deleteExperience = id => async dispatch => {
	try {

		const res = await axios.delete(`/api/profile/experience${id}`);
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.payload
		})
		dispatch(setAlert('Experience Removed', 'Success'));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}

// Delete Education
export const deleteEducation = id => async dispatch => {
	try {

		const res = await axios.delete(`/api/profile/education${id}`);
		dispatch({
			type: UPDATE_PROFILE,
			payload: res.payload
		})
		dispatch(setAlert('Education Removed', 'Success'));
	} catch (err) {
		dispatch({
			type: PROFILE_ERROR,
			payload: { msg: err.response.statusText, status: err.response.status }
		});
	}
}
// Delete Account and Profile
export const deleteAccount = async dispatch => {
	if (window.confirm('Are you sure? This will remove files')) {
		try {
			const res = await axios.delete(`/api/profile`);
			dispatch({ type: CLEAR_PROFILE });
			dispatch({ type: ACCOUNT_DELETE });

			dispatch(setAlert('Account permanantly removed', 'Success'));
		} catch (err) {
			dispatch({
				type: PROFILE_ERROR,
				payload: { msg: err.response.statusText, status: err.response.status }
			});
		}
	}
}