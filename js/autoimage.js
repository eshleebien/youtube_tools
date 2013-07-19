function getSizeByFixedHeight(currentW, currentH, newHeight)
{
    var ratio = currentW / currentH;
    var newWidth = newHeight * ratio;
    return newWidth;
}

function getSizeByFixedWidth(currentW, currentH, newWidth)
{
    ratio = currentH / currentW;
    newHeight = newWidth * ratio;
    return newHeight;
}

function getSizeByAuto(currentW, currentH, newWidth, newHeight)
{
    if (currentH < currentW)
    // *** Image to be resized is wider (landscape)
    {
        console.log("image is andscape");
        var optimalWidth = newWidth;
        var optimalHeight= getSizeByFixedWidth(currentW, currentH, newWidth);
    }
    else if (currentH > currentW)
    // *** Image to be resized is taller (portrait)
    {
        console.log("image is portrait");
        var optimalWidth = getSizeByFixedHeight(currentW, currentH, newHeigth);
        var optimalHeight= newHeight;
    }
    else
    // *** Image to be resizerd is a square
    {
        console.log("image is square");
        if (newHeight < newWidth) {
            var optimalWidth = newWidth;
            optimalHeight= getSizeByFixedWidth(currentW, currentH, newWidth);
        } else if (newHeight > newWidth) {
            var optimalWidth = getSizeByFixedHeight(currentW, currentH, newWidth);
            optimalHeight= newHeight;
        } else {
            // *** Sqaure being resized to a square
            var optimalWidth = newWidth;
            var optimalHeight= newHeight;
        }
    }

    var arr = new Array();
    arr[0] = optimalWidth;
    arr[1] = optimalHeight;
    return arr;
}
