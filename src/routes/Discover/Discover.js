const React = require('react');
const PropTypes = require('prop-types');
const classnames = require('classnames');
const Icon = require('stremio-icons/dom');
const { Button, MainNavBar, MetaItem, MetaPreview, Multiselect, ModalDialog, PaginationInput, useBinaryState } = require('stremio/common');
const useDiscover = require('./useDiscover');
const useSelectableInputs = require('./useSelectableInputs');
const styles = require('./styles');

const getMetaItemAtIndex = (catalog_resource, index) => {
    return index !== null &&
        isFinite(index) &&
        catalog_resource !== null &&
        catalog_resource.content.type === 'Ready' &&
        catalog_resource.content.content[index] ?
        catalog_resource.content.content[index]
        :
        null;
};

const Discover = ({ urlParams, queryParams }) => {
    const discover = useDiscover(urlParams, queryParams);
    const [selectInputs, paginationInput] = useSelectableInputs(discover);
    const [inputsModalOpen, openInputsModal, closeInputsModal] = useBinaryState(false);
    const [selectedMetaItem, setSelectedMetaItem] = React.useState(() => {
        return getMetaItemAtIndex(discover.catalog_resource, 0);
    });
    const metaItemsOnFocusCapture = React.useCallback((event) => {
        const metaItem = getMetaItemAtIndex(discover.catalog_resource, event.target.dataset.index);
        setSelectedMetaItem(metaItem);
    }, [discover.catalog_resource]);
    const metaItemOnClick = React.useCallback((event) => {
        const metaItem = getMetaItemAtIndex(discover.catalog_resource, event.currentTarget.dataset.index);
        if (metaItem !== selectedMetaItem) {
            event.preventDefault();
            event.currentTarget.focus();
        }
    }, [discover.catalog_resource, selectedMetaItem]);
    React.useLayoutEffect(() => {
        const metaItem = getMetaItemAtIndex(discover.catalog_resource, 0);
        setSelectedMetaItem(metaItem);
    }, [discover.catalog_resource]);
    React.useLayoutEffect(() => {
        closeInputsModal();
    }, [urlParams, queryParams]);
    return (
        <div className={styles['discover-container']}>
            <MainNavBar className={styles['nav-bar']} route={'discover'} />
            <div className={styles['discover-content']}>
                <div className={styles['selectable-inputs-container']}>
                    {selectInputs.map((selectInput, index) => (
                        <Multiselect
                            {...selectInput}
                            key={index}
                            modalSelects={false}
                            className={styles['select-input-container']}
                        />
                    ))}
                    <Button className={styles['filter-container']} title={'More filters'} onClick={openInputsModal}>
                        <Icon className={styles['filter-icon']} icon={'ic_filter'} />
                    </Button>
                    <div className={styles['spacing']} />
                    {
                        paginationInput !== null ?
                            <PaginationInput
                                {...paginationInput}
                                className={styles['pagination-input-container']}
                            />
                            :
                            null
                    }
                </div>
                <div className={styles['catalog-content-container']}>
                    {
                        discover.selectable.types.length === 0 && discover.catalog_resource === null ?
                            <div className={styles['message-container']}>
                                No catalogs
                            </div>
                            :
                            discover.catalog_resource === null ?
                                <div className={styles['message-container']}>
                                    No select
                                </div>
                                :
                                discover.catalog_resource.content.type === 'Err' ?
                                    <div className={styles['message-container']}>
                                        Catalog Error
                                    </div>
                                    :
                                    discover.catalog_resource.content.type === 'Loading' ?
                                        <div className={styles['message-container']}>
                                            Loading
                                        </div>
                                        :
                                        <div className={styles['meta-items-container']} onFocusCapture={metaItemsOnFocusCapture}>
                                            {discover.catalog_resource.content.content.map((metaItem, index) => (
                                                <MetaItem
                                                    key={index}
                                                    className={classnames(styles['meta-item'], { 'selected': selectedMetaItem === metaItem })}
                                                    type={metaItem.type}
                                                    name={metaItem.name}
                                                    poster={metaItem.poster}
                                                    posterShape={metaItem.posterShape}
                                                    href={metaItem.href}
                                                    data-index={index}
                                                    onClick={metaItemOnClick}
                                                />
                                            ))}
                                        </div>
                    }
                </div>
                {
                    selectedMetaItem !== null ?
                        <MetaPreview
                            className={styles['meta-preview-container']}
                            compact={true}
                            name={selectedMetaItem.name}
                            logo={selectedMetaItem.logo}
                            background={selectedMetaItem.poster}
                            runtime={selectedMetaItem.runtime}
                            releaseInfo={selectedMetaItem.releaseInfo}
                            released={selectedMetaItem.released}
                            description={selectedMetaItem.description}
                            trailer={selectedMetaItem.trailer}
                        />
                        :
                        <div className={styles['meta-preview-container']} />
                }
            </div>
            {
                inputsModalOpen ?
                    <ModalDialog title={'Select inputs'} className={styles['selectable-inputs-modal-container']} onCloseRequest={() => closeInputsModal()}>
                        {selectInputs.map((selectInput, index) => (
                            <Multiselect
                                {...selectInput}
                                key={index}
                                modalSelects={true}
                            />
                        ))}
                    </ModalDialog>
                    :
                    null
            }
        </div>
    );
};

Discover.propTypes = {
    urlParams: PropTypes.exact({
        transportUrl: PropTypes.string,
        type: PropTypes.string,
        catalogId: PropTypes.string
    }),
    queryParams: PropTypes.instanceOf(URLSearchParams)
};

module.exports = Discover;
