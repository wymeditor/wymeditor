/*jslint maxlen: 90 */
/* global -$ */
"use strict";

/**
 * WYMeditor.DocumentStructureManager
 * ==================================
 *
 * This manager controls the rules for the subset of HTML that WYMeditor will
 * allow the user to create. For technical users, there are justifiable reasons
 * to use any in-spec HTML, but for users of WYMeditor (not implementors), the
 * goal is make it intuitive for them to create the structured markup that will
 * fit their needs.
 *
 * For example, while it's valid HTML to have a mix
 * of DIV and P tags at the top level of a document, in practice, this is
 * confusing for non-technical users. The DocumentStructureManager allows the
 * WYMeditor implementor to standardize on P tags in the root of the document,
 * which will automatically convert DIV tags in the root to P tags.
 *
 */
WYMeditor.DocumentStructureManager = function (wym, defaultRootContainer) {
    var dsm = this;
    dsm._wym = wym;
    dsm.structureRules = WYMeditor.DocumentStructureManager.DEFAULTS;
    dsm.setDefaultRootContainer(defaultRootContainer);
};

jQuery.extend(WYMeditor.DocumentStructureManager, {
    // Only these containers are allowed as valid `defaultRootContainer`
    // options.
    VALID_DEFAULT_ROOT_CONTAINERS : [
        "p",
        "div"
    ],

    // Cooresponding titles for use in the containers panel for the valid
    // default root containers
    DEFAULT_ROOT_CONTAINER_TITLES : {
        p: "Paragraph",
        div: "Division"
    },

    // These containers prevent the user from using up/down/enter/backspace
    // to move above or below them, thus effectively blocking the creation
    // of new blocks. We must use temporary spacer elements to correct this
    // while the document is being edited.
    CONTAINERS_BLOCKING_NAVIGATION : ["table", "blockquote", "pre"],


    DEFAULTS : {
        // By default, this container will be used for all root contents. This
        // defines the container used when "enter" is pressed from the root and
        // also which container wraps or replaces containers found at the root
        // that aren't allowed. Only
        // `DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS` are allowed
        // here. Whichever you choose, the VALID_DEFAULT_ROOT_CONTAINERS will
        // be automatically converted when found at the top level of your
        // document.
        defaultRootContainer: 'p',

        // These containers cannot be used as root containers. This includes
        // any default root containers that are not the chosen default root
        // container. By default, this is set to the list of valid root
        // containers that are not the defaultRootContainer.
        notValidRootContainers: ['div'],

        // Only these containers are allowed as a direct child of the body tag.
        // All other containers located there will be wrapped in the
        // `defaultRootContainer`, unless they're one of the tags in
        // `convertIfRoot`.
        validRootContainers: [
            'p',
            'div',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'pre',
            'blockquote',
            'table',
            'ol',
            'ul'
        ],

        // If these tags are found in the root, they'll be converted to the
        // `defaultRootContainer` container instead of the default of being
        // wrapped.
        convertIfRootContainers: [
            'div'
        ],

        // The elements that are allowed to be turned in to lists.
        validListConversionTargetContainers: [
            "p",
            "div",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "pre",
            "blockquote",
            "td",
            "th"
        ],

        // For most block elements, the default behavior when a user attempts
        // to convert it to a list is to convert that block to a ol/ul and wrap
        // the contents in an li. For containers in `wrapContentsInList`,
        // instead of converting the container, we should just wrap the
        // contents of the container in a ul/ol + li.
        wrapContentsInList: [
            'td',
            'th'
        ]
    }
});

/**
 * Set the default container created/used in the root.
 *
 * @param defaultRootContainer String A string representation of the tag to
 * use.
 */
WYMeditor.DocumentStructureManager.prototype.setDefaultRootContainer = function
(
    defaultRootContainer
) {
    var dsm = this,
        validContainers,
        index,
        DSManager;

    if (dsm.structureRules.defaultRootContainer === defaultRootContainer) {
        // This is already our current configuration. No need to do the
        // work again.
        return;
    }

    // Make sure the new container is one of the valid options
    DSManager = WYMeditor.DocumentStructureManager;
    validContainers = DSManager.VALID_DEFAULT_ROOT_CONTAINERS;
    index = jQuery.inArray(defaultRootContainer, validContainers);
    if (index === -1) {
        throw new Error(
            "a defaultRootContainer of '" +
            defaultRootContainer +
            "' is not supported"
        );
    }

    dsm.structureRules.defaultRootContainer = defaultRootContainer;

    // No other possible option for default root containers is valid expect for
    // the one choosen default root container
    dsm.structureRules.notValidRootContainers =
        WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS;
    dsm.structureRules.notValidRootContainers.splice(index, 1);

    dsm._adjustDefaultRootContainerUI();

    // TODO: Actually do all of the switching required to move from p to div or
    // from div to p for the topLevelContainer
};

/**
    _adjustDefaultRootContainerUI
    =============================

    Adds a new link for the default root container to the containers panel in
    the editor if needed, and removes any other links for valid default root
    containers form the containers panel besides the link for the chosen
    default root container.
*/
WYMeditor.DocumentStructureManager.prototype._adjustDefaultRootContainerUI = function () {
    var dsm = this,
        wym = dsm._wym,
        defaultRootContainer = dsm.structureRules.defaultRootContainer,
        $containerItems,
        $containerLink,
        $newContainerItem,
        containerName,
        newContainerLinkNeeded,
        newContainerLinkHtml,
        i,
        DSManager;

    $containerItems = jQuery(wym._box).find(wym._options.containersSelector)
                                      .find('li');
    newContainerLinkNeeded = true;

    // Remove container links for any other valid default root container from
    // the containers panel besides the link for the chosen default root
    // container
    for (i = 0; i < $containerItems.length; ++i) {
        $containerLink = $containerItems.eq(i).find('a');
        containerName = $containerLink.attr('name').toLowerCase();
        if (jQuery.inArray(containerName,
                           dsm.structureRules.notValidRootContainers) > -1) {
            $containerItems.eq(i).remove();
        }
        if (containerName === defaultRootContainer) {
            newContainerLinkNeeded = false;
        }
    }

    // Add new link for the default root container to the containers panel if
    // needed
    if (newContainerLinkNeeded) {
        newContainerLinkHtml = wym._options.containersItemHtml;
        newContainerLinkHtml = WYMeditor.Helper.replaceAllInStr(
            newContainerLinkHtml,
            WYMeditor.CONTAINER_NAME,
            defaultRootContainer.toUpperCase()
        );
        DSManager = WYMeditor.DocumentStructureManager;
        newContainerLinkHtml = WYMeditor.Helper.replaceAllInStr(
            newContainerLinkHtml,
            WYMeditor.CONTAINER_TITLE,
            DSManager.DEFAULT_ROOT_CONTAINER_TITLES[defaultRootContainer]
        );
        newContainerLinkHtml = WYMeditor.Helper.replaceAllInStr(
            newContainerLinkHtml,
            WYMeditor.CONTAINER_CLASS,
            "wym_containers_" + defaultRootContainer
        );
        $newContainerItem = jQuery(newContainerLinkHtml);
        $containerItems = jQuery(wym._box).find(wym._options.containersSelector)
                                          .find('li');
        $containerItems.eq(0).before($newContainerItem);

        // Bind click event for the new link
        $newContainerItem.find('a').click(function () {
            var button = this;
            wym.setRootContainer(jQuery(button).attr(WYMeditor.NAME));
            return false;
        });
    }
};

