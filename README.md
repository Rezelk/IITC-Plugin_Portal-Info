IITC-Plugin_Portal-Info
=======================

This plugin for IITC(Ingress Intel Total Conversion).
It's listing portal information as JavaScript array.

-----

## 1. Requirement

Greasemonkey (or browser having the feature of equivalent)
IITC (Greasemonkey script)

## 2. Instruction (How to Use)

Add script (Install script)
If you enable the script, it shows portal infomation on your left of browser view.

Copy portal array

    // N portals
    var portals = [
      xxx
      xxx
      ...
      {last:null}
    ];

Paste to HTML near line 38

    ////////////////////////////////////////////////////////////////////
    // ADD HERE - Copy & Paste Plugin Code
    HERE!
    // ADD HERE - Copy & Paste Plugin Code
    ////////////////////////////////////////////////////////////////////

Save HTML and Open HTML

## 3. Notice

This script can get portals information only fetched & showed portals limited by Intel Map specification.
If you want to get L0 (neutral) portals, you must zoom in map.
This script suppress duplicate portals but can not reload or rewrite portals information.
If you want to get latest portals information, you reload page & retry to get indormation.

## 4. License

Using, changing, publishing are free.

This code congotmd to MIT license.

Details are "LICENSE.md".



