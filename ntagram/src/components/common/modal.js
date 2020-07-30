import React, { Component } from 'react'
import M from 'materialize-css'

class Modal extends Component {
	componentDidMount() {
		const options = {
			onOpenStart: () => {
				console.log('Open Start')
			},
			onOpenEnd: () => {
				console.log('Open End')
			},
			onCloseStart: () => {
				console.log('Close Start')
			},
			onCloseEnd: () => {
				console.log('Close End')
			},
			inDuration: 250,
			outDuration: 250,
			opacity: 0.5,
			dismissible: false,
			startingTop: '4%',
			endingTop: '10%',
		}
		M.Modal.init(this.Modal, options)
	}

	render() {
		return (
			<div style={{ float: 'right' }}>
				<a
					className='waves-effect waves-light modal-trigger'
					data-target='modal1'
				>
					<i
						className='material-icons clickeable'
						style={{
							color: '#3C6E71',
							float: 'right',
							fontSize: '120%',
						}}
					>
						menu
					</i>
				</a>

				<div
					ref={(Modal) => {
						this.Modal = Modal
					}}
					id='modal1'
					className='modal'
					style={{ width: '30%', borderRadius: '10px' }}
				>
					{/* <div className="modal-content">
			<p style={{textAlign: 'center'}}>Are you sure you want to delete this post?</p>
		</div> */}
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<a
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
								color: 'red',
								fontWeight: 'bold',
							}}
							className='modal-close btn-flat'
						>
							Report as Inappropiate
						</a>
						<a
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
								color: 'red',
								fontWeight: 'bold',
							}}
							className='modal-close btn-flat'
						>
							Unfollow
						</a>
						<a
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
							}}
							className='modal-close btn-flat'
						>
							Go to post
						</a>
						<a
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
							}}
							className='modal-close btn-flat'
						>
							Share
						</a>
						<a
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
							}}
							className='modal-close btn-flat'
						>
							Copy link
						</a>
						<a
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
							}}
							onClick={() => {
								this.props.deletePost(this.props.item._id)
								console.log('Deleted')
							}}
							className='modal-close waves-effect waves-teal btn-flat'
						>
							Delete
						</a>
						<a
							style={{ width: '100%', textAlign: 'center' }}
							className='modal-close waves-effect btn-flat'
						>
							Cancel
						</a>
					</div>
				</div>
			</div>
		)
	}
}

export default Modal
