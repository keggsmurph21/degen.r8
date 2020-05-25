export const SVG_NS = "http://www.w3.org/2000/svg";

interface Transformation {
    translate?: {x?: number, y?: number};
    scale?: number;
}

function transform(ele: SVGElement, transformation: Transformation): void {
    const dx = transformation ?.translate ?.x || 0;
    const dy = transformation ?.translate ?.y || 0;
    const scale = transformation ?.scale || 1.0;
    ele.setAttribute("transform", `translate(${dx},${dy}) scale(${scale})`)
}

export abstract class SVGWidget<T> {
    public container: SVGElement;
    constructor(public data: T) {}
    transform(transformation: Transformation) {
        transform(this.container, transformation);
    }
}

export function createSVGElement<T extends SVGElement>(
    tagName: string, props?: {
        classes?: string[],
        attrs?: {[key: string]: any;},
        transform?: Transformation,
        textContent?: string,
        children?: SVGElement[],
    }): T {
    const ele = document.createElementNS(SVG_NS, tagName);
    if (props) {
        if (props.classes) {
            props.classes.filter(clazz => !!clazz)
                .forEach(clazz => ele.classList.add(clazz));
        }
        if (props.attrs) {
            Object.entries(props.attrs).forEach(([key, value]) => {
                ele.setAttribute(key, value.toString());
            });
        }
        if (props.transform) {
            transform(ele, props.transform);
        }
        if (props.textContent) {
            ele.textContent = props.textContent;
        }
        if (props.children) {
            props.children.forEach(child => { ele.appendChild(child); });
        }
    }
    return ele as T;
}

export function removeChildren(ele: Element) {
    while (ele.firstChild)
        ele.removeChild(ele.lastChild);
}
