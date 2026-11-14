/* @ds-bundle: {"format":4,"namespace":"BeautyDesignSystem_421f64","components":[{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"StarRating","sourcePath":"components/commerce/StarRating.jsx"},{"name":"StepCard","sourcePath":"components/commerce/StepCard.jsx"},{"name":"TimelineItem","sourcePath":"components/commerce/TimelineItem.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"ICON_NAMES","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"LeafDecor","sourcePath":"components/core/LeafDecor.jsx"},{"name":"SectionHeading","sourcePath":"components/core/SectionHeading.jsx"},{"name":"StatBlock","sourcePath":"components/core/StatBlock.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"SiteFooter","sourcePath":"components/navigation/SiteFooter.jsx"},{"name":"SocialIconButton","sourcePath":"components/navigation/SocialIconButton.jsx"},{"name":"Wordmark","sourcePath":"components/navigation/Wordmark.jsx"},{"name":"Home","sourcePath":"ui_kits/website/Home.jsx"},{"name":"HeroSection","sourcePath":"ui_kits/website/HomeSections.jsx"},{"name":"ServicePanel","sourcePath":"ui_kits/website/HomeSections.jsx"},{"name":"StepsSection","sourcePath":"ui_kits/website/HomeSections.jsx"},{"name":"IngredientsSection","sourcePath":"ui_kits/website/HomeSections.jsx"},{"name":"BestSellersSection","sourcePath":"ui_kits/website/HomeSections.jsx"},{"name":"ProductDetail","sourcePath":"ui_kits/website/ProductDetail.jsx"},{"name":"Shop","sourcePath":"ui_kits/website/Shop.jsx"},{"name":"ASSETS","sourcePath":"ui_kits/website/content.jsx"},{"name":"NAV","sourcePath":"ui_kits/website/content.jsx"},{"name":"FOOTER_COLUMNS","sourcePath":"ui_kits/website/content.jsx"},{"name":"STEPS","sourcePath":"ui_kits/website/content.jsx"},{"name":"DAYS","sourcePath":"ui_kits/website/content.jsx"},{"name":"PRODUCTS","sourcePath":"ui_kits/website/content.jsx"},{"name":"STATS","sourcePath":"ui_kits/website/content.jsx"},{"name":"Container","sourcePath":"ui_kits/website/content.jsx"},{"name":"Section","sourcePath":"ui_kits/website/content.jsx"}],"sourceHashes":{"components/commerce/ProductCard.jsx":"cf8f6d5b2248","components/commerce/StarRating.jsx":"2e53114d569f","components/commerce/StepCard.jsx":"d26ded593b44","components/commerce/TimelineItem.jsx":"6feb57fc31d2","components/core/Button.jsx":"2c956bb39566","components/core/Card.jsx":"2604783292a2","components/core/Eyebrow.jsx":"e3992bac516d","components/core/Icon.jsx":"cd0005164083","components/core/IconButton.jsx":"9a45e96ef257","components/core/LeafDecor.jsx":"8adaea92c46e","components/core/SectionHeading.jsx":"0376782add52","components/core/StatBlock.jsx":"ffdf664cf112","components/navigation/NavBar.jsx":"4b90694ff756","components/navigation/SiteFooter.jsx":"ef3e9c255923","components/navigation/SocialIconButton.jsx":"94d5eb391416","components/navigation/Wordmark.jsx":"8fb4c0ed5f54","ui_kits/website/Home.jsx":"94f08ab15c20","ui_kits/website/HomeSections.jsx":"1bca7b940372","ui_kits/website/ProductDetail.jsx":"5df116c3ece4","ui_kits/website/Shop.jsx":"5327886791ea","ui_kits/website/content.jsx":"b0a000fbb78d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BeautyDesignSystem_421f64 = window.BeautyDesignSystem_421f64 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/commerce/StepCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** One of the four "how it works" steps: numbered circular photo, serif caps label, short copy. */
function StepCard({
  index,
  image,
  label,
  body,
  size = 'var(--step-circle-size)',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 'var(--space-6)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-circle)',
      overflow: 'hidden',
      background: 'var(--surface-blob)',
      border: 'var(--border-width-ring) solid var(--border-ring)',
      boxShadow: hover ? 'var(--shadow-card)' : 'none',
      transform: hover ? 'var(--lift-hover)' : 'none',
      transition: 'var(--transition-lift)'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: label,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), index != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -2,
      left: -2,
      width: 'var(--step-badge-size)',
      height: 'var(--step-badge-size)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-circle)',
      background: 'var(--green-600)',
      color: 'var(--text-inverse)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      lineHeight: 1
    }
  }, index)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'var(--type-step-label-family)',
      fontSize: 'var(--type-step-label-size)',
      fontWeight: 'var(--weight-display)',
      letterSpacing: 'var(--type-step-label-tracking)',
      textTransform: 'uppercase',
      color: 'var(--text-heading)',
      lineHeight: 1
    }
  }, label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: '24ch',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1.9,
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, body)));
}
Object.assign(__ds_scope, { StepCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/StepCard.jsx", error: String((e && e.message) || e) }); }

// components/commerce/TimelineItem.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** A day in the routine timeline. Inactive rows fade back; the active row lifts onto a card. */
function TimelineItem({
  image,
  title,
  body,
  active = false,
  onSelect,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const lit = active || hover;
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onSelect,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    role: onSelect ? 'button' : undefined,
    tabIndex: onSelect ? 0 : undefined,
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      alignItems: 'flex-start',
      padding: 'var(--space-6)',
      borderRadius: 'var(--radius-md)',
      background: active ? 'var(--surface-card)' : 'transparent',
      boxShadow: active ? 'var(--shadow-card)' : 'none',
      opacity: active ? 1 : lit ? 0.75 : 0.42,
      cursor: onSelect ? 'pointer' : 'default',
      transition: 'opacity var(--duration-base) var(--ease-standard), box-shadow var(--duration-base) var(--ease-standard), background-color var(--duration-base) var(--ease-standard)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      flex: '0 0 auto',
      borderRadius: 'var(--radius-circle)',
      overflow: 'hidden',
      background: 'var(--surface-tint)'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--weight-display)',
      color: 'var(--text-heading)',
      lineHeight: 1.2
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: '30ch',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1.85,
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, body)));
}
Object.assign(__ds_scope, { TimelineItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/TimelineItem.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  md: {
    height: 'var(--button-height)',
    padding: '0 var(--button-padding-x)',
    fontSize: 'var(--text-sm)'
  },
  sm: {
    height: 'var(--button-height-sm)',
    padding: '0 var(--button-padding-x-sm)',
    fontSize: 'var(--text-xs)'
  }
};

/** The brand's action. Always a pill; primary is solid leaf green, ghost is a hairline outline. */
function Button({
  variant = 'primary',
  size = 'md',
  children,
  href,
  onClick,
  disabled = false,
  iconBefore,
  iconAfter,
  fullWidth = false,
  type = 'button',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const skin = {
    primary: {
      background: press ? 'var(--action-primary-bg-active)' : hover ? 'var(--action-primary-bg-hover)' : 'var(--action-primary-bg)',
      color: 'var(--action-primary-fg)',
      border: '1px solid transparent'
    },
    ghost: {
      background: hover ? 'var(--action-ghost-bg-hover)' : 'transparent',
      color: 'var(--action-ghost-fg)',
      border: 'var(--border-width-ghost) solid var(--action-ghost-border)'
    },
    quiet: {
      background: 'transparent',
      color: hover ? 'var(--action-quiet-fg-hover)' : 'var(--action-quiet-fg)',
      border: '1px solid transparent',
      padding: 0,
      height: 'auto'
    }
  }[variant] || {};
  const Tag = href && !disabled ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    type: Tag === 'button' ? type : undefined,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      height: s.height,
      padding: s.padding,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--type-button-family)',
      fontSize: s.fontSize,
      fontWeight: 'var(--type-button-weight)',
      lineHeight: 'var(--leading-flat)',
      letterSpacing: 'var(--tracking-nav)',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transform: press && !disabled && variant !== 'quiet' ? 'var(--press-scale)' : 'none',
      transition: 'var(--transition-color), transform var(--duration-fast) var(--ease-standard)',
      ...skin,
      ...style
    }
  }, rest), iconBefore, children, iconAfter);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RADII = {
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)'
};
const SHADOWS = {
  none: 'none',
  card: 'var(--shadow-card)',
  panel: 'var(--shadow-panel)'
};

/** White rounded surface: the service panel, the best-sellers panel, the timeline row. */
function Card({
  children,
  radius = 'lg',
  elevation = 'card',
  padding = 'var(--card-padding)',
  bleed = false,
  hoverLift = false,
  as = 'div',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    onMouseEnter: hoverLift ? () => setHover(true) : undefined,
    onMouseLeave: hoverLift ? () => setHover(false) : undefined,
    style: {
      background: 'var(--surface-card)',
      borderRadius: RADII[radius] || radius,
      boxShadow: hover ? 'var(--shadow-hover)' : SHADOWS[elevation] || elevation,
      padding: bleed ? 0 : padding,
      overflow: bleed ? 'hidden' : undefined,
      transform: hover ? 'var(--lift-hover)' : 'none',
      transition: 'var(--transition-lift)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Small green kicker that sits above every section title in the brand. */
function Eyebrow({
  children,
  align = 'inherit',
  tone = 'accent',
  as = 'p',
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      margin: 0,
      textAlign: align === 'inherit' ? undefined : align,
      fontFamily: 'var(--type-eyebrow-family)',
      fontSize: 'var(--type-eyebrow-size)',
      fontWeight: 'var(--type-eyebrow-weight)',
      letterSpacing: 'var(--type-eyebrow-tracking)',
      lineHeight: 'var(--leading-snug)',
      color: tone === 'accent' ? 'var(--text-accent)' : tone === 'muted' ? 'var(--text-muted)' : 'var(--text-inverse)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Registry: [viewBox, paintMode, inner markup]. Paths copied verbatim from Lucide (ISC),
   Bootstrap Icons (MIT) and Simple Icons (CC0) — see assets/icons/README.md. Rendered as
   inline SVG so colour follows currentColor and the glyph survives export/screenshot. */
const ICONS = {
  'search': ['0 0 24 24', 'stroke', '<path d="m21 21-4.34-4.34" /> <circle cx="11" cy="11" r="8" />'],
  'shopping-bag': ['0 0 24 24', 'stroke', '<path d="M16 10a4 4 0 0 1-8 0" /> <path d="M3.103 6.034h17.794" /> <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />'],
  'align-left': ['0 0 24 24', 'stroke', '<path d="M21 5H3" /> <path d="M15 12H3" /> <path d="M17 19H3" />'],
  'leaf': ['0 0 24 24', 'stroke', '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /> <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />'],
  'phone': ['0 0 24 24', 'stroke', '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />'],
  'map-pin': ['0 0 24 24', 'stroke', '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /> <circle cx="12" cy="10" r="3" />'],
  'arrow-right': ['0 0 24 24', 'stroke', '<path d="M5 12h14" /> <path d="m12 5 7 7-7 7" />'],
  'arrow-left': ['0 0 24 24', 'stroke', '<path d="m12 19-7-7 7-7" /> <path d="M19 12H5" />'],
  'chevron-right': ['0 0 24 24', 'stroke', '<path d="m9 18 6-6-6-6" />'],
  'chevron-left': ['0 0 24 24', 'stroke', '<path d="m15 18-6-6 6-6" />'],
  'plus': ['0 0 24 24', 'stroke', '<path d="M5 12h14" /> <path d="M12 5v14" />'],
  'minus': ['0 0 24 24', 'stroke', '<path d="M5 12h14" />'],
  'check': ['0 0 24 24', 'stroke', '<path d="M20 6 9 17l-5-5" />'],
  'x': ['0 0 24 24', 'stroke', '<path d="M18 6 6 18" /> <path d="m6 6 12 12" />'],
  'heart': ['0 0 24 24', 'stroke', '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />'],
  'truck': ['0 0 24 24', 'stroke', '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /> <path d="M15 18H9" /> <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /> <circle cx="17" cy="18" r="2" /> <circle cx="7" cy="18" r="2" />'],
  'sparkles': ['0 0 24 24', 'stroke', '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /> <path d="M20 2v4" /> <path d="M22 4h-4" /> <circle cx="4" cy="20" r="2" />'],
  'menu': ['0 0 24 24', 'stroke', '<path d="M4 5h16" /> <path d="M4 12h16" /> <path d="M4 19h16" />'],
  'user': ['0 0 24 24', 'stroke', '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /> <circle cx="12" cy="7" r="4" />'],
  'star': ['0 0 24 24', 'stroke', '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />'],
  'star-fill': ['0 0 16 16', 'fill', '<path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>'],
  'brand-facebook': ['0 0 24 24', 'fill', '<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/>'],
  'brand-youtube': ['0 0 24 24', 'fill', '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'],
  'brand-instagram': ['0 0 24 24', 'fill', '<path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>'],
  'brand-twitter': ['0 0 24 24', 'fill', '<path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z"/>'],
  'brand-x': ['0 0 24 24', 'fill', '<path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/>']
};

/** Brand glyph. Inherits colour from `color` (any token) and sizes to `size`. */
function Icon({
  name,
  set,
  size = 'var(--icon-size)',
  color = 'currentColor',
  title,
  style,
  ...rest
}) {
  const key = set === 'brand' && !String(name).startsWith('brand-') ? 'brand-' + name : name;
  const entry = ICONS[key];
  if (!entry) return null;
  const [viewBox, mode, inner] = entry;
  const filled = mode === 'fill';
  return /*#__PURE__*/React.createElement("svg", _extends({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: viewBox,
    width: size,
    height: size,
    fill: filled ? 'currentColor' : 'none',
    stroke: filled ? 'none' : 'currentColor',
    strokeWidth: filled ? undefined : 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    role: "img",
    "aria-hidden": title ? undefined : 'true',
    "aria-label": title,
    style: {
      display: 'inline-block',
      flex: '0 0 auto',
      color,
      fill: filled ? color : 'none',
      stroke: filled ? 'none' : color,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: inner
    }
  }, rest));
}

/** Every glyph name in the system. */
const ICON_NAMES = Object.keys(ICONS);
Object.assign(__ds_scope, { Icon, ICON_NAMES });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/commerce/StarRating.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Five gold stars plus the numeric score, exactly as it reads under a product name. */
function StarRating({
  value = 5,
  max = 5,
  showScore = true,
  size = 11,
  align = 'center',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      justifyContent: align === 'center' ? 'center' : 'flex-start',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 1
    }
  }, Array.from({
    length: max
  }).map((_, i) => /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    key: i,
    name: "star-fill",
    size: `${size}px`,
    color: i < Math.round(value) ? 'var(--rating-star)' : 'var(--rating-star-empty)'
  }))), showScore && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-muted)',
      lineHeight: 1
    }
  }, value.toFixed(1)));
}
Object.assign(__ds_scope, { StarRating });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/StarRating.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Shop tile: cut-out product photo, sentence-case name, rating, green price, pill action.
 *  `featured` lifts the middle tile of a row onto a white card, as on the home page. */
function ProductCard({
  image,
  name,
  price,
  rating = 5,
  ctaLabel = 'Select options',
  featured = false,
  onAction,
  imageHeight = 230,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-4)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: imageHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: featured ? 'var(--space-6)' : 0,
      boxSizing: 'border-box',
      background: featured ? 'var(--surface-card)' : 'transparent',
      borderRadius: featured ? 'var(--radius-md)' : 0,
      boxShadow: featured || hover ? 'var(--shadow-card)' : 'none',
      transition: 'var(--transition-lift)'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      mixBlendMode: 'multiply'
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure-card)',
      textAlign: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 'var(--weight-regular)',
      lineHeight: 1.5,
      color: 'var(--ink-800)',
      letterSpacing: 0,
      textWrap: 'pretty'
    }
  }, name), /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    value: rating
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--text-price)',
      lineHeight: 1
    }
  }, price), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    size: "sm",
    onClick: onAction
  }, ctaLabel));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Bare icon affordance used in the site header (search, bag, menu). Optional count badge. */
function IconButton({
  icon,
  label,
  badge,
  size = 'var(--icon-size)',
  variant = 'quiet',
  onClick,
  href,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const filled = variant === 'filled';
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    type: Tag === 'button' ? 'button' : undefined,
    "aria-label": label,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: filled ? 'var(--social-button-size)' : '34px',
      height: filled ? 'var(--social-button-size)' : '34px',
      borderRadius: 'var(--radius-circle)',
      border: 0,
      cursor: 'pointer',
      padding: 0,
      background: filled ? hover ? 'var(--green-700)' : 'var(--green-600)' : hover ? 'var(--surface-tint)' : 'transparent',
      color: filled ? 'var(--text-inverse)' : hover ? 'var(--green-600)' : 'var(--ink-800)',
      transition: 'var(--transition-color)',
      ...style
    }
  }, rest), typeof icon === 'string' ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size
  }) : icon, badge != null && badge !== 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -1,
      right: -1,
      minWidth: 15,
      height: 15,
      padding: '0 4px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--badge-bg)',
      color: 'var(--badge-fg)',
      fontFamily: 'var(--font-sans)',
      fontSize: '9px',
      fontWeight: 'var(--weight-bold)',
      lineHeight: '15px',
      textAlign: 'center',
      boxShadow: '0 0 0 2px var(--surface-page)'
    }
  }, badge));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/LeafDecor.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Cut-out palm frond parked at a section edge. Purely decorative; never clickable. */
function LeafDecor({
  src,
  side = 'left',
  width = 180,
  top,
  bottom = 0,
  flip = false,
  opacity = 1,
  rotate = 0,
  style,
  ...rest
}) {
  if (!src) return null;
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src,
    alt: "",
    "aria-hidden": "true",
    draggable: "false",
    style: {
      position: 'absolute',
      width,
      height: 'auto',
      pointerEvents: 'none',
      userSelect: 'none',
      [side]: 0,
      top,
      bottom: top == null ? bottom : undefined,
      opacity,
      transform: `${flip ? 'scaleX(-1)' : ''} ${rotate ? `rotate(${rotate}deg)` : ''}`.trim() || undefined,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { LeafDecor });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/LeafDecor.jsx", error: String((e && e.message) || e) }); }

// components/core/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  hero: {
    fontSize: 'var(--type-hero-size)',
    lineHeight: 'var(--leading-hero)',
    letterSpacing: 'var(--tracking-hero)'
  },
  display: {
    fontSize: 'var(--text-display)',
    lineHeight: 'var(--leading-display)',
    letterSpacing: 'var(--tracking-display)'
  },
  title: {
    fontSize: 'var(--text-title)',
    lineHeight: 'var(--leading-title)',
    letterSpacing: 'var(--tracking-display)'
  }
};

/** Eyebrow + serif title + optional lede. The brand's only section-opening pattern. */
function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'center',
  size = 'display',
  as = 'h2',
  maxWidth,
  children,
  style,
  ...rest
}) {
  const Tag = as;
  const centered = align === 'center';
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      alignItems: centered ? 'center' : 'flex-start',
      textAlign: centered ? 'center' : 'left',
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, eyebrow), /*#__PURE__*/React.createElement(Tag, {
    style: {
      margin: 0,
      fontFamily: 'var(--type-section-family)',
      fontWeight: 'var(--weight-display)',
      color: 'var(--text-heading)',
      textWrap: 'balance',
      maxWidth: maxWidth || undefined,
      ...SIZES[size]
    }
  }, title), lede && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure-lede)',
      fontFamily: 'var(--type-body-family)',
      fontSize: 'var(--type-body-size)',
      lineHeight: 'var(--type-body-leading)',
      color: 'var(--text-body)',
      textWrap: 'pretty'
    }
  }, lede), children);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/core/StatBlock.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Serif green metric with a hairline above it — the proof row inside the service panel. */
function StatBlock({
  value,
  label,
  rule = true,
  align = 'left',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      paddingTop: rule ? 'var(--space-5)' : 0,
      borderTop: rule ? 'var(--border-width-hairline) solid var(--border-hairline)' : 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--type-stat-family)',
      fontSize: 'var(--type-stat-size)',
      fontWeight: 'var(--weight-display)',
      lineHeight: 'var(--leading-flat)',
      color: 'var(--text-accent)'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1.55,
      color: 'var(--text-body)',
      textAlign: align === 'center' ? 'center' : 'left'
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatBlock.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SocialIconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const BRANDS = {
  facebook: 'facebook',
  youtube: 'youtube',
  twitter: 'twitter',
  x: 'x',
  instagram: 'instagram'
};

/** Small filled green circle holding a social mark — the footer's only ornament. */
function SocialIconButton({
  brand,
  href = '#',
  label,
  size = 'var(--social-button-size)',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    "aria-label": label || brand,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: 'var(--radius-circle)',
      background: hover ? 'var(--green-700)' : 'var(--green-600)',
      transition: 'var(--transition-color)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    set: "brand",
    name: BRANDS[brand] || brand,
    size: "14px",
    color: "var(--text-inverse)"
  }));
}
Object.assign(__ds_scope, { SocialIconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SocialIconButton.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The brand mark: the word "Beauty" set in bold sans with a full stop. There is no logo
 *  glyph in the source material — the wordmark IS the logo. Never redraw it as art. */
function Wordmark({
  label = 'Beauty.',
  size = 22,
  tone = 'ink',
  href,
  as = 'span',
  style,
  ...rest
}) {
  const Tag = href ? 'a' : as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: size,
      fontWeight: 'var(--weight-bold)',
      letterSpacing: '-0.02em',
      lineHeight: 1,
      textDecoration: 'none',
      color: tone === 'inverse' ? 'var(--text-inverse)' : 'var(--ink-900)',
      ...style
    }
  }, rest), label);
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Site header: wordmark left, centred link row, utilities right. Sits on white or
 *  directly over hero photography with no background of its own. */
function NavBar({
  items = [],
  activeItem,
  onNavigate,
  cartCount = 0,
  accountLabel = 'Login / Register',
  onSearch,
  onMenu,
  transparent = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-10)',
      height: 'var(--nav-height)',
      padding: '0 var(--space-9)',
      boxSizing: 'border-box',
      background: transparent ? 'transparent' : 'var(--surface-page)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onNavigate && onNavigate(items[0]);
    }
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-8)'
    }
  }, items.map(item => {
    const label = typeof item === 'string' ? item : item.label;
    const active = (activeItem || '') === label;
    return /*#__PURE__*/React.createElement("a", {
      key: label,
      href: item && item.href || '#',
      onClick: e => {
        if (onNavigate) {
          e.preventDefault();
          onNavigate(item);
        }
      },
      style: {
        fontFamily: 'var(--type-nav-family)',
        fontSize: 'var(--type-nav-size)',
        fontWeight: 'var(--type-nav-weight)',
        letterSpacing: 'var(--tracking-nav)',
        color: active ? 'var(--nav-link-active)' : 'var(--nav-link)',
        textDecoration: 'none',
        transition: 'var(--transition-color)'
      },
      onMouseEnter: e => {
        e.currentTarget.style.color = 'var(--nav-link-active)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.color = active ? 'var(--nav-link-active)' : 'var(--nav-link)';
      }
    }, label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--weight-medium)',
      color: 'var(--ink-700)',
      textDecoration: 'none'
    }
  }, accountLabel), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "search",
    label: "Search",
    onClick: onSearch,
    size: "17px"
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "shopping-bag",
    label: "Cart",
    badge: cartCount,
    size: "17px"
  }), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "align-left",
    label: "Menu",
    onClick: onMenu,
    size: "17px"
  })));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/SiteFooter.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Pale-green footer band: wordmark + phone + address, two link columns, social circles,
 *  hairline, centred copyright. */
function SiteFooter({
  phone = '(88) - 1234 45678',
  address = ['184 Yellow Modan Main Road, Jalrabary', 'New York 1236'],
  columns = [],
  socials = ['facebook', 'youtube', 'twitter', 'instagram'],
  socialsTitle = 'Follow Us',
  copyright = 'Copyright © 2022 Beauty. All Rights Reserved.',
  style,
  ...rest
}) {
  const colTitle = {
    margin: 0,
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--weight-medium)',
    color: 'var(--text-muted)'
  };
  return /*#__PURE__*/React.createElement("footer", _extends({
    style: {
      background: 'var(--surface-footer)',
      padding: 'var(--space-11) var(--space-9) var(--space-7)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 'var(--space-9)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: 20
  }), /*#__PURE__*/React.createElement("a", {
    href: `tel:${phone.replace(/[^0-9+]/g, '')}`,
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-md)',
      fontWeight: 'var(--weight-bold)',
      color: 'var(--text-accent)',
      textDecoration: 'none'
    }
  }, phone), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1.9,
      color: 'var(--text-muted)'
    }
  }, address.map((line, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, line, /*#__PURE__*/React.createElement("br", null))))), columns.map((col, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: colTitle
  }, col.title), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)'
    }
  }, col.links.map(l => /*#__PURE__*/React.createElement("li", {
    key: typeof l === 'string' ? l : l.label
  }, /*#__PURE__*/React.createElement("a", {
    href: l && l.href || '#',
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--ink-800)',
      textDecoration: 'none'
    }
  }, typeof l === 'string' ? l : l.label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: colTitle
  }, socialsTitle), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)'
    }
  }, socials.map(s => /*#__PURE__*/React.createElement(__ds_scope.SocialIconButton, {
    key: s,
    brand: s
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: 'var(--space-11) auto 0',
      paddingTop: 'var(--space-6)',
      borderTop: 'var(--border-width-hairline) solid var(--border-hairline)',
      textAlign: 'center',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, copyright));
}
Object.assign(__ds_scope, { SiteFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/SiteFooter.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/content.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Asset base for kit screens. Override with window.BEAUTY_ASSET_BASE when mounting elsewhere. */
const ASSETS = typeof window !== 'undefined' && window.BEAUTY_ASSET_BASE || '../../assets/images/';
const NAV = ['Home', 'Shop', 'Pages', 'Blog', 'Contact'];
const FOOTER_COLUMNS = [{
  title: 'Useful Links',
  links: ['About', 'News', 'Partners']
}, {
  links: ['Delivery and payment', 'Terms of sale', 'Contacts']
}];
const STEPS = [{
  index: 1,
  label: 'Wash',
  image: ASSETS + 'step-1-wash.png',
  body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.'
}, {
  index: 2,
  label: 'Make',
  image: ASSETS + 'step-2-make.png',
  body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.'
}, {
  index: 3,
  label: 'Treat',
  image: ASSETS + 'step-3-treat.png',
  body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.'
}, {
  index: 4,
  label: 'Natural',
  image: ASSETS + 'step-4-natural.png',
  body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.'
}];
const DAYS = [{
  title: 'Day 1',
  image: ASSETS + 'timeline-day-1.png',
  body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.'
}, {
  title: 'Day 2',
  image: ASSETS + 'timeline-day-2.png',
  body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.'
}, {
  title: 'Day 3',
  image: ASSETS + 'timeline-day-3.png',
  body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.'
}];
const PRODUCTS = [{
  id: 'moisturizer',
  image: ASSETS + 'product-1-moisturizer.png',
  name: 'Clear Cell mattifying moisturizer for oily skin',
  price: '$199.99',
  ctaLabel: 'Select options'
}, {
  id: 'powder',
  image: ASSETS + 'product-2-powder.png',
  name: 'Intense brightening exfoliating powder',
  price: '$74.52 – $903.20',
  ctaLabel: 'Select options',
  featured: true
}, {
  id: 'masque',
  image: ASSETS + 'product-3-masque.png',
  name: 'Medicated acne masque',
  price: '$118.10',
  ctaLabel: 'Add to cart'
}];
const STATS = [{
  value: '97%',
  label: 'Elasticity Increase'
}, {
  value: '85%',
  label: 'Moisture Increase'
}, {
  value: '83%',
  label: 'Wrinkle Decrease'
}];

/** Shared page shell: 1200px container. */
function Container({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--container-gutter)',
      ...style
    }
  }, rest), children);
}

/** Section wrapper carrying the brand's 120px vertical rhythm. */
function Section({
  children,
  tight = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      padding: `${tight ? 'var(--section-padding-y-tight)' : 'var(--section-padding-y)'} 0`,
      position: 'relative',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { ASSETS, NAV, FOOTER_COLUMNS, STEPS, DAYS, PRODUCTS, STATS, Container, Section });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/content.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeSections.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Full-bleed hero: copy left, spa still-life photography bleeding off the right edge. */
function HeroSection({
  onShop
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 'var(--hero-min-height)',
      display: 'flex',
      alignItems: 'center',
      background: 'linear-gradient(90deg,#FFFFFF 0%,#FAFAFA 55%,#F7F6F3 100%)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: __ds_scope.ASSETS + 'hero-spa-products.png',
    alt: "Spa products, towels and palm leaves",
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '54%',
      maxWidth: 780,
      height: 'auto',
      WebkitMaskImage: 'linear-gradient(90deg,transparent 0%,#000 16%),linear-gradient(180deg,transparent 0%,#000 18%)',
      maskImage: 'linear-gradient(90deg,transparent 0%,#000 16%),linear-gradient(180deg,transparent 0%,#000 18%)',
      WebkitMaskComposite: 'source-in',
      maskComposite: 'intersect'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.LeafDecor, {
    src: __ds_scope.ASSETS + 'leaf-palm-left.png',
    side: "left",
    bottom: -6,
    width: 190
  }), /*#__PURE__*/React.createElement(__ds_scope.Container, {
    style: {
      position: 'relative',
      width: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 520,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    align: "left",
    size: "hero",
    as: "h1",
    eyebrow: "Skin Care Product",
    title: /*#__PURE__*/React.createElement(React.Fragment, null, "Bringing Out The", /*#__PURE__*/React.createElement("br", null), "Beauty In You"),
    lede: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    onClick: onShop
  }, "Shop Now")))));
}

/** Overlapping panel: photo half + introduction, three metrics and a ghost action. */
function ServicePanel({
  onTry
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Container, {
    style: {
      position: 'relative',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Card, {
    bleed: true,
    radius: "lg",
    elevation: "panel",
    style: {
      maxWidth: 980,
      margin: '-96px auto 0',
      display: 'grid',
      gridTemplateColumns: '380px 1fr'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: __ds_scope.ASSETS + 'service-diffuser-aloe.png',
    alt: "Aroma diffuser with fresh aloe leaves",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-9)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    align: "left",
    size: "title",
    eyebrow: "Introducing",
    title: "Beauty Service for You",
    lede: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-8)'
    }
  }, __ds_scope.STATS.map(s => /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    key: s.value,
    value: s.value,
    label: s.label
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    onClick: onTry
  }, "Try It Free")))));
}

/** Four circular steps under a centred heading. */
function StepsSection() {
  return /*#__PURE__*/React.createElement(__ds_scope.Section, null, /*#__PURE__*/React.createElement(__ds_scope.Container, null, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "How Does It Work",
    title: "4 Steps for Your Skin Care",
    lede: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-12)'
    }
  }, __ds_scope.STEPS.map(s => /*#__PURE__*/React.createElement(__ds_scope.StepCard, _extends({
    key: s.label
  }, s))))));
}

/** Ingredients: still-life on a mint blob beside the day-by-day routine timeline. */
function IngredientsSection() {
  const [active, setActive] = React.useState(1);
  return /*#__PURE__*/React.createElement(__ds_scope.Section, {
    tight: true
  }, /*#__PURE__*/React.createElement(__ds_scope.Container, null, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "Ingredients",
    title: "Product information",
    lede: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.05fr 1fr',
      gap: 'var(--space-11)',
      alignItems: 'center',
      marginTop: 'var(--space-11)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 44,
      bottom: 0,
      width: 300,
      height: 300,
      borderRadius: 'var(--radius-circle)',
      background: 'var(--surface-blob)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: __ds_scope.ASSETS + 'ingredients-serum-leaves.png',
    alt: "Serum bottles resting on fresh herbs",
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 470,
      mixBlendMode: 'multiply'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, __ds_scope.DAYS.map((d, i) => /*#__PURE__*/React.createElement(__ds_scope.TimelineItem, _extends({
    key: d.title
  }, d, {
    active: i === active,
    onSelect: () => setActive(i)
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 2,
      background: 'var(--border-subtle)',
      borderRadius: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: -4,
      width: 10,
      height: 10,
      borderRadius: 'var(--radius-circle)',
      background: 'var(--green-600)',
      top: `${(active + 0.5) * (100 / __ds_scope.DAYS.length)}%`,
      transform: 'translateY(-50%)',
      transition: 'top var(--duration-base) var(--ease-standard)'
    }
  }))))));
}

/** Best sellers inside a white panel, with a palm frond escaping the bottom-right corner. */
function BestSellersSection({
  onAdd
}) {
  return /*#__PURE__*/React.createElement(__ds_scope.Section, {
    tight: true,
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Container, {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.LeafDecor, {
    src: __ds_scope.ASSETS + 'leaf-palm-right.png',
    side: "right",
    bottom: -56,
    width: 200,
    style: {
      right: -34,
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    radius: "xl",
    elevation: "panel",
    padding: "var(--space-11) var(--space-10)",
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "Order Now",
    title: "Our Best Sellers"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-9)',
      alignItems: 'end'
    }
  }, __ds_scope.PRODUCTS.map(p => /*#__PURE__*/React.createElement(__ds_scope.ProductCard, _extends({
    key: p.id
  }, p, {
    onAction: () => onAdd && onAdd(p)
  })))))));
}
Object.assign(__ds_scope, { HeroSection, ServicePanel, StepsSection, IngredientsSection, BestSellersSection });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeSections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
/** Beauty. home page — the recreation of the supplied landing-page artwork. */
function Home({
  onNavigate,
  onAdd
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(__ds_scope.HeroSection, {
    onShop: () => onNavigate && onNavigate('Shop')
  }), /*#__PURE__*/React.createElement(__ds_scope.ServicePanel, {
    onTry: () => onNavigate && onNavigate('Shop')
  }), /*#__PURE__*/React.createElement(__ds_scope.StepsSection, null), /*#__PURE__*/React.createElement(__ds_scope.IngredientsSection, null), /*#__PURE__*/React.createElement(__ds_scope.BestSellersSection, {
    onAdd: onAdd
  }));
}
Object.assign(__ds_scope, { Home });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ProductDetail.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The supplied artwork contains no product page. Everything here is assembled from
   home-page patterns: the mint blob behind the still-life, the metric row from the service
   panel, the routine timeline, and a best-sellers row. No new visual language was invented. */

function ProductDetail({
  product,
  onAdd,
  onOpenProduct
}) {
  const p = product || __ds_scope.PRODUCTS[1];
  const [day, setDay] = React.useState(0);
  const related = __ds_scope.PRODUCTS.filter(x => x.id !== p.id);
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(__ds_scope.Section, {
    tight: true
  }, /*#__PURE__*/React.createElement(__ds_scope.Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-11)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      minHeight: 420
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 30,
      width: 340,
      height: 340,
      borderRadius: 'var(--radius-circle)',
      background: 'var(--surface-blob)'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: p.image,
    alt: p.name,
    style: {
      position: 'relative',
      maxHeight: 420,
      objectFit: 'contain',
      mixBlendMode: 'multiply'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Eyebrow, null, "Skin Care Product"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-display)',
      fontWeight: 'var(--weight-display)',
      lineHeight: 'var(--leading-display)',
      color: 'var(--text-heading)'
    }
  }, p.name), /*#__PURE__*/React.createElement(__ds_scope.StarRating, {
    value: 5,
    align: "left",
    size: 13
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure-lede)',
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--text-body)'
    }
  }, "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-stat)',
      fontWeight: 'var(--weight-display)',
      color: 'var(--text-price)',
      lineHeight: 1
    }
  }, p.price), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    onClick: () => onAdd && onAdd(p)
  }, "Add to cart"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost"
  }, "Try It Free")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-4)'
    }
  }, __ds_scope.STATS.map(s => /*#__PURE__*/React.createElement(__ds_scope.StatBlock, {
    key: s.value,
    value: s.value,
    label: s.label
  }))))))), /*#__PURE__*/React.createElement(__ds_scope.Section, {
    tight: true,
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Container, null, /*#__PURE__*/React.createElement(__ds_scope.Card, {
    radius: "xl",
    elevation: "panel",
    padding: "var(--space-10)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.1fr',
      gap: 'var(--space-10)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    align: "left",
    size: "title",
    eyebrow: "How To Use",
    title: "Your three-day routine",
    lede: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit."
  }), /*#__PURE__*/React.createElement("div", null, __ds_scope.DAYS.map((d, i) => /*#__PURE__*/React.createElement(__ds_scope.TimelineItem, _extends({
    key: d.title
  }, d, {
    active: i === day,
    onSelect: () => setDay(i)
  })))))))), /*#__PURE__*/React.createElement(__ds_scope.Section, {
    tight: true,
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Container, null, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "Order Now",
    title: "You may also like"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 'var(--space-8)',
      marginTop: 'var(--space-9)',
      maxWidth: 760,
      margin: 'var(--space-9) auto 0'
    }
  }, related.map(r => /*#__PURE__*/React.createElement(__ds_scope.ProductCard, _extends({
    key: r.id
  }, r, {
    featured: false,
    onAction: () => onOpenProduct && onOpenProduct(r)
  })))))));
}
Object.assign(__ds_scope, { ProductDetail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ProductDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Shop.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The supplied artwork contains no shop listing. This screen is composed only from
   home-page patterns (SectionHeading, ProductCard, the pill filter reuses Button) so it
   stays inside the brand — see README.md > "What is recreated vs composed". */

const CATEGORIES = ['All products', 'Moisturizer', 'Serum', 'Masque', 'Cleanser'];
function Shop({
  onAdd,
  onOpenProduct
}) {
  const [category, setCategory] = React.useState('All products');
  const grid = [...__ds_scope.PRODUCTS, ...__ds_scope.PRODUCTS.map(p => ({
    ...p,
    id: p.id + '-b',
    featured: false
  }))];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(__ds_scope.Section, {
    tight: true,
    style: {
      paddingBottom: 0,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Container, null, /*#__PURE__*/React.createElement(__ds_scope.SectionHeading, {
    eyebrow: "Shop",
    title: "All Skin Care",
    lede: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      justifyContent: 'center',
      marginTop: 'var(--space-8)',
      flexWrap: 'wrap'
    }
  }, CATEGORIES.map(c => /*#__PURE__*/React.createElement(__ds_scope.Button, {
    key: c,
    size: "sm",
    variant: c === category ? 'primary' : 'ghost',
    onClick: () => setCategory(c)
  }, c))))), /*#__PURE__*/React.createElement(__ds_scope.Section, null, /*#__PURE__*/React.createElement(__ds_scope.Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 'var(--space-11) var(--space-8)',
      alignItems: 'end'
    }
  }, grid.map(p => /*#__PURE__*/React.createElement(__ds_scope.ProductCard, _extends({
    key: p.id
  }, p, {
    featured: false,
    onAction: () => {
      onAdd && onAdd(p);
      onOpenProduct && onOpenProduct(p);
    }
  })))))));
}
Object.assign(__ds_scope, { Shop });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Shop.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.StarRating = __ds_scope.StarRating;

__ds_ns.StepCard = __ds_scope.StepCard;

__ds_ns.TimelineItem = __ds_scope.TimelineItem;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.ICON_NAMES = __ds_scope.ICON_NAMES;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.LeafDecor = __ds_scope.LeafDecor;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.StatBlock = __ds_scope.StatBlock;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.SiteFooter = __ds_scope.SiteFooter;

__ds_ns.SocialIconButton = __ds_scope.SocialIconButton;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Home = __ds_scope.Home;

__ds_ns.HeroSection = __ds_scope.HeroSection;

__ds_ns.ServicePanel = __ds_scope.ServicePanel;

__ds_ns.StepsSection = __ds_scope.StepsSection;

__ds_ns.IngredientsSection = __ds_scope.IngredientsSection;

__ds_ns.BestSellersSection = __ds_scope.BestSellersSection;

__ds_ns.ProductDetail = __ds_scope.ProductDetail;

__ds_ns.Shop = __ds_scope.Shop;

__ds_ns.ASSETS = __ds_scope.ASSETS;

__ds_ns.NAV = __ds_scope.NAV;

__ds_ns.FOOTER_COLUMNS = __ds_scope.FOOTER_COLUMNS;

__ds_ns.STEPS = __ds_scope.STEPS;

__ds_ns.DAYS = __ds_scope.DAYS;

__ds_ns.PRODUCTS = __ds_scope.PRODUCTS;

__ds_ns.STATS = __ds_scope.STATS;

__ds_ns.Container = __ds_scope.Container;

__ds_ns.Section = __ds_scope.Section;

})();
