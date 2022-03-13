let mix = require("laravel-mix");

mix
  .css("./public/resources/css/tailwind.css", "./public/assets/css/style.css")
  .setPublicPath("dist");
