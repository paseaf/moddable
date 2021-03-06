
// From TiCPU, http://forum.espruino.com/conversations/568
// Non-nested quick sort
function nqsort(arr, depth) {
    var pivot, i=0, left, right;
    if (depth === undefined) {
      depth = parseInt(Math.floor(arr.length/5), 10);
    }
    var begin = [];
    var end = [];
    begin[0] = 0;
    end[0] = arr.length;
    while (i >= 0) {
      left = begin[i]; right = end[i]-1;
      if (left < right) {
        pivot = arr[left];
        if (i === depth-1) return false;
        while (left < right) {
          while (arr[right] >= pivot && left < right) right--;
          if (left < right) arr[left++] = arr[right];
          while (arr[left] <= pivot && left < right) left++;
          if (left < right) arr[right--] = arr[left];
        }
        arr[left] = pivot; begin[i+1] = left+1;
        end[i+1] = end[i]; end[i++] = left;
      } else i--;
    }
    return true;
  };
  
  // Tests
  var tQsort = [5454,5449,5380,5412,5380,5366,5344,5395,5398,5424,5422,5473,5420,5432,5376,5354,5561,5288,5393,5388,5422,5427,5476,5407,5385,5180,5363,5324,5395,5393,5410,5405,5349,5361,5385,5412,5373,5373,5478,5420,5446,5395,5339,5407,5420,5356,5336,5427,5459,5378,5336,5349,5420,5405,5434,5383,5446,5422,5349,5329,5405,5434,5446,5336,5427,5473,5402,5170,5388,5412,5456,123,456,789];
 nqsort(tQsort);