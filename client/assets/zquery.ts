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
 * A function that can make zQuery instances from either DOM selectors or other zQueries.
 * @param selector Either a CSS selector or a zQuery instance.
 * @returns A zQuery instance.
 */
function $<T extends Element>(selector: string | zQuery<T>): zQuery<T> {
  if (typeof selector == "string")
    return new zQuery(...document.querySelectorAll<T>(selector));

  if (selector instanceof zQuery) return selector;

  return new zQuery();
}

// @ts-ignore
globalThis.$ = $;
