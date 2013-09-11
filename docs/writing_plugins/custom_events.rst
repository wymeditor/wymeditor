#############
Custom Events
#############

WYMeditor allows plugin authors
to hook in to various editor internals
through a system of custom events.
By registering a handler on a specific event,
your plugin will be notified when something occurs
so that you can modify the default behavior.

****************
Available Events
****************

``postBlockMaybeCreated``
=========================

This event is fired when some user input occurred
that might have created a new block-level element.
Things that qualify include pressing the Enter key,
pasting content, inserting tables, etc.

This event fires **after** WYMeditor's default handling occurs.

