@Enlarge = () ->
  directive = {}
  directive.restrict = 'A'
  directive.link = (scope, element, attrs) ->
    originalHeight = element.css('height')
    originalWidth = element.css('width')
    element.on('mouseenter',() ->
      element.css('width','100px').css('height','100px');
    )
    element.on('mouseleave',() ->
      element.css('width',originalWidth).css('height',originalHeight);
    )
  directive