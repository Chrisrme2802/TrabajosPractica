class MapElement{
    constructor(label, gridX, gridY, color, isSolid = false){
        this.label = label;
        this.gridX = gridX;
        this.gridY = gridY;
        this.color = color;
        this.isSolid = isSolid;
    }
}