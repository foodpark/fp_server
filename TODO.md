Things that are working:

1) generic RESTful API including a lot of custom behavior for our data
   model (see app/rest_hooks.js).  More can be added, these can be
   extended as we grow our functionality.

2) login/registration are both working through the UI, though there
   isn't an API for that yet.

Things that need to happen:

1) Login/registration/authentication/authorization for the API, should
   be done with the `authorize` RESTeasy hook.  This will allow you to
   fine-grainedly allow/deny based on our rule set (which to my
   knowledge has not been codified yet).

2) Ensure that the data model is what we expect, and potentially add
   tables for other data structures.
