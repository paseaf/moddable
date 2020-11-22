function fibonacci (num) {
    if (num === 0) return 0;
    if (num === 1) return 1;

    var fn_2 = 0; var fn_1 = 1;
    for (var n = 2; n < num; n++) {
        var temp_fn_1 = fn_1;
        fn_1 = fn_2 + fn_1;
        fn_2 = temp_fn_1;
    }
    return fn_2 + fn_1;
}
var result = fibonacci(22);
trace(result + '\n');
