/**
 * Created by pavel on 24.5.16.
 */
'use strict';

module.exports = function(grunt) {

    var fs = require('fs');
    var FtpClient = require('ftp');
    var Stack = require('../src/stack.js');

    var opts = {
        auth:{
            host:'0.0.0.0',
            port: 21,
            authKey: 'key',
            secure: false
        },
        quiet: false,
        authFile: '.ftppass'
    };

    grunt.registerMultiTask('ftps_push', 'Deploy files', function() {
        /* default config */
        var options = this.options(opts);

        var dirs = new Stack();
        var files = new Stack();

        var done = this.async();


        /* load config */
        var keys = ['cwd','src','dest'];
        for(var i in keys){
            var key = keys[i];
            options[key] = this.data.files[0][key];
        }

        /* check .ftppass */
        if(!grunt.file.exists(options.authFile)){
            grunt.warn('no valid \''+options.authFile+'\' file found!')
        }
        options.auth.user = JSON.parse(grunt.file.read(options.authFile))[options.auth.authKey];



        grunt.file.expand({cwd: options.cwd}, options.src).forEach(function(file){
            if (grunt.file.isFile(options.cwd + '/' + file)) {
                files.push(file);
            } else if(grunt.file.isDir(options.cwd + '/' + file)) {
                dirs.push(file);
            }
        });
        if(files.length == 0){
            grunt.log.ok('No file uploaded!');
            done();
        }
        var ftp = new FtpClient();
        ftp.on('ready',function(){
            if(dirs.length == 0){
                processFiles();
            }else{
                processDirs();
            }

        });

        /* connect ftp */
        ftp.connect({
            host: options.auth.host,
            port: options.auth.port,
            user: options.auth.user.username,
            password: options.auth.user.password,
            secure: options.auth.secure,
            secureOptions: {
                requestCert: true,
                rejectUnauthorized: false
            }

        });
        
        function createRemoteDir(dir, callback){
            ftp.list(options.dest + '/' + dir, function(err, list){
                if(err){
                    grunt.log.error('ftp list error!', err);
                }
                if (typeof list === 'undefined' || list.length == 0){
                    ftp.mkdir(options.dest + '/' + dir, true, function(err){
                        grunt.log.ok('dir created: '+dir);
                        if(err) {
                            grunt.log.error('create dir failed:' + dir + '', err);
                        }
                        callback();
                    });
                } else {
                    !options.quiet && grunt.log.ok('folder already exists '+dir);
                    callback();
                }
            });
        }

        function processDirs(){
            var dir = dirs.pop();
            createRemoteDir(dir, function(){
                if(dirs.hasNext()){
                    processDirs();
                }else{
                    processFiles();
                }
            });
        }

        function processFiles(){
            var file = files.pop();
            uploadFile(options.cwd + '/' + file, options.dest + '/' + file,function(){
                if(files.hasNext()){
                    processFiles();
                }else{
                    ftp.end();
                    grunt.log.ok("upload Done!");
                    done();
                }
            });


        }

        function uploadFile(origin, remote,callback){
            ftp.put(origin, remote, function(err){
                if(err) {
                    grunt.log.error('upload failed: ' + origin + '', err)
                }else if(!options.quiet){
                    grunt.log.ok('uploaded: '+origin);
                }
                callback();
            });
        }

    });

};
