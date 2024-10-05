let lerp = (start, end, t) => {

    if (t < 0.0)
    {
        t = 0.0;
    }

    if (t > 1.0)
    {
        t = 1.0;
    }

    return start * (1 - t) + end * t;
};

console.log('result = ', lerp(0, 10, 120.7));