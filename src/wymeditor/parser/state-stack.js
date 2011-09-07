/**
*    States for a stack machine.
*
*    Constructor. Starts in named state.
*    @param string start        Starting state name.
*    @access public
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.StateStack = function(start)
{
    this._stack = [start];
    return this;
};

/**
*    Accessor for current state.
*    @return string       State.
*    @access public
*/
WYMeditor.StateStack.prototype.getCurrent = function()
{
    return this._stack[this._stack.length - 1];
};

/**
*    Adds a state to the stack and sets it
*    to be the current state.
*    @param string state        New state.
*    @access public
*/
WYMeditor.StateStack.prototype.enter = function(state)
{
    this._stack.push(state);
};

/**
*    Leaves the current state and reverts
*    to the previous one.
*    @return boolean    False if we drop off
*                       the bottom of the list.
*    @access public
*/
WYMeditor.StateStack.prototype.leave = function()
{
    if (this._stack.length == 1) {
        return false;
    }
    this._stack.pop();
    return true;
};

