import React, { Component } from 'react';

// view
import Container from 'common/view/container/Container';

// styles
import styles from './Footer.scss';

class Footer extends Component<{}, {}> {
  render() {
    return (
      <footer className={styles.footer}>
        <div className={styles.barUpperLine} />
        <div className={styles.footerOuter}>
          <Container className={styles.footerInner}>
            <div>
              <img src={require('../../asset/img/rayon-white-text.png')} />
            </div>
            <div>
              <p>hello@rayonprotocol.io</p>
              <p>© 2018 Rayonprotocol.io All Rights Reserved</p>
            </div>
          </Container>
        </div>
      </footer>
    );
  }
}

export default Footer;
