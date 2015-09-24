'use strict';
var fontCarrier=require('font-carrier');
var path=require('path');
var _=require('underscore');

module.exports = function(grunt) {
    var fontReg=/#(.+)$/i;
    var _fonts={};
    function getSvgFromFont(fontPath,relative){
        var fontId=fontPath.replace(fontReg,'');
        var unicode=fontPath.match(fontReg);
        if(!unicode)return null;
        var font=_fonts[fontId];
        var filePath;
        if(!font){
            filePath=path.resolve(relative,fontId);
            if(!grunt.file.exists(filePath))return null;
            font=_fonts[fontId]=fontCarrier.transfer(filePath);
        }
        return font.getSvg('&#x'+unicode[1]+';');
    }

    var svgReg=/\.svg$/i;
    function updateSvgFromFonts(json,relative,opt){
        _.each(json.fonts,function(font){
            var isSvg=svgReg.test(font.file);
            //svg类型跳出
            if(isSvg)return true;
            //svg已存在，跳出
            var svgPath=path.join(opt.svgPath,font.name+'.svg');
            if(grunt.file.exists(svgPath)){
                grunt.log.warn('svg already exist from font:'+svgPath);
                return true;
            }

            var svg=getSvgFromFont(font.file,relative);
            if(!svg)return true;
            grunt.file.write(svgPath,svg);
            grunt.verbose.write('svg saved:'+svgPath);
        });
    }

    function getNewFont(json,dir,opt){
        var newFont=fontCarrier.create({
        });
        newFont.setFontface({
            fontFamily:json.fontName||'ifont'
        });

        _.each(json.fonts,function(font){
            var svg;
            var svgPath=svgReg.test(font.file)?
                path.resolve(dir,font.file):
                path.join(opt.svgPath,font.name+'.svg');
            if(!grunt.file.exists(svgPath)){
                grunt.log.warn('svg is not exist:'+svgPath);
                return true;
            }
            svg=grunt.file.read(svgPath);
            var unicode='&#x'+font.unicode+';';
            newFont.setSvg(unicode,svg);
        });

        return newFont.output({
            path:null
        });
    }

    var cssTpl=grunt.file.read(path.resolve(__dirname,'./template/css.ejs'));
    cssTpl= _.template(cssTpl);

    var htmlTpl=grunt.file.read(path.resolve(__dirname,'./template/html.ejs'));
    htmlTpl= _.template(htmlTpl);

    grunt.registerMultiTask('fontmanager', 'fontmanager', function() {
        var options = this.options({
            svgPath: './font/svg/'
        });
        var This=this;
        grunt.verbose.writeflags(options, 'Options');
        this.filesSrc.forEach(function(filepath,index) {
            if (!grunt.file.exists(filepath)) { return; }
            grunt.log.writeln('fontmanager process "' + filepath + '"...');

            var json=grunt.file.readJSON(filepath);
            var dir=path.dirname(filepath);
            //从字体中提取svg
            updateSvgFromFonts(json,dir,options);
            //获取font
            var fonts=getNewFont(json,dir,options);
            var dest=This.files[index].dest;
            _.each(fonts,function(font,ext){
                var fontFile=path.join(dest,json.fontName+'.'+ext);
                grunt.file.write(fontFile,font);
            });
            //生成css
            var css=cssTpl(json);
            var cssFile=path.join(dest,json.fontName+'.css');
            grunt.file.write(cssFile,css);
            //复制css
            var demoCss=grunt.file.read(path.resolve(__dirname,'./template/demo.css'));
            var demoCssPath=path.join(dest,'demo.css');
            grunt.file.write(demoCssPath,demoCss);
            //生成html
            var html=htmlTpl(json);
            var htmlFile=path.join(dest,json.fontName+'.html');
            grunt.file.write(htmlFile,html);
        });
    });
};
