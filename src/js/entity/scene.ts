class Scene {
    public children;

    constructor() {
        this.children = [];
    }
    draw() {
        this.children.forEach(child => child.draw());
    }
    add(child) {
        this.children.push(child);
    }
}
export default Scene;