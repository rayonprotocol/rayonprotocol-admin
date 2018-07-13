import React, { Component } from 'react';

// view
import DashboardContainer from 'common/view/container/DashboardContainer'

// styles
import styles from './EventLogView.scss';

class EventLogView extends Component<{}, {}> {
    render(){
        return(
            <DashboardContainer className={styles.eventLogView} title={'Event Log'}>

            </DashboardContainer>
        )
    }
}

export default EventLogView
