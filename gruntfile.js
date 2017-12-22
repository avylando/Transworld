module.exports = function (grunt) {
  // grunt.loadNpmTasks("grunt-contrib-less");
  // grunt.loadNpmTasks("grunt-browser-sync");
  // grunt.loadNpmTasks("grunt-contrib-watch");
  // grunt.loadNpmTasks("grunt-postcss");
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    sass: {
      style: {
        files: {
          "build/css/style.css": "sass/style.scss"
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require("autoprefixer")()
        ]
      },

      style: {
        src: "build/css/*.css"
      }
    },

    csso: {
      style: {
        options: {
          report: "gzip"
        },

        files: {
          "build/css/style.min.css": ["build/css/style.css"],
          "build/css/bootstrap.min.css": ["css/bootstrap.css"],
          "build/css/bootstrap-theme.min.css": ["css/bootstrap-theme.css"]
        }
      }
    },

    svgstore: {
      options: {
        includeTitleElement: false
      },

      sprite: {
        files: {
          "build/img/sprite.svg": ["img/**/icon-*.svg", "img/**/logo-*.svg"]
        }
      }
    },

    posthtml: {
      options: {
        use: [
          require("posthtml-include")()
        ]
      },

      html: {
        files: [{
          expand: true,
          src: ["*.html"],
          dest: "build"
        }]
      }
    },

    uglify: {
      build: {
        files: {
          "build/js/toggle.min.js": ["js/toggle.js"],
          "build/js/bootstrap.min.js": ["js/bootstrap.js"]
        }
      }
    },

    watch: {
      html: {
        files: ["*.html"],
        tasks: ["posthtml"]
      },

      style: {
        files: ["sass/**/*.scss"],
        tasks: ["sass", "postcss", "csso"]
      },

      js: {
        files: ["js/**/*.js"],
        tasks: ["jsminify"]
      }
    },

    browserSync: {
      server: {
        bsFiles: {
          src: [
            "build/*.html",
            "build/css/*.css",
            "build/js/**/*.js"
          ]
        }
      },

      options: {
        server: "build/",
        watchTask: true,
        notify: false,
        open: true,
        cors: true,
        ui: false
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3,
          progressive: true
        }
      },

      files: [{
        expand: true,
        src: ["img/**/*.{jpg,png,svg}"]
      }]
    },

    cwebp: {
      images: {
        options: {
          q: 90
        }
      },

      files: [{
        expand: true,
        src: ["img/**/*.{jpg,png}"]
      }]
    },

    copy: {
      build: {
        files: [{
          expand: true,
          src: [
            "fonts/**/*.{woff,woff2}",
            "img/**",
            "js/**"
          ],
          dest: "build"
        }]
      },
    },

    copy: {
      docs: {
        files: [{
          expand: true,
          cwd: "build",
          src: "**",
          dest: "docs/"
        }],
      },
    },

    clean: {
      build: ["build"],
      js: ["build/js/*.min.js"]
    },

    clean: {
      docs: ["docs"]
    }
  });

  grunt.registerTask("jsminify", ["clean:js", "uglify"]);

  grunt.registerTask("serve", ["browserSync", "watch"]);

  grunt.registerTask("build", [
    "clean:build",
    "copy:build",
    "sass",
    "postcss",
    "csso",
    "svgstore",
    "posthtml",
    "jsminify"
  ]);

  grunt.registerTask("docs", [
    "clean:docs",
    "copy:docs"
  ]);
};
