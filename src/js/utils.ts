class Utils {
    public static toDegrees (radians) {
        var pi = Math.PI;
        return radians * (180 / pi);
    }
    
    public static getDistance (p1, p2) {
        return Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
        );
    }
    
    public static getAngle (p1, p2) {
        let angle = this.toDegrees(Math.atan2(p1.y - p2.y, p1.x - p2.x));
    
        if (angle < 0) {
            angle += 360;
        }
    
        return angle;
    };
}
export default Utils;