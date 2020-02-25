import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment'


const PostItem = ({ auth, post: { _id, text, name, avatar, user, likes, comments, date } }) => (
	<div key={_id} class="post bg-white p-1 my-1">
		<div>
			<Link to={`/profile/${auth._id}`}>
				<img
					class="round-img"
					src={avatar}
					alt=""
				/>
				<h4>{name}</h4>
			</Link>
		</div>
		<div>
			<p class="my-1">{text}</p>
			<p class="post-date">
				Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
			</p>
			<button type="button" class="btn btn-light">
				<i class="fas fa-thumbs-up"></i>
				<span>{comments.length > 0 && (comments.length)}</span>
			</button>
			<button type="button" class="btn btn-light">
				<i class="fas fa-thumbs-down"></i>
			</button>
			<Link to={`/post/${_id}`} class="btn btn-primary">
				Discussion {' '} {comments.length > 0 && (<span class='comment-count'>{comments.length}</span>)}
			</Link>
			{!auth.loading && user === auth.user._id && (<button
				type="button"
				class="btn btn-danger"
			>
				<i class="fas fa-times"></i>
			</button>)}

		</div>
	</div>

)

PostItem.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
	auth: sate.auth
})
export default connect(mapStateToProps, {})(PostItem)
