class Expander {
    constructor(el, icon = {
        open: '\\/',
        close: '/\\',
    }, task = {
        beforeopen: null,
        beforeclose: null
    }) {
        this.isopen = true;
        this.task = task;
        this.expander = el;
        this.header = el.querySelector('.expander-header');
        this.iconholder = el.querySelector('.expander-header>.expander-icon');
        this.icon = icon;
        this.content = el.querySelector('.expander-content');
        this.content_height = window.getComputedStyle(this.content).height;
        this.expander_boxshadow = '0px 0px 4px var(--theme-border-color)';
        this.close(0);
        this.header.addEventListener('click', e => {
            this.isopen ? this.close(0) : this.open();
        });
    }
    open(dobeforeopen = true) {
        if (dobeforeopen && this.task.beforeopen) this.task.beforeopen(this);
        if (!this.isopen) {
            this.isopen = true;
            this.content.style.display = 'block';
            this.iconholder.innerHTML = this.icon.open;
            this.expander.style['box-shadow'] = this.expander_boxshadow;
        }
    }
    close() {
        if (this.isopen) {
            this.isopen = false;
            this.content.style.display = 'none';
            this.iconholder.innerHTML = this.icon.close;
            this.expander.style['box-shadow'] = 'none';
        }
    }
}

class ExpanderGroup {
    constructor(expanders, icon) {
        this.expanders = [];
        this.add(expanders, icon);
    }
    add(expanders, icon) {
        DOMUtility.select(expanders)
        .forEach(x => this.expanders.push(new Expander(x, icon, {
            beforeopen: (target => {
                this.expanders.forEach(expander => {
                    if (expander !== target) expander.close();
                });
            }).bind(this),
        })));
    }
    open(e) {
        var els = DOMUtility.select(e);
        var target = this.expanders.filter(x => els.includes(x.expander));
        this.expanders.forEach(x => x.close());
        target.forEach(x => x.open(false));
    }
}

(function () {
    if (!window.DOMUtility) {
        function DOMUtility() {}
        DOMUtility.select = function (e) {
            return ((typeof e === 'string' || e instanceof String) ? Array.from(document.querySelectorAll(e)) :
                (e instanceof NodeList) ? Array.from(e) :
                (e instanceof Element) ? [e] :
                (e instanceof Array && !e.filter(x => !(x instanceof Element)).length) ? e : []);
        }
        window.DOMUtility = DOMUtility;
    }
})();