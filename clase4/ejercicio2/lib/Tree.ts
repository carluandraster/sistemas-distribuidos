export class Tree<T> {
    private node: T;
    private children: Tree<T>[];

    protected constructor(root: T) {
        this.node = root;
        this.children = [];
    }
        
    /**
     * **Obtiene el valor de un nodo dada su ruta**
     * @param route Ruta de la raíz hasta el nodo. Si es [], se toma la raíz
     * @returns Valor del nodo
     */
    protected get(route: number[]): T {
        if (route.length === 0) {
            return this.node;
        }

        return this.children[route[0]].get(route.slice(1));
    }

    /**
     * **Establece el valor de un nodo dada su ruta**
     * @param route Ruta de la raíz hasta el nodo. Si es [], se toma la raíz
     */
    protected set(route: number[], newVal: T): void {
        if (route.length === 0) {
            this.node = newVal;
        } else {
            this.children[route[0]].set(route.slice(1), newVal);
        }
    }

    /**
     * Agrega un nuevo hijo a un padre
     * @param parent Ruta del padre
     * @param newChild Nuevo hijo
     */
    protected addChild(parent: number[], newChild: T): void{
        if (parent.length === 0) {
            this.children.push(new Tree(newChild));
        } else {
            this.children[parent[0]].addChild(parent.slice(1), newChild);
        }
    }

    /**
     * Le quita un hijo a un padre
     * @param parent Ruta del padre
     * @param idx Índice del hijo
     */
    protected removeChild(parent: number[], idx: number) {
        parent.length === 0
            ? this.children.push(this.children[idx])
            : this.children[parent[0]].removeChild(parent.slice(1), idx);
    }
}