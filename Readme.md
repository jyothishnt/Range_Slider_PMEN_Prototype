A prototype of linking Google Maps API with jQRangeSlider

The demo currently shows PMEN world wide spread of clones.


About jQRangeSlider
====================================================
A javascript slider selector that supports dates and touch devices

* [Home page](http://ghusse.github.com/jQRangeSlider/)
* [Documentation](http://ghusse.github.com/jQRangeSlider/documentation.html)
* [Support & suggestions](https://jqrangeslider.uservoice.com/)
* [Github](https://github.com/ghusse/jQRangeSlider/)
* [Twitter](https://twitter.com/jQRangeSlider)

License
-------
Copyright : Guillaume Gautreau 2010
License : Dual license GPL v3 and MIT

Dependencies
------------
+ jQuery
+ jQuery UI core
+ jQuery UI widget
+ jQuery UI mouse
+ jQuery Mousewheel plugin by Brandon Aaron (optional, needed for scrolling or zooming)


Generating minified jQRangeSlider files
---------------------------------------

You need nodejs and npm. Open a command line interface and run:

     npm install
     npm install -g grunt-cli

Now you can minify jQRangeSlider and build a zip package by running

     grunt

You can launch jshint and unit tests too:

     grunt ci

