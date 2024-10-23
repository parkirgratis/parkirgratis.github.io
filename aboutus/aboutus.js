$(document).ready(function() {
    var autoplaySlider = $('#autoplay').lightSlider({
        auto:true,
        loop:true,
        pauseOnHover: true,
        onBeforeSlide: function (el) {
            $('#current').text(el.getCurrentSlideCount());
        } 
    });
    $('#total').text(autoplaySlider.getTotalSlideCount());
});

$(document).ready(function() {
  var autoplaySlider = $('#autoplay').lightSlider({
      auto:true,
      loop:true,
      pauseOnHover: true,
      onBeforeSlide: function (el) {
          $('#current').text(el.getCurrentSlideCount());
      } 
  });
  $('#total').text(autoplaySlider.getTotalSlideCount());
});

// ... existing code ...
document.getElementById('dropdownButton').addEventListener('click', function() {
  var dropdownMenu = document.getElementById('dropdownMenu');
  if (dropdownMenu.classList.contains('hidden')) {
      dropdownMenu.classList.remove('hidden');
  } else {
      dropdownMenu.classList.add('hidden');
  }
});
// ... existing code ...