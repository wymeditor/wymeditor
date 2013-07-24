
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
WYMeditor.DocumentStructureManager = function(defaultRootContainer) {
    this.structureRules = WYMeditor.DocumentStructureManager.DEFAULTS;
    this.setDefaultRootContainer(defaultRootContainer);
};

jQuery.extend(WYMeditor.DocumentStructureManager, {
    // Only these containers are allowed as valid `defaultRootContainer`
    // options.
    VALID_DEFAULT_ROOT_CONTAINERS : [
        "p",
        "div"
    ],
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

        // Only these containers are allowed as a direct child of the body tag.
        // All other containers located there will be wrapped in the
        // `defaultRootContainer`, unless they're one of the tags in
        // `convertIfRoot`.
        validRootContainers: [
            'p',
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
WYMeditor.DocumentStructureManager.prototype.setDefaultRootContainer = function(
    defaultRootContainer
) {
    var containerIsValid,
        validContainers;

    if (this.structureRules.defaultRootContainer === defaultRootContainer) {
        // This is already our current configuration. No need to do the
        // work again.
        return;
    }

    // Make sure the new container is one of the valid options
    validContainers = WYMeditor.DocumentStructureManager.VALID_DEFAULT_ROOT_CONTAINERS;
    if (jQuery.inArray(defaultRootContainer, validContainers) === -1) {
        throw new Error(
            "a defaultRootContainer of '" +
            defaultRootContainer +
            "' is not supported"
        );
    }

    this.structureRules.defaultRootContainer = defaultRootContainer;

    // TODO: Actually do all of the switching required to move from p to div or
    // from div to p for the topLevelContainer
};
