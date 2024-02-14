import React, { useState } from 'react';
import { injectIntl } from 'react-intl';

import { withNavigation } from '../../providers/navigation';
import { withStoreProvider } from '../../providers/StoreProvider';

function Infos(props){
    const infosTab = props.infosTab || [];

    return <div id="info" className="info">
            {infosTab.map(it => {
                return it;
            })}
        </div>
}

export default withStoreProvider(withNavigation(injectIntl(Infos)));