module.exports = function(grunt){    
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	gitinfo: null,
	copy: {
	    'source-to-working': {		
		files:[
		    {
			expand: true,
			cwd: 'source',
			src: '**',
			dest: 'working'
		    },
		]
	    },
	    'assets-to-working':{
		files:[
		    {
			expand: true,
			cwd: 'assets',
			src: '**',
			dest: 'working',
		    }
		]
	    },
	    'libraries-to-working':{
		files:[		    
		    {
			expand: true,
			cwd: 'libraries',
			src: '**',
			dest: 'working',
		    }
		]
	    },
	    'scripts-to-working':{
		files:[
		    {
			expand: true,
			cwd: 'scripts',
			src: '**',
			dest: 'working',
		    }
		]
	    },
	    'working-to-development': {
		files:[
		    {
			expand:true,
			cwd: 'working',
			src: '**',
			dest: 'build/development',
		    }
		]
	    },
	    'working-to-scripts': {
		files:[
		    {
			expand: true,
			cwd: 'working',
			src: '**',
			dest: 'build/scripts',
		    }
		]
	    },
	    'working-to-production': {
		files:[
		    {
			expand:true,
			cwd: 'working',
			src: '**',
			dest: 'build/production',
		    }
		]
	    },
	},
	concat: {
	    default:{
		files:[
		    {
			src: ['working/javascript/**/*.js'],
			dest: 'working/index.js',
		    },
		    {
			src: ['working/stylesheets/**/*.css'],
			dest: 'working/index.css',
		    },
		],		
	    },
	},
	clean:{
	    final:["working"],
	    development: ['working/stylesheets/', 'working/javascript/'],
	    production: ['working/stylesheets/', 'working/javascript/']
	},
	config: {},
	'string-replace': {
	    main:{
		files: [
		    {
			expand: true,
			filter: 'isFile',
			cwd: 'working',
			src: '**',
			dest: 'working'
		    }
		],				
		options: {
		    replacements:[
			{
			    pattern: /\$NAME/g,
			    replacement: '<%= config.name %>'
			},
			{
			    pattern: /\$BRANCH/g,
			    replacement: '<%= gitinfo.local.branch.current.name %>'
			},
			{
			    pattern: /\$HOST/g,
			    replacement: '<%= config.host %>'
			},
			{
			    pattern: /\$PORT/g,
			    replacement: '<%= config.port %>'
			},
			{
			    pattern: /\$ADMIN_HOST/g,
			    replacement: '<%= config.adminHost %>'
			},
			{
			    pattern: /\$ADMIN_PORT/g,
			    replacement: '<%= config.adminPort %>'
			},
		    ]
		}		    
	    }
	}
    });


    var config = grunt.file.readJSON('config.json');   

    grunt.loadNpmTasks('grunt-string-replace')
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-gitinfo');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('configure-development', function(){
	grunt.config.data.config = grunt.file.readJSON('config.json').development;	
    });
    grunt.registerTask('configure-production', function(){
	grunt.config.data.config = grunt.file.readJSON('config.json').production;
    });
    grunt.registerTask('configure-scripts', function(){
	grunt.config.data.config = grunt.file.readJSON('config.json').scripts;
    });
    
    grunt.registerTask(
	'build-scripts',
	[
	    'gitinfo',
	    'configure-scripts',
	    'copy:scripts-to-working',
	    'string-replace',
	    'copy:working-to-scripts',
	    'clean',
	]
    );
    grunt.registerTask(
	'build-development',
	[
	    'gitinfo',
	    'configure-development',
	    'copy:source-to-working',
	    'string-replace',
	    'copy:libraries-to-working',
	    'concat',
	    'copy:assets-to-working',
	    'clean:development',
	    'copy:working-to-development',
	    'clean'

	]
    );
    grunt.registerTask(
	'build-production', 
	[
	    'gitinfo',
	    'configure-production',
	    'copy:source-to-working', 
	    'string-replace',
	    'copy:libraries-to-working',
	    'concat',
	    'copy:assets-to-working',
	    'clean:production',
	    'copy:working-to-production',
	    'clean',
	]
    );

};
