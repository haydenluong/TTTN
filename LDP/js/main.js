// preview chosen photo inside its upload box instead of the placeholder art
document.querySelectorAll(".js-upload-preview").forEach(function (input) {
  input.addEventListener("change", function () {
    var file = input.files && input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      input.parentElement.style.backgroundImage = "url(" + e.target.result + ")";
    };
    reader.readAsDataURL(file);
  });
});
