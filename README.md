<h1>DEEP CLONE</h1>
<p>Deep clones arbitary javascript variable, taking care of circular dependencies and object proto chain.</p>
<h3>Usage example</h3>
<pre>
var clone = require("deepclone");
var date = new Date();
var clonedDate = clone(date);
</pre>
