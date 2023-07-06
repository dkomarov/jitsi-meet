import React from 'react';
import { GlobalStyles as MUIGlobalStyles } from 'tss-react';
import { useStyles } from 'tss-react/mui';

import { commonStyles, getGlobalStyles } from '../constants';

/**
 * A component generating all the global styles.
 *
 * @returns {void}
 */
function GlobalStyles() {
    const { theme } = useStyles();

    return (<MUIGlobalStyles
        styles = {{
            ...commonStyles(theme),
            ...getGlobalStyles(theme)
        }} />);
//     return (
//         <MUIGlobalStyles
//             styles = {
//                 commonStyles(theme)
//             } />
//     );
// >>>>>>> f71f6d9a0d68cf7210da9e0c5bc1b2895cc6b85c
}

export default GlobalStyles;
