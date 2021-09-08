declare namespace JSX {
  type El = globalThis.Element;
  type Element = zQuery;

  type HTMLTags = keyof JSX.IntrinsicElements & keyof HTMLElementTagNameMap;
  type SVGTags = keyof JSX.IntrinsicElements & keyof SVGElementTagNameMap;

  type Props<T> = T extends (props: infer P) => Result ? P : {};
  type FunctionComponent<T extends El = El> = (
    props: {},
    children: zQuery<T>
  ) => Result<T>;
  type TagComponent = string;
  type Component<T extends El = El> = FunctionComponent<T> | TagComponent;

  type Child<T extends El = El> = string | T | zQuery<T> | Child<T>[];
  type Result<T extends El = El> = zQuery<T>;

  type IntrinsicElements = {
    a: {};
    abbr: {};
    address: {};
    area: {};
    article: {};
    aside: {};
    audio: {};
    b: {};
    base: {};
    bdi: {};
    bdo: {};
    big: {};
    blockquote: {};
    body: {};
    br: {};
    button: {};
    canvas: {};
    caption: {};
    cite: {};
    code: {};
    col: {};
    colgroup: {};
    data: {};
    datalist: {};
    dd: {};
    del: {};
    details: {};
    dfn: {};
    dialog: {};
    div: {};
    dl: {};
    dt: {};
    em: {};
    embed: {};
    fieldset: {};
    figcaption: {};
    figure: {};
    footer: {};
    form: {};
    head: {};
    header: {};
    hgroup: {};
    hr: {};
    html: {};
    i: {};
    iframe: {};
    img: {};
    input: {};
    ins: {};
    kbd: {};
    keygen: {};
    label: {};
    legend: {};
    li: {};
    link: {};
    main: {};
    map: {};
    mark: {};
    menu: {};
    menuitem: {};
    meta: {};
    meter: {};
    nav: {};
    noindex: {};
    noscript: {};
    object: {};
    ol: {};
    optgroup: {};
    option: {};
    output: {};
    p: {};
    param: {};
    picture: {};
    pre: {};
    progress: {};
    q: {};
    rp: {};
    rt: {};
    ruby: {};
    s: {};
    samp: {};
    slot: {};
    script: {};
    section: {};
    select: {};
    small: {};
    source: {};
    span: {};
    strong: {};
    style: {};
    sub: {};
    summary: {};
    sup: {};
    table: {};
    template: {};
    tbody: {};
    td: {};
    textarea: {};
    tfoot: {};
    th: {};
    thead: {};
    time: {};
    title: {};
    tr: {};
    track: {};
    u: {};
    ul: {};
    video: {};
    wbr: {};
    webview: {};
    svg: {};
    animate: {};
    animateMotion: {};
    animateTransform: {};
    circle: {};
    clipPath: {};
    defs: {};
    desc: {};
    ellipse: {};
    feBlend: {};
    feColorMatrix: {};
    feComponentTransfer: {};
    feComposite: {};
    feConvolveMatrix: {};
    feDiffuseLighting: {};
    feDisplacementMap: {};
    feDistantLight: {};
    feDropShadow: {};
    feFlood: {};
    feFuncA: {};
    feFuncB: {};
    feFuncG: {};
    feFuncR: {};
    feGaussianBlur: {};
    feImage: {};
    feMerge: {};
    feMergeNode: {};
    feMorphology: {};
    feOffset: {};
    fePointLight: {};
    feSpecularLighting: {};
    feSpotLight: {};
    feTile: {};
    feTurbulence: {};
    filter: {};
    foreignObject: {};
    g: {};
    image: {};
    line: {};
    linearGradient: {};
    marker: {};
    mask: {};
    metadata: {};
    mpath: {};
    path: {};
    pattern: {};
    polygon: {};
    polyline: {};
    radialGradient: {};
    rect: {};
    stop: {};
    switch: {};
    symbol: {};
    text: {};
    textPath: {};
    tspan: {};
    use: {};
    view: {};
  };
}

/**
 * A function that can make zQuery instances from JSX-style parameters.
 * @param tag The name of an HTML tag.
 * @param attrs Attributes to set on the created element.
 * @param children Children to place within the created element.
 * @returns A zQuery representing the created JSX.
 */
declare function jsx<T extends JSX.HTMLTags>(
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
declare function jsx<T extends JSX.SVGTags>(
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
declare function jsx<K extends JSX.FunctionComponent>(
  component: K,
  attrs?: JSX.Props<K> | null,
  ...children: JSX.Child[]
): zQuery<JSX.El>;
