import React, { StatelessComponent, Fragment } from 'react';
import RayonModalView, { RayonModalViewProps } from './RayonModalView';
import { TextButton } from '../button/TextButtons';

import styles from './ConfirmModalView.scss';

interface ConfirmModalViewProps extends RayonModalViewProps {
  confirmButtonTitle?: string;
  cacelButtonTitle?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

const ConfirmModalView: StatelessComponent<ConfirmModalViewProps> = props => {
  const {
    confirmButtonTitle, cacelButtonTitle, onConfirm, onCancel, children,
    ...rayonModalViewProps
  } = props;;
  return (
    <RayonModalView {...rayonModalViewProps}>
      {children}
      <div className={styles.buttonWrap}>
        {onCancel && <TextButton className={styles.button} bordered onClick={onCancel}>{cacelButtonTitle || 'Cancel'}</TextButton>}
        <TextButton className={styles.button} filled onClick={onConfirm}>{confirmButtonTitle || 'OK'}</TextButton>
      </div>
    </RayonModalView>
  );
};

export default ConfirmModalView;
