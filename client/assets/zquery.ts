/** The main zQuery class, used to create zQuery collections which provide shorthands for DOM manipulation. */
class zQuery<T extends Element = Element> extends Array<T> {
  /** The constructor for the zQuery class. */
  constructor(...selectors: (string | T | zQuery<T>)[]) {
    let els: T[] = [];

    for (let selector of selectors) {
      if (typeof selector == "string")
        els.push(...document.querySelectorAll<T>(selector));
      else if (selector instanceof Element) els.push(selector);
      else if (selector instanceof zQuery) els.push(...selector);
    }

    super(...els);
  }

  add() {}

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
 * @param tag An HTML tag name.
 * @returns A zQuery instance made up of that tag.
 */
function $<T extends keyof HTMLElementTagNameMap>(
  selector: T
): zQuery<HTMLElementTagNameMap[T]>;

/**
 * A function that can make zQuery instances from CSS selectors, DOM elements, and zQueries.
 * @param tag An SVG tag name.
 * @returns A zQuery instance made up of that tag.
 */
function $<T extends keyof SVGElementTagNameMap>(
  selector: T
): zQuery<SVGElementTagNameMap[T]>;

/**
 * A function that can make zQuery instances from CSS selectors, DOM elements, and zQueries.
 * @param selector Either a CSS selector or a zQuery instance.
 * @returns A zQuery instance.
 */
function $<T extends Element = Element>(
  ...selectors: (string | T | zQuery<T>)[]
): zQuery<T>;

/**
 * A function that can make zQuery instances from CSS selectors, DOM elements, and zQueries.
 * @param selectors A list of CSS selectors, DOM elements, and zQueries.
 * @returns A zQuery instance.
 */
function $<T extends Element = Element>(
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

function makeChild(...children: JSX.Child[]): Node[] {
  let all = [];

  for (let child of children) {
    if (typeof child == "string") all.push(document.createTextNode(child));
    else if (child instanceof Element) all.push(child);
    else if (child instanceof zQuery) all.push(...child);
    else if (child instanceof Array) all.push(...makeChild(child));
  }

  return all;
}

function makeTextlessChild(...children: JSX.Child[]): Element[] {
  let all = [];

  for (let child of children) {
    if (child instanceof Element) all.push(child);
    else if (child instanceof zQuery) all.push(...child);
    else if (child instanceof Array) all.push(...makeTextlessChild(child));
  }

  return all;
}

/**
 * A function that can make zQuery instances from JSX-style parameters.
 * @param tag The name of an HTML tag.
 * @param attrs Attributes to set on the created element.
 * @param children Children to place within the created element.
 * @returns A zQuery representing the created JSX.
 */
function jsx<T extends JSX.HTMLTags>(
  tag: T,
  attrs?: JSX.IntrinsicElements[T] | null,
  ...children: JSX.Child[]
): zQuery<HTMLElementTagNameMap[T]>;

/**
 * A function that can make zQuery instances from JSX-style parameters.
 * @param tag The name of a SVG tag.
 * @param attrs Attributes to set on the created element.
 * @param children Children to place within the created element.
 * @returns A zQuery representing the created JSX.
 */
function jsx<T extends JSX.SVGTags>(
  tag: T,
  attrs?: JSX.IntrinsicElements[T] | null,
  ...children: JSX.Child[]
): zQuery<SVGElementTagNameMap[T]>;

/**
 * A function that can make zQuery instances from JSX-style parameters.
 * @param component A function that returns a zQuery.
 * @param props Properties to pass to the function.
 * @returns A zQuery representing the created JSX.
 */
function jsx(
  component: JSX.FunctionComponent,
  attrs?: JSX.Props<typeof component> | null,
  ...children: JSX.Child[]
): zQuery<JSX.El>;

/**
 * A function that can make zQuery instances from JSX-style parameters.
 * @param component Either the name of an element or a function that returns a zQuery.
 * @param props Properties to pass to the function, or attribute to set on the element.
 * @param children Children to place within the element created.
 * @returns A zQuery representing the created JSX.
 */
function jsx(
  component: JSX.Component,
  props?: JSX.Props<typeof component> | null,
  ...children: JSX.Child[]
) {
  if (typeof component == "string") {
    let el = document.createElement(component);

    if (props)
      for (let prop in props) {
        if (prop.substr(0, 2) == "on")
          el.addEventListener(
            prop.substr(2).toLowerCase(),
            // @ts-ignore
            props[prop] as (...args: any[]) => void
          );
        // @ts-ignore
        else el[prop] = props[prop];
      }

    for (let child of makeChild(children)) el.appendChild(child);

    return new zQuery(el);
  } else if (typeof component == "function") {
    let el = component(props ?? {}, $(...makeTextlessChild(children)));

    return $(el);
  } else return $();
}

// @ts-ignore
globalThis.zQuery = zQuery;
// @ts-ignore
globalThis.$ = <T extends Element = Element>(
  ...selectors: (string | T | zQuery<T>)[]
) => new zQuery<T>(...selectors);
// @ts-ignore
globalThis.jsx = jsx;
