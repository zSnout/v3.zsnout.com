export {};

/** The main zQuery class, used to create zQuery collections which provide shorthands for DOM manipulation. */
class zQuery<T extends Element> extends Array<T> {
  /** The constructor for the zQuery class. */
  constructor(...els: T[]) {
    super();

    this.push(...els);
  }

  /** Gets or sets the text content of an element. */
  text(text?: string): string | void {
    if (text) this.map((e) => (e.textContent = text));
    else return this[0]?.textContent ?? void 0;
  }

  /** Gets or sets the attribute value of an element. */
  attr(key: string, val?: string): string | void {
    if (val) this.map((e) => e.setAttribute(key, val));
    else return this[0]?.getAttribute?.(key) ?? void 0;
  }

  /** Gets or sets the value of an input field. */
  val(text?: string): string | void {
    if (text) this.map((e) => ((e as any as HTMLInputElement).value = text));
    else return (this[0] as any as HTMLInputElement)?.value;
  }
}

/**
 * A function that can make zQuery instances from CSS selectors, DOM elements, and zQueries.
 * @param selectors A list of CSS selectors, DOM elements, and zQueries.
 * @returns A zQuery instance.
 */
function $<T extends Element>(
  ...selectors: (string | T | zQuery<T>)[]
): zQuery<T> {
  let els: T[] = [];

  for (let selector of selectors) {
    if (typeof selector == "string")
      els.push(...document.querySelectorAll<T>(selector));
    else if (selector instanceof Element) els.push(selector);
    else if (selector instanceof zQuery) els.push(...selector);
  }

  return new zQuery(...els);
}

/**
 * A function that can make zQuery instances from JSX-style parameters.
 * @param component Either the name of an element or a function that returns a zQuery.
 * @param props Properties to pass to the function, or attribute to set on the element.
 * @param children Children to place within the element created.
 * @returns A zQuery representing the created JSX.
 */
function jsx<T extends Element, P extends {}>(
  component: string | ((props: P | null) => zQuery<T>),
  props?: P | null,
  ...children: (string | T | zQuery<T>)[]
) {
  if (typeof component == "string") {
    let el = document.createElement(component);

    if (props)
      for (let prop in props) {
        // @ts-ignore
        el[prop] = props[prop];
      }

    for (let child of children) {
      if (typeof child == "string")
        el.appendChild(document.createTextNode(child));
      else if (child instanceof Element) el.appendChild(child);
      else if (child instanceof zQuery)
        for (let elt of child) el.appendChild(elt);
    }

    return new zQuery(el);
  } else if (typeof component == "function") {
    let el = component(props ?? null);

    return $(el);
  } else return $();
}

// @ts-ignore
globalThis.$ = $;
// @ts-ignore
globalThis.jsx = jsx;
