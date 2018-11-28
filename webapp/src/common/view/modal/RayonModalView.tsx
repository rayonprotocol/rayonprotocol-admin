import React, { Component } from 'react';
import Modal from 'react-modal';

interface RayonModalViewProps {
  isModalOpen: boolean;
  onRequestClose: (...args: any[]) => void;
  wide?: boolean;
  narrow?: boolean;
}

class RayonModalView extends Component<RayonModalViewProps, {}> {
  render() {
    const { wide, narrow, isModalOpen, onRequestClose, children } = this.props;
    return (
      <Modal
        ariaHideApp={false}
        // className={styles.modal}
        isOpen={isModalOpen}
        onRequestClose={onRequestClose}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
          content: {
            minWidth: wide && '85%'
              || narrow && '35%'
              || '50%',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            borderRadius: '0px',
            border: '0px',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        {children}
      </Modal>
    );
  }
}

export default RayonModalView;
