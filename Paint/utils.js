Math.toDegrees = radians => {
    var pi = Math.PI;
    return radians * (180 / pi);
};

Math.getDistance = (p1, p2) => {
    return Math.sqrt(
        Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
    );
};

Math.getAngle = (p1, p2) => {
    let angle = Math.toDegrees(Math.atan2(p1.y - p2.y, p1.x - p2.x));

    if (angle < 0) {
        angle += 360;
    }

    return angle;
};