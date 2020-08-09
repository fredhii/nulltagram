import React, { Component } from 'react'
import M from 'materialize-css'
import Loading from './Loading';


/**
 * Name: Modal
 * @id Modal name
 * @trigger Style who launch modal
 * @style Modal design
 * @content Modal content
 * Description: Displays a modal
 * In trigger do not forget to add data-target='id'
 */
class Modal extends Component {
    /* Modal Configuration */
    componentDidMount() {
        const options = {
          inDuration: 250,
          outDuration: 250,
          opacity: 0.5,
          dismissible: true,
          startingTop: '4%',
          endingTop: '20%'
        };
        M.Modal.init(this.Modal, options);
      }

    render() {
        return (
          <>
            {/* Modal trigger */}
            { this.props.trigger }

            <div ref={ Modal => { this.Modal = Modal; } }
                id={ this.props.id }
                className='modal'
                /* Modal style */
                style={
                    this.props.style
                    ? this.props.style
                    : { borderRadius: '10px' }
                }
            >
                {
                    /* Modal content */
                    !this.props.content
                    ? <Loading />
                    : this.props.content
                }
            </div>
          </>
        );
    }
}

export default Modal
