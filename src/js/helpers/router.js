import Utils from '../objects/Utils';

export default class Router {
    constructor() {
        /**
         * Keeps info about the router state at the start, during and
         *     after page transition.
         * @type {Object}
         */
        this.state = {
            start: null,
            current: null,
            end: null
        };

        /**
         * Transition name (data-transition attribute) to transition function map.
         * @type {Object}
         * @private
         */
        this.pageExitTransitions = {
            'hero-card-transition': 'playHeroTransitionStart',
            'page-slide-transition': 'playPageSlideOut'
        };

        /**
         * Transition name (data-transition attribute) to transition function map.
         * @type {Object}
         * @private
         */
        this.pageEnterTransitions = {
            'hero-card-transition': 'playHeroTransitionEnd',
            'page-slide-transition': 'playPageSlideIn'
        };
    }
    
    /**
     * Initializes the router.
     * @param {Object} template G2mokuApp.Elements.Template reference.
     */
    init(template) {
        this.t = template;
        console.log('LOG', this);
        this.state.current = this.parseUrl(window.location.href);
        window.addEventListener('popstate', function() {
            this.navigate(window.location.href, 'page-slide-transition');
        }.bind(this));
        document.addEventListener('click', this.onClick.bind(this));
    }

    /**
     * Handles all clicks on the document. Navigates to a new page state via
     *    ajax if the link has data-ajax-link attribute.
     * @param {Event} e Event that triggered navigation.
     * @private
     */
    onClick(e) {
        // Allow user to open page in a new tab.
        if (e.metaKey || e.ctrlKey) {
            return;
        }

        var el = Utils.getEventSender(e, 'a');
        if (el) {
            // First, record click event in GA if link requests it.
            // if (el.hasAttribute(this.t.app.ANALYTICS_LINK_ATTR)) {
            //     g2mokuApp.Analytics.trackEvent(
            //         'link', 'click', el.getAttribute(this.t.app.ANALYTICS_LINK_ATTR));
            // }
            // Ignore external links.
            if (el.target) {
                return;
            }
            // Use Polymer.AppLayout.scroll for scroll links.
            if (el.getAttribute('data-transition') === 'smooth-scroll') {
                e.preventDefault();
                return;
            }
            if (el.hasAttribute('data-ajax-link')) {
                e.preventDefault();
                e.stopPropagation();
                this.navigate(el.href, e, el);
            }
        }
    }

    /**
     * Navigates to a new state.
     * @param {string} href URL describing the new state.
     * @param {Event} e Event that triggered the transition.
     * @param {Element} source Element that triggered the transition.
     * @private
     */
    navigate(href, e, source) {
        // Copy current state to startState.
        this.state.start = this.parseUrl(this.state.current.href);
        this.state.end = this.parseUrl(href);

        // Navigate to a new page.
        if (this.state.start.page !== this.state.end.page) {
            // Imperatively update selectedPage to new page. Necessary when the link
            // navigation isn't coming from an app drawer or top nav item click.
            // In those cases, the selectedPage binding is not updated. Note: reassign
            // selectedPage to the same value is a noop in Polymer's data system.
            this.t.selectedPage = this.state.end.page;
            this.runPageTransition(e, source);
        } else if (this.state.start.subpage !== this.state.end.subpage) {
            this.runSubpageTransition();
        }
    };
    /**
     * Extracts page's state from the url.
     * Url structure:
     *    http://<origin>/PREFIX/<page>?<search>#<subpage>/<resourceId>
     * @param {string} url The page's url.
     * @return {Object} Page's state.
     */
    parseUrl(url) {
        var parser = new URL(url);
        var hashParts = parser.hash.replace('#', '').split('/');
        var params = {};
        if (parser.search) {
            var paramsList = parser.search.replace('?', '').split('&');
            for (var i = 0; i < paramsList.length; i++) {
                var paramsParts = paramsList[i].split('=');
                params[paramsParts[0]] = decodeURIComponent(paramsParts[1]);
            }
        }
        var page = parser.pathname.replace(window.PREFIX + '/', '') || 'home';

        // If pages data is accessible, find default subpage.
        var pageMeta = (this.t && this.t.pages) ? this.t.pages[page] : null;
        var defaultSubpage = pageMeta ? pageMeta.defaultSubpage : '';

        // Get subpage from url or set to the default subpage for this page.
        var subpage = hashParts[0] || defaultSubpage;
        return {
            pathname: parser.pathname,
            search: parser.search,
            hash: parser.hash,
            href: parser.href,
            page: page,
            subpage: subpage,
            resourceId: hashParts[1],
            params: params
        };
    }

    /**
     * Builds a url from the page's state details.
     * Url structure:
     *    http://<origin>/PREFIX/<page>?<search>#<subpage>/<resourceId>
     * @param {string} page Name of the page.
     * @param {string} subpage Name of the subpage.
     * @param {string} resourceId Resource identifier.
     * @param {string} search Encoded search string.
     */
    composeUrl(page, subpage, resourceId, search) {
        return [window.location.origin, window.PREFIX, '/', page, search,
            '#', subpage || '', '/', resourceId || ''].join('');
    };
}
window.g2mokuApp = window.g2mokuApp || {};
window.g2mokuApp = window.g2mokuApp || {};