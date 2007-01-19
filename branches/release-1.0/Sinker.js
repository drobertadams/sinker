/*
Sinker (rsync interface) Widget - Simple interface to rsync.
Copyright (c) 2005 D. Robert Adams

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.

Table of Contents

  Section I: Startup Functions
    setup()
    
  Section II: Front Functions
    cancel()
    endHandler()
    outputHandler()
    sync()
    
  Section III: Back Functions
    savePrefs()
    
  Section IV:  Flipping Functions
  
  Section V: i Button Functions
*/

/****************************************************************************
 * SECTION I: STARTUP FUNCTIONS
 ****************************************************************************/
 
/****************************************************************************
 * Called when the widget is launched.  Reads preferences and sets the
 * controls on the back of the widget.
 */
function setup()
{
	if(window.widget)
	{
		// The preferences are retrieved:
		var archiveFlag = widget.preferenceForKey("archive");
    var compressFlag = widget.preferenceForKey("compress");
    var copyUnsafeLinksFlag = widget.preferenceForKey("copyUnsafeLinks");
    var deleteFlag = widget.preferenceForKey("deleteFlag");
    var dryRunFlag = widget.preferenceForKey("dryrun"); 
    var updateFlag = widget.preferenceForKey("update");
    var verboseFlag = widget.preferenceForKey("verbose");
    var excludeFromString = widget.preferenceForKey("excludeFrom");
    var rshString = widget.preferenceForKey("rsh");
    var sourceString = widget.preferenceForKey("source");
    var destinationString = widget.preferenceForKey("destination");

    if (archiveFlag) archive.checked=archiveFlag;
    if (compressFlag) compress.checked=compressFlag;
    if (copyUnsafeLinksFlag) copyUnsafeLinks.checked=copyUnsafeLinksFlag;
    if (updateFlag) update.checked=updateFlag;
    if (verboseFlag) verbose.checked=verboseFlag;
    if (deleteFlag) deleteInput.checked=deleteFlag;
    if (dryRunFlag) dryrun.checked=dryrunFlag;
    
		if (excludeFromString) excludeFrom.value=excludeFromString;
    if (rshString) rsh.value=rshString;
    if (sourceString) source.value=sourceString;
    if (destinationString) destination.value=destinationString;
	}
}

/****************************************************************************
 * SECTION II: FRONT FUNCTIONS
 ****************************************************************************/

/****************************************************************************
 * Called when the rsync process is running and the user hits the button
 * (which is the "Cancel" button).
 */
function cancel()
{
  if (window.widget)
  {
    // If we are currently running a command, then cancel it.
    if (myCommand)
      myCommand.cancel();
    button.value = "Sync";
    button.onclick = sync;
    myCommand = null;
  }
}

/****************************************************************************
 * Called when the rsync process finished.  Not much to do!
 */
function endHandler()
{
  cancel();
} 

/****************************************************************************
 * Called when the rsync process outputs something.  Append the output to the
 * text area.
 */
function outputHandler(currentOutputString)
{
  output.value += currentOutputString;
} 

/****************************************************************************
 * Called when the Sync button is pressed.
 */
function sync()
{
  if ( window.widget ) // make sure we are running Dashboard
  {
    // First change the button to say "Cancel".
    button.value = "Cancel";
    button.onclick = cancel;
    
    // Create the rsync command to execute, based on current preferences.
    var cmd = "/usr/bin/rsync ";
    if (archive.checked) cmd += "--archive ";
    if (compress.checked) cmd += "--compress ";
    if (copyUnsafeLinks.checked) cmd += "--copy-unsafe-links ";
    if (update.checked) cmd += "--update ";
    if (deleteInput.checked) cmd += "--delete ";
    if (dryrun.checked) cmd += "--dry-run ";    
    if (verbose.checked) cmd += "--verbose ";
    if (excludeFrom.value.length > 0)
      cmd += "--exclude-from '" + excludeFrom.value + "' ";
    if (rsh.value.length > 0)
      cmd += "--rsh " + rsh.value + " ";
    if (source.value.length > 0)
      cmd += source.value + " ";
    if (destination.value.length > 0)
      cmd += destination.value;
    
    output.value = "Executing " + cmd + "\n----------\n";
    
    // Next, start up the process.
    myCommand = widget.system(cmd, endHandler); 
    myCommand.onreadoutput = outputHandler;
    myCommand.onreaderror = outputHandler;
  }
}

/****************************************************************************
 * SECTION III: BACK FUNCTIONS
 ****************************************************************************/

/****************************************************************************
 * Saves preferences.
 */
function savePrefs()
{
  if(window.widget)
	{
 		widget.setPreferenceForKey(archive.checked, "archive");
    widget.setPreferenceForKey(compress.checked, "compress");
    widget.setPreferenceForKey(copyUnsafeLinks.checked, "copyUnsafeLinks");
    widget.setPreferenceForKey(update.checked, "update");
    widget.setPreferenceForKey(deleteInput.checked, "deleteFlag");
    widget.setPreferenceForKey(dryrun.checked, "dryrun");
    widget.setPreferenceForKey(verbose.checked, "verbose");
    widget.setPreferenceForKey(excludeFrom.value, "excludeFrom");
    widget.setPreferenceForKey(rsh.value, "rsh");
    widget.setPreferenceForKey(source.value, "source");
    widget.setPreferenceForKey(destination.value, "destination");
  }
}

/***************************************************************************
 * SECTION IV: FLIPPING FUNCTIONS
 * Standard stuff to flip the widget over.  Copied directly from Apple's
 * Goodbye World example.
 ***************************************************************************/

// these functions are called when the info button itself receives 
// onmouseover and onmouseout events
function enterflip(event)
{
	document.getElementById('fliprollie').style.display = 'block';
}

function exitflip(event)
{
	document.getElementById('fliprollie').style.display = 'none';
}

// showBack() is called when the preferences flipper is clicked upon.  
// It freezes the front of the widget, hides the front div, unhides the back 
// div, and then flips the widget over.
function showBack()
{
	var front = document.getElementById("front");
	var back = document.getElementById("back");
	
	if (window.widget)
		widget.prepareForTransition("ToBack");		// freezes the widget so that you can change it without the user noticing
	
	front.style.display="none";		// hide the front
	back.style.display="block";		// show the back
	
	if (window.widget)
		setTimeout ('widget.performTransition();', 0);		// and flip the widget over	

	document.getElementById('fliprollie').style.display = 'none';  // clean up the front side - hide the circle behind the info button
}


// showFront() is called by the done button on the back side of the widget.
// It performs the opposite transition as showBack() does.
function showFront()
{
  savePrefs();
  
	var front = document.getElementById("front");
	var back = document.getElementById("back");
	
	if (window.widget)
		widget.prepareForTransition("ToFront");		// freezes the widget and prepares it for the flip back to the front
	
	back.style.display="none";			// hide the back
	front.style.display="block";		// show the front
	
	if (window.widget)
		setTimeout ('widget.performTransition();', 0);		// and flip the widget back to the front
}

/****************************************************************************
 * SECTION V: i BUTTON FUNCTIONS
 * Standard stuff to make the i button appear when the mouse moves into
 * the widget area.  Copied directly from Goodbye World example.
 ****************************************************************************/

// PREFERENCE BUTTON ANIMATION (- the pref flipper fade in/out)
var flipShown = false;		// a flag used to signify if the flipper is currently shown or not.

// A structure that holds information that is needed for the animation to run.
var animation = {duration:0, starttime:0, to:1.0, now:0.0, from:0.0, firstElement:null, timer:null};

// mousemove() is the event handle assigned to the onmousemove property on the front div of the widget. 
// It is triggered whenever a mouse is moved within the bounds of your widget.  It prepares the
// preference flipper fade and then calls animate() to performs the animation.
function mousemove (event)
{
	if (!flipShown)			// if the preferences flipper is not already showing...
	{
		if (animation.timer != null)			// reset the animation timer value, in case a value was left behind
		{
			clearInterval (animation.timer);
			animation.timer  = null;
		}
		
		var starttime = (new Date).getTime() - 13; 		// set it back one frame
		
		animation.duration = 500;												// animation time, in ms
		animation.starttime = starttime;										// specify the start time
		animation.firstElement = document.getElementById ('flip');		// specify the element to fade
		animation.timer = setInterval ("animate();", 13);						// set the animation function
		animation.from = animation.now;											// beginning opacity (not ness. 0)
		animation.to = 1.0;														// final opacity
		animate();																// begin animation
		flipShown = true;														// mark the flipper as animated
	}
}

// mouseexit() is the opposite of mousemove() in that it preps the preferences flipper
// to disappear.  It adds the appropriate values to the animation data structure and sets the animation in motion.
function mouseexit (event)
{
	if (flipShown)
	{
		// fade in the flip widget
		if (animation.timer != null)
		{
			clearInterval (animation.timer);
			animation.timer  = null;
		}
		
		var starttime = (new Date).getTime() - 13;
		
		animation.duration = 500;
		animation.starttime = starttime;
		animation.firstElement = document.getElementById ('flip');
		animation.timer = setInterval ("animate();", 13);
		animation.from = animation.now;
		animation.to = 0.0;
		animate();
		flipShown = false;
	}
}

// animate() performs the fade animation for the preferences flipper. It uses the opacity CSS property to simulate a fade.
function animate()
{
	var T;
	var ease;
	var time = (new Date).getTime();
		
	
	T = limit_3(time-animation.starttime, 0, animation.duration);
	
	if (T >= animation.duration)
	{
		clearInterval (animation.timer);
		animation.timer = null;
		animation.now = animation.to;
	}
	else
	{
		ease = 0.5 - (0.5 * Math.cos(Math.PI * T / animation.duration));
		animation.now = computeNextFloat (animation.from, animation.to, ease);
	}
	
	animation.firstElement.style.opacity = animation.now;
}


// these functions are utilities used by animate()
function limit_3 (a, b, c)
{
    return a < b ? b : (a > c ? c : a);
}

function computeNextFloat (from, to, ease)
{
    return from + (to - from) * ease;
}


