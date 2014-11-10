@RangeFilter = () ->
  filter = (input, max) ->
    max = parseInt(max);
    for i in [1..max] by 1
      input.push(i)
    input
  filter
