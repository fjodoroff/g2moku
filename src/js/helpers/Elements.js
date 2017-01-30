
export default class Elements{
    constructor() {
        this.Template = {};
    }

    init() {
        let template = document.getElementById('g');

        template.addEventListener('page-transition-start', function() {
            this.set('app.pageTransitionDone', false);
            IOWA.Elements.NavPaperTabs.style.pointerEvents = 'none';
        });

        template.domStampedPromise = new Promise(resolve => {
            template.addEventListener('dom-change', resolve);
        });

        template.domStampedPromise.then(this.onDomBindStamp);

        this.Template = template;
    }

    onDomBindStamp() {
        //alert('onDomBindStamp');
    }
}

// let elements = new Elements();
// window.g2mokuApp.Elements = elements;