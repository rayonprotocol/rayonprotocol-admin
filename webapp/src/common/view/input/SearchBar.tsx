import React, { Component } from 'react';
import classNames from 'classnames';

// styles
import styles from './SearchBar.scss';

interface SearchBarProps {
  className?: string;
  onChangeSearchInput: (holderAddress: string) => void;
}

class SearchBar extends Component<SearchBarProps, {}> {
  render() {
    return (
      <div className={classNames(this.props.className, styles.searchBar)}>
        <input type={'text'} onChange={event => this.props.onChangeSearchInput(event.target.value)} />
      </div>
    );
  }
}

export default SearchBar;
