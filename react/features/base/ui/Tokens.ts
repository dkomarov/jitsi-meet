// Default color palette
export const colors = {
    error03: '#7A141F',
    error04: '#A21B29',
    error05: '#CB2233',
    error06: '#D83848',
    error08: '#F24D5F',

    primary01: '#00112D',
    primary02: '#00225A',
    primary03: '#003486',
    primary04: '#0045B3',
    primary05: '#0056E0',
    primary06: '#246FE5 !important',
    primary07: '#4687ED',
    primary08: '#99BBF3',
    primary09: '#CCDDF9',

    surface01: '#040404',
    surface02: '#141414',
    surface03: '#292929',
    surface04: '#3D3D3D',
    surface05: '#525252',
    surface06: '#666',
    surface07: '#858585',
    surface08: '#A3A3A3',
    surface09: '#C2C2C2',
    surface10: '#E0E0E0',
    surface11: '#FFF',

    success04: '#189B55',
    success05: '#1EC26A',

    warning05: '#F8AE1A',
    warning06: '#FFD600',

    support01: '#FF9B42',
    support02: '#F96E57',
    support03: '#DF486F',
    support04: '#B23683',
    support05: '#73348C',
    support06: '#6A50D3',
    support07: '#4380E2',
    support08: '#00A8B3',
    support09: '#2AA076'
};

// Mapping between the token used and the color
export const colorMap = {
    // ----- Surfaces -----

    // Default page background. If this changes, make sure to adapt the native side as well:
    //  - JitsiMeetView.m
    //  - JitsiMeetView.java
    uiBackground: 'surface01',

    // Container backgrounds
    ui01: 'surface02',
    ui02: 'surface03',
    ui03: 'ui02',
    ui04: 'surface05',
    ui05: 'ui01',
    ui06: 'ui03',
    ui07: 'surface08',
    ui08: 'ui21',
    ui09: 'ui08',
    ui10: 'ui04',

    // ----- Actions -----

    // Primary
    action01: 'action01',
    action01Hover: 'hover01',
    action01Active: 'active01',

    // Secondary
    action02: 'action02',
    action02Hover: 'hover02',
    action02Active: 'active02',

    // Destructive
    actionDanger: 'action03',
    actionDangerHover: 'hover03',
    actionDangerActive: 'active03',

    // Tertiary
    action03: 'transparent',
    action03Hover: 'hover05',
    action03Active: 'surface03',

    // Disabled
    disabled01: 'disabled01',

    // Focus
    focus01: 'focus01',

    // ----- Links -----

    link01: 'action01',
    link01Hover: 'hover07',
    link01Active: 'action04',

    // ----- Text -----

    // Primary
    text01: 'textColor01',

    // Secondary
    text02: 'textColor02',

    // Tertiary
    text03: 'ui03',

    // High-contrast
    text04: 'surface01',

    // Error
    textError: 'alertRed',

    // ----- Icons -----

    // Primary
    icon01: 'icon01',

    // Secondary
    icon02: 'ui21',

    // Tertiary
    icon03: 'icon07',

    // High-contrast
    icon04: 'surface01',

    // Error
    iconError: 'action03',

    // Normal
    iconNormal: 'action04',

    // Success
    iconSuccess: 'alertGreen',

    // Warning
    iconWarning: 'warning01',

    // ----- Forms -----

    field01: 'ui02',

    // ----- Feedback -----

    // Success
    success01: 'success05',
    success02: 'success01',

    // Warning
    warning01: 'warning01',
    warning02: 'warning06',

    // ----- Support -----

    support05: 'support05',
    support06: 'support06'
};

export const font = {
    weightRegular: 400,
    weightSemiBold: 600
};

export const shape = {
    borderRadius: 6,
    circleRadius: 50,
    boxShadow: 'inset 0px -1px 0px rgba(255, 255, 255, 0.15)'
};

export const spacing = [0, 4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128];

export const typography = {
    labelRegular: 'label01',

    labelBold: 'labelBold01',

    bodyShortRegularSmall: {
        fontSize: '0.625rem',
        lineHeight: '1rem',
        fontWeight: font.weightRegular,
        letterSpacing: 0
    },

    bodyShortRegular: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        fontWeight: font.weightRegular,
        letterSpacing: 0
    },

    bodyShortBold: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        fontWeight: font.weightSemiBold,
        letterSpacing: 0
    },

    bodyShortRegularLarge: {
        fontSize: '1rem',
        lineHeight: '1.375rem',
        fontWeight: font.weightRegular,
        letterSpacing: 0
    },

    bodyShortBoldLarge: {
        fontSize: '1rem',
        lineHeight: '1.375rem',
        fontWeight: font.weightSemiBold,
        letterSpacing: 0
    },

    bodyLongRegular: {
        fontSize: '0.875rem',
        lineHeight: '1.5rem',
        fontWeight: font.weightRegular,
        letterSpacing: 0
    },

    bodyLongRegularLarge: {
        fontSize: '1rem',
        lineHeight: '1.625rem',
        fontWeight: font.weightRegular,
        letterSpacing: 0
    },

    bodyLongBold: {
        fontSize: '0.875rem',
        lineHeight: '1.5rem',
        fontWeight: font.weightSemiBold,
        letterSpacing: 0
    },

    bodyLongBoldLarge: {
        fontSize: '1rem',
        lineHeight: '1.625rem',
        fontWeight: font.weightSemiBold,
        letterSpacing: 0
    },

    heading1: 'heading01',

    heading2: 'heading02',

    heading3: {
        fontSize: '2rem',
        lineHeight: '2.5rem',
        fontWeight: font.weightSemiBold,
        letterSpacing: 0
    },

    heading4: {
        fontSize: '1.75rem',
        lineHeight: '2.25rem',
        fontWeight: font.weightSemiBold,
        letterSpacing: 0
    },

    heading5: {
        fontSize: '1.25rem',
        lineHeight: '1.75rem',
        fontWeight: font.weightSemiBold,
        letterSpacing: 0
    },

    heading6: {
        fontSize: '1rem',
        lineHeight: '1.625rem',
        fontWeight: font.weightSemiBold,
        letterSpacing: 0
    }
};

export const breakpoints = {
    values: {
        '0': 0,
        '320': 320,
        '400': 400,
        '480': 480
    }
};
