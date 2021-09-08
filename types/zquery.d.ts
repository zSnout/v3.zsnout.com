/** The main zQuery class, used to create zQuery collections which provide shorthands for DOM manipulation. */
interface zQuery<T extends Element> extends Array<T> {
  /**
   * The constructor for the zQuery class.
   * @param els The elements to add to this collection.
   */
  constructor(...els: T[]): zQuery<T>;

  /**
   * Gets the text content of an element.
   * @returns The text content of the first element.
   */
  text(): string;

  /**
   * Replaces the text content of some elements.
   * @param text The text content to replace elements with.
   */
  text(text: string): void;

  /**
   * Gets the attribute value of an element.
   * @param key The key of the attribute to get.
   * @returns The value of the attribute on the first element in the collection, or `undefined`.
   */
  attr(key: string): string;

  /**
   * Sets an attribute value on some elements.
   * @param key The key of the attribute to set.
   * @param val The value to set the attribute to.
   */
  attr(key: string, val: string): void;

  /**
   * Gets the value of an input field.
   * @returns The value of the first matched element.
   */
  val(): string | void;

  /**
   * Sets the value of input fields.
   * @param text The value to set the fields to.
   */
  val(text: string): void;
}

/**
 * A function that can make zQuery instances from CSS selectors, DOM elements, and zQueries.
 * @param tag An HTML tag name.
 * @returns A zQuery instance made up of that tag.
 */
declare function $<T extends keyof HTMLElementTagNameMap>(
  selector: T
): zQuery<HTMLElementTagNameMap[T]>;

/**
 * A function that can make zQuery instances from CSS selectors, DOM elements, and zQueries.
 * @param tag An SVG tag name.
 * @returns A zQuery instance made up of that tag.
 */
declare function $<T extends keyof SVGElementTagNameMap>(
  selector: T
): zQuery<SVGElementTagNameMap[T]>;

/**
 * A function that can make zQuery instances from CSS selectors, DOM elements, and zQueries.
 * @param selector Either a CSS selector or a zQuery instance.
 * @returns A zQuery instance.
 */
declare function $<T extends Element>(
  ...selectors: (string | T | zQuery<T>)[]
): zQuery<T>;
