Using WYMeditor
===============

Introduction
------------

These guidelines will teach you why to use certain techniques when creating
content and how to work with them in WYMeditor. Following these will keep the
structure and meaning of your content correct - making it more flexible to
technologies like SEO1 (Search Engine Optimization), screen readers2, mobile
phone technologies, printers etc. Following these guidelines will also make
your content accessible to a wider range of people, with or without
disabilities

Guidelines
----------

**1. Use elements as intended**

    HTML is a so called markup language. It's purpose is to give the content
    meaning and structure, not visual effects. Therefore, it's important to use
    elements as intended to not break meaning, structure and compatibility to other
    technologies. If you want to style your content you've created with WYMeditor,
    you shall `learn to use CSS
    <http://www.456bereastreet.com/lab/developing_with_web_standards/full/#css>`_
    (Cascading Style Sheets).

    *1.1. Headings*

        Using a logical and proper heading structure is among one of the most
        important SEO techniques. Always use a correct hierarchy. Start with
        Heading 1, followed by Heading 2, Heading 3... etc. A proper heading
        structure will also help users to find what they are looking for, faster.

        To create a heading you simply place your marker where you want the heading
        to go and then select "Containers > Heading 1" for example.

    *1.2. Tables*

        Creating lean and accessible tables is a craft but WYMeditor makes it easy.
        Only use the Table element to arrange different kinds of data - time
        tables, statistics, member listings etc. Use the Table Header container to
        mark up headers properly. Doing this wrong will confuse users with screen
        readers when accessing tables, as headers aren't part of the data.

        To create a Table Header you simply place your marker in a table cell and
        select "Containers > Table Header".

        It's also good practice to give users the ability to do a quick overlook of
        the table's content by filling in a short description in the Caption field.
        You can do that in the dialog appearing when creating the table.

    *1.3. Lists*

        It's important to mark up lists of items the right way, using Ordered list
        or Unordered list. Doing this wrong makes it harder for users to overlook
        the content and will also confuse users with screen readers. Creating a
        list using Shift+Enter to separate items is therefore highly depreciated as
        both structure and meaning will break in the document.

        To create a list you simply use one of the two list buttons in WYMeditor's
        toolbar. Hit enter twice to "jump out of" a list.

    *1.4. Indent and outdent*

        The Indent and Outdent icons are only intended to create nested lists of
        list items (as described in 1.3). Place the marker on a list item and hit
        the Indent icon to make it go sub level. To undo this move or to make it go
        back one level, simply hit the Outdent icon.

    *1.5. Blockquotes*

        Mark up your quoted text by using the Blockquote container. Doing this the
        right way will help search engines and users with screen readers to
        understand your text and give it relevant meaning.

**2. Provide alternatives**

    *2.1. Alternative text*

        An alternative text string shall be accurate and equivalent in presenting
        the same content and function as the image. This also helps to identify the
        relevance and meaning of your image which improves SEO and accessibility
        for user with screen readers.

        You can enter the Alternative text in the image dialog, appearing when
        adding or editing an image. The only exception to leave the field empty is
        when your image is for decoration purpose only.

    *2.2. Title attribute*

        To provide additional information of a link or and image you can provide a
        Title text. This helps several other technologies to identify the relevance
        and meaning of your elements which improves SEO and accessibility for user
        with screen readers.

        You can enter the Title text in the image/link dialog, appearing when
        adding or editing an element.

**3. Write understandable**

Writing understandable is among one of the most important checkpoints in
creating accessible content. Unfortunately computers can't do anything about
this, yet. But with WYMeditor you have got the tools to make it down the right
way.

    *3.1. Descriptive headings*

        A heading element shall briefly describe the topic of the section it
        introduces making it easier to overlook both for all users. This will also
        improve the SEO aspects of your content.

    *3.2. Descriptive link texts*

        A link text shall be completely descriptive of its location, which makes it
        a lot easier to overlook and skim-read the content for all users. This will
        also improve the SEO aspects and the "link indexing" procedure for users
        with screen readers. "Click here" links are therefor highly depreciated.

Word References
---------------

**SEO (Search Engine Optimization)**
    "Search engine optimization" is a conception for everything that makes your
    content rank higher when using search engines like `Google <www.google.com>`_.

**Screen reader**
    A screen reader is a text-only web browser that dictates webpages' content
    to visually disabled peoples. In this text "screen readers" refers to all
    sorts of assistive and adoptive web technologies.
