// Copyright (C) 2017-2023 Smart code 203358507

const React = require('react');
const { Image, HorizontalNavBar, VerticalNavBar } = require('stremio/common');
const styles = require('./styles');

const TABS = [
    { id: 'board', label: 'Board', icon: 'home', href: '#/' },
    { id: 'discover', label: 'Discover', icon: 'discover', href: '#/discover' },
    { id: 'library', label: 'Library', icon: 'library', href: '#/library' },
    { id: 'addons', label: 'ADDONS', icon: 'addons', href: '#/addons' },
    { id: 'settings', label: 'SETTINGS', icon: 'settings', href: '#/settings' },
];

const NotFound = () => {
    return (
        <div className={styles['not-found-container']}>
            <HorizontalNavBar
                className={styles['nav-bar-horizontal']}
                title={'Page not found'}
                backButton={true}
                fullscreenButton={true}
                navMenu={true}
            />
            <div className={styles['not-found-vertical-window']}>
                <VerticalNavBar
                    className={styles['nav-bar-vertical']}
                    selected={'board'}
                    tabs={TABS}
                />
                <div className={styles['not-found-content']}>
                    <Image
                        className={styles['not-found-image']}
                        src={require('/images/empty.png')}
                        alt={' '}
                        draggable={false}
                    />
                    <div className={styles['not-found-label']}>Page not found!</div>
                </div>
            </div>
        </div>
    );
};

module.exports = NotFound;
