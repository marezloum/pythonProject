
$(".line").click(function () {
  $(".line").css({
    width: "300px",
    transition: "width .5s, transform .2s linear .5s",
    cursor: "default",
  });
  $(".line-one").css({
    transform: "translatey(15px)",
    transition: "width .5s, transform .2s linear .5s",
  });
  $(".line-two").css({
    transform: "translatey(-20px)",
    transition: "width .5s, transform .2s linear .5s",
  });
  $(".menu").css({
    visibility: "visible",
    opacity: "1",
    transition: "visibility .5s linear .6s, opacity .5s",
  });
});

$(".menu").click(function () {
  $(".line").css({
    width: "50px",
    transition: "transform .3s linear .5s, width .5s",
    cursor: "pointer",
  });
  $(".line-one").css({
    transform: "translatey(35px)",
    transition: "transform .3s linear .5s, width .5s",
  });
  $(".line-two").css({
    transform: "translatey(-35px)",
    transition: "transform .3s linear .5s, width .5s",
  });
  $(".menu").css({
    visibility: "hidden",
    opacity: "0",
    transition: "visibility .2s, opacity .5s",
  });
});
$(document).mouseup(function (e) {
  const menu = $(".menu");
  const line = $(".line");

  // if the target of the click isn't the container nor a descendant of the container
  if (
    !menu.is(e.target) &&
    menu.has(e.target).length === 0 &&
    !line.is(e.target) &&
    line.has(e.target).length === 0
  ) {
    $(".line").css({
      width: "50px",
      transition: "transform .3s linear .5s, width .5s",
      cursor: "pointer",
    });
    $(".line-one").css({
      transform: "translatey(35px)",
      transition: "transform .3s linear .5s, width .5s",
    });
    $(".line-two").css({
      transform: "translatey(-35px)",
      transition: "transform .3s linear .5s, width .5s",
    });
    $(".menu").css({
      visibility: "hidden",
      opacity: "0",
      transition: "visibility .2s, opacity .5s",
    });
  }
});