import React, { Component } from 'react';
import classNames from 'classnames';

// util
import StringUtil from '../../../../../shared/common/util/StringUtil';

// styles
import styles from './SearchBar.scss';

interface SearchBarProps {
  className?: string;
  onClickSearchButton: (target: string) => void;
}

interface SearchBarState {
  inputValue: string;
}

class SearchBar extends Component<SearchBarProps, SearchBarState> {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: undefined,
    };
  }

  onChangeSearchBar(inputValue: string) {
    this.setState({ inputValue });
  }

  onClickSearchButton() {
    if (StringUtil.isEmpty(this.state.inputValue)) return;
    this.props.onClickSearchButton(this.state.inputValue);
  }

  render() {
    return (
      <div className={classNames(this.props.className, styles.searchBar)}>
        <input type={'text'} onChange={event => this.onChangeSearchBar(event.target.value)} />
        <button type={'submit'} className={styles.searchButton} onClick={this.onClickSearchButton.bind(this)}>
          <i className={styles.icon} />
        </button>
      </div>
    );
  }
}

export default SearchBar;
