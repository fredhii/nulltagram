import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import M from 'materialize-css'

class OptionModal extends Component {
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
			dismissible: true,
			startingTop: '4%',
			endingTop: '10%',
		}
		M.Modal.init(this.Modal, options)
	}

	render() {
		return (
			/* ICON */
			<div style={{ float: 'right' }}>
				<Link
					to=''
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
				</Link>

				{/* MODAL */}
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
						<Link
							to=''
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
								color: 'red',
								fontWeight: 'bold',
							}}
							className='modal-close btn-flat'
							onClick={ () => { M.toast({ html: 'Feature not ready, Working on it...', classes: '#004d40 teal darken-4' }) }}
						>
							Report as Inappropiate
						</Link>
						<Link
							to=''
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
								color: 'red',
								fontWeight: 'bold',
							}}
							className='modal-close btn-flat'
							onClick={ () => { M.toast({ html: 'Feature not ready, Working on it...', classes: '#004d40 teal darken-4' }) }}
						>
							Unfollow
						</Link>
						<Link
							to=''
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
							}}
							className='modal-close btn-flat'
							onClick={ () => { M.toast({ html: 'Feature not ready, Working on it...', classes: '#004d40 teal darken-4' }) }}
						>
							Go to post
						</Link>
						<Link
							to=''
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
							}}
							className='modal-close btn-flat'
							onClick={ () => { M.toast({ html: 'Feature not ready, Working on it...', classes: '#004d40 teal darken-4' }) }}
						>
							Share
						</Link>
						<Link
							to=''
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
							}}
							className='modal-close btn-flat'
							onClick={ () => { M.toast({ html: 'Feature not ready, Working on it...', classes: '#004d40 teal darken-4' }) }}
						>
							Copy link
						</Link>
						<Link
							to=''
							style={{
								borderBottom: '1px solid #D9D9D9',
								width: '100%',
								textAlign: 'center',
							}}
							onClick={() => {
								/* TODO: Add a modal to confirm */
								console.log(this.props.item)
								/* this.props.deletePost(this.props.item) */
							}}
							className='modal-close waves-effect waves-teal btn-flat'
						>
							Delete
						</Link>
						<Link
							to=''
							style={{ width: '100%', textAlign: 'center' }}
							className='modal-close waves-effect btn-flat'
						>
							Cancel
						</Link>
					</div>
				</div>
			</div>
		)
	}
}

export default OptionModal
