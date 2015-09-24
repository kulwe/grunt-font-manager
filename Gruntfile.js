var path=require('path');
var _=require('underscore');
module.exports = function (grunt) {
    var _=grunt.util._;
    grunt.initConfig({
        fontmanager:{
            xlds:{
                options:{
                    svgPath:'test/font/svg/'
                },
                files:[{
                    src:'test/font/font.json',
                    dest:'test/font/dist/'
                }]
            }
        }
    });

    grunt.loadTasks('tasks');

    /*压缩字体*/
    grunt.registerTask('font', ['fontmanager:xlds']);
};