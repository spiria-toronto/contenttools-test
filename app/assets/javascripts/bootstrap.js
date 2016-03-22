// # jQuery ->
// #   $("a[rel~=popover], .has-popover").popover()
// #   $("a[rel~=tooltip], .has-tooltip").tooltip()

jQuery(function() {
  $("a[rel~=popover], .has-popover").popover();
  return $("a[rel~=tooltip], .has-tooltip").tooltip();
});