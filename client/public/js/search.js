
var hasSearchResult = false;
$(document).mouseup(function(e) {
  const wordList = $("#wordList")
  const searchInput = $("#searchInput")

  // if the target of the click isn't the container nor a descendant of the container
  if (!searchInput.is(e.target) && searchInput.has(e.target).length === 0 && !wordList.is(e.target) && wordList.has(e.target).length === 0) {
      $("#wordList").hide();
  }
  if (hasSearchResult && (searchInput.is(e.target) || searchInput.has(e.target).length > 0)) {
      $("#wordList").show();
  }
});