#############
Custom Events
#############

WYMeditor allows plugin authors
to hook in to various editor internals
through a system of custom events.
By registering a handler on a specific event,
your plugin will be notified when something occurs
so that you can modify the default behavior.

All events are triggered against the ``textarea`` element
to which the wymeditor instance is bound.
On an editor object ``wym``,
this element is available as ``wym._element``.

****************
Available Events
****************

All events are present
as a member of ``WYMeditor.EVENTS``.

``postBlockMaybeCreated``
=========================

This event is fired when some user input occurred
that might have created a new block-level element.
Things that qualify include pressing the Enter key,
pasting content, inserting tables, etc.

This event fires **after** WYMeditor's default handling occurs.

``postIframeInitialization``
============================

This event is fired directly after
the appropriate browser-specific editor subclass's
``initIframe`` method finishes.
Hook in to this event if you need the iframe to exist,
which usually occurs **after** the editor's ``postInit`` fires.

