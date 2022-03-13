document.addEventListener("alpine:init", () => {
  Alpine.data("register", () => ({
    city: [],
    query: "",
    cityfind() {
      let division = this.$el.value;
      fetch(`https://bdapis.herokuapp.com/api/v1.1/division/${division}`)
        .then((res) => res.json())
        .then((citylist) => {
          console.log(citylist);
          this.city = [...citylist.data];
        });
    },
  })),

  Alpine.data("search_profile", () => ({
    title: "",
    description: "",
    category: "",
    img: "",
    fileupload: "",
    postid: 1,
    modal: false,
    query: "",
    searchProfile: [],
    search() {
      console.log(this.query);
      fetch(`http://localhost:5000/profile/search?query=${this.query}`)
        .then((res) => res.json())
        .then((profile) => (this.searchProfile = [...profile]))
        .catch((err) => console.log(err));
    },
    post(e) {
      this.modal = true;
      fetch(`http://localhost:5000/post/single/${e}`)
        .then((res) => res.json())
        .then((p) => {
          console.log(p);
          this.title = p[0].title;
          this.description = p[0].description;
          this.category = p[0].category_id;
          this.img = p[0].img;
          this.postid = p[0].id;
        })
        .catch((err) => console.log(err));
    },

    update() {
      let confirmation = confirm("Are You Sure?");
      if (!confirmation) {
        return false;
      }
      const data = new FormData();
      data.append("title", this.title);
      data.append("description", this.description);
      data.append("category", this.category);
      data.append("fileupload", this.fileupload);
      data.append("id", this.postid);
      fetch(`http://localhost:5000/post/update`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((p) => {
          console.log(p)
          if (p.err) {
            toastr[`${p.class}`](`${p.msg}`);
            console.log(p.msg);
            setTimeout(() => {
              window.location.href = "";
            }, 2000);
          } else {
            toastr[`${p.class}`](`${p.msg}`);
            setTimeout(() => {
              window.location.reload()
            }, 2000);
          }
        })
        .catch((err) => {});
    },
  }));
});




$(document).ready(function () {
  $(".post").owlCarousel({
    loop: true,
    margin: 20,
    responsiveClass: true,
    dots: false,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 1,
        nav: false,
      },
      1000: {
        items: 4,
        nav: true,
        loop: true,
      },
    },
  });
});

$(document).ready(function () {
  $(".recent_post").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    dots: false,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 1,
        nav: false,
      },
      1000: {
        items: 5,
        nav: false,
        loop: true,
      },
    },
  });
});
$(document).ready(function () {
  $(".most_popular").owlCarousel({
    loop: true,
    margin: 10,
    responsiveClass: true,
    dots: false,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 1,
        nav: false,
      },
      1000: {
        items: 1,
        nav: false,
        loop: true,
      },
    },
  });
});
$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    loop: true,
    margin: 15,
    responsiveClass: true,
    dots: false,
    responsive: {
      0: {
        items: 1,
        nav: true,
      },
      600: {
        items: 3,
        nav: true,
      },
      1000: {
        items: 3,
        nav: false,
        loop: true,
      },
    },
  });
});

$(document).ready(function () {
  $("#post_file_img").on("change", (e) => {
    console.log(URL.createObjectURL(e.target.files[0]));
    $("#file_svg_img").css("display", "none");
    $("#file_img_img").css("display", "block");
    $("#file_img_img").attr("src", URL.createObjectURL(e.target.files[0]));
  });
});
$(document).ready(function () {
  $("#post_file").on("change", (e) => {
    console.log(URL.createObjectURL(e.target.files[0]));
    $("#file_svg").css("display", "none");
    $("#file_img").css("display", "block");
    $("#file_img").attr("src", URL.createObjectURL(e.target.files[0]));
  });
});

 $(document).ready(function () {
   $("#table").DataTable();
 });

$(document).ready(function () {
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "2000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
  };
});

setInterval(() => {
  $(".copyright").text("Copyright @ "+new Date().toLocaleTimeString())
}, 1000)