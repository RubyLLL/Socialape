import React from 'react'

import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'


export default ({ children, tip, onClick, btnClassName, tipClassName }) => (
    // HIGHLIGHT we don't include any logic here so we don't need return() and {}, instead we use ()
    <Tooltip className={tipClassName} title={tip}>
        <IconButton onClick={onClick} className={btnClassName}>
            {children}
        </IconButton>
    </Tooltip>
)
