class ContextMenu {
    constructor(contextmenu, area, option) {
        const default_option = {
            depth: 0,
            parent: null,
            arrow: '>',
            check_true: 'T',
            check_false: 'F',
            radio_true: 'T',
            radio_false: 'F',
        }
        for (const key in option)
            if (option.hasOwnProperty(key)) default_option[key] = option[key];
        this.depth = default_option.depth;
        this.arrow = default_option.arrow;
        this.parent = default_option.parent;
        this.option = default_option;
        if (typeof contextmenu === 'string' || contextmenu instanceof String) {
            this.contextmenu = document.querySelector(contextmenu);
        } else if (contextmenu instanceof Element) {
            this.contextmenu = contextmenu;
        } else {
            throw new Error();
        }
        this.contextmenu.style['z-index'] = this.depth * 10 + 10;
        this.createUi();
        this.size = ContextMenu.rect(this.contextmenu);
        this.data = '';
        this.isopen = false;
        this.childmenu = [];
        if (typeof area === 'string' || area instanceof String) {
            this.area_selector = area;
            this.setArea();
            this.contextmenu.addEventListener('mouseover', e => {
                this.childmenu.forEach(x => x.close());
            });
        } else if (area instanceof Element) {
            this.addArea(area, {
                click: false,
                contextmenu: false,
                mouseover: true,
            }, this.showChildMenu.bind(this));
        } else {
            throw new Error();
        }
        document.addEventListener('click', (e) => this.close(e));
        ContextMenu.selectChildren(this.contextmenu, 'contextmenu-item').forEach(el => {
            el.addEventListener('click', e => {
                if (!(el.classList.contains('contextmenu-item-check') ||
                        el.classList.contains('contextmenu-item-radio') ||
                        ContextMenu.selectFirstChild(el, 'contextmenu'))) {
                    this.contextmenu.style.display = 'none';
                    this.closeParent();
                }
                console.log(el)
                var $$ = this.data;
                eval(el.getAttribute('onmenu'));
                e.stopPropagation();
            });
        });
        ContextMenu.selectChildren(this.contextmenu).forEach(el => {
            el.oncontextmenu = function () {
                return false;
            };
        });
        this.contextmenu.oncontextmenu = function () {
            return false;
        }
        this.registerChildMenu();
        this.contextmenu.style.display = 'none';
    }
    closeParent() {
        if (this.parent) {
            this.parent.close();
            this.parent.closeParent();
        }
    }
    createUi() {
        ContextMenu.selectChildren(this.contextmenu, 'contextmenu-item').forEach(el => {
            var grid = document.createElement('div');
            grid.classList.add('contextmenu-item-grid');

            var first_element = ContextMenu.selectFirstChild(el, null, 'contextmenu');
            var contextmenu_icon = ContextMenu.selectFirstChild(el, 'contextmenu-icon');
            var contextmenu_text = ContextMenu.selectFirstChild(el, 'contextmenu-text');
            var firsttextchild = ContextMenu.getFirstTextChild(el);

            //icon
            var span0 = document.createElement('span');
            span0.classList.add('contextmenu-item-icon');
            if (el.classList.contains('contextmenu-item-check')) {
                this.createCheckBox(el, span0);
            } else if (el.classList.contains('contextmenu-item-radio')) {
                this.createRadio(el, span0);
            } else if (!contextmenu_icon && !contextmenu_text && first_element) {
                span0.innerHTML = first_element.outerHTML;
                first_element.remove();
            } else if (contextmenu_icon) {
                span0.innerHTML = contextmenu_icon.outerHTML;
                contextmenu_icon.remove();
            };
            //text
            var span1 = document.createElement('span');
            if (contextmenu_text) {
                span1.innerHTML = contextmenu_text.outerHTML;
                contextmenu_text.remove();
            } else if (firsttextchild) {
                span1.innerHTML = firsttextchild.textContent;
                firsttextchild.remove();
            }
            span1.classList.add('contextmenu-item-text');
            //arrow
            var span2 = document.createElement('span');
            span2.classList.add('contextmenu-item-arrow');

            [span0, span1, span2].forEach(e => grid.appendChild(e));
            el.appendChild(grid);
        });
    }
    createCheckBox(el, span0) {
        span0.innerHTML = el.getAttribute('value') ? this.option.check_true : this.option.check_false;
        el.addEventListener('click', e => {
            var value = el.getAttribute('value') == 'true';
            el.setAttribute('value', !value);
            span0.innerHTML = !value ? this.option.check_true : this.option.check_false;
        });
    }
    createRadio(el, span0) {
        span0.innerHTML = el.getAttribute('value') ? this.option.radio_true : this.option.radio_false;
        el.addEventListener('click', e => {
            var name = el.getAttribute('name');
            ContextMenu.selectChildren(this.contextmenu, 'contextmenu-item-radio').filter(x => {
                return x.getAttribute('name') === name;
            }).forEach(x => {
                var icon = ContextMenu.selectFirstChild(ContextMenu.selectFirstChild(x, 'contextmenu-item-grid'), 'contextmenu-item-icon');
                icon.innerHTML = x == el ? this.option.radio_true : this.option.radio_false;
            });
        });
    }
    static getTextChilds(el) {
        return Array.from(el.childNodes).filter(e => e.nodeType === 3 && e.textContent);
    }
    static getFirstTextChild(el) {
        var textchilds = ContextMenu.getTextChilds(el);
        return textchilds.length ? textchilds[0] : null;
    }
    static selectFirstChild(el, cls, not) {
        var children = ContextMenu.selectChildren(el, cls, not);
        return children.length ? children[0] : null;
    }

    registerChildMenu() {
        ContextMenu.selectChildren(this.contextmenu, 'contextmenu-item').forEach(el => {
            var childmenu = ContextMenu.selectChildren(el, 'contextmenu');
            if (childmenu.length) {
                var option = this.option;
                option.depth = this.depth + 1;
                option.parent = this;

                var child_contextmenu = new ContextMenu(childmenu[0], el, option);
                this.childmenu.push(child_contextmenu);
                var arrow = ContextMenu.selectChildren(el, 'contextmenu-item-grid')[0].querySelector('.contextmenu-item-arrow');
                arrow.innerHTML = this.arrow;
                el.addEventListener('click', e => {
                    child_contextmenu.showChildMenu(el);
                });
            }
        });
    }
    showChildMenu(area_el, e) {
        var r = area_el.getBoundingClientRect();
        var top;
        if (window.innerHeight - r.y >= this.size.height) {
            //下における
            top = r.y;
        } else if (r.y >= this.size.height) {
            //上における
            top = r.y - this.size.height + r.height;
        } else {
            top = 0;
        }
        var offset = {
            left: (r.x >= this.size.width) ? r.x - this.size.width : r.x + r.width,
            top
        };
        this.showContextMenu(area_el, e, offset);
    }
    static selectChildren(el, cls, not) {
        return Array.from(el.children).filter(child => {
            var classList = Array.from(child.classList);
            return (!cls || classList.includes(cls)) && (!not || !classList.includes(not));
        });
    }
    setArea(area_selector = this.area_selector, events = {
        click: false,
        contextmenu: true,
        mouseover: false,
    }) {
        this.areas = document.querySelectorAll(area_selector);
        this.areas.forEach(el => this.addArea(el, events));
    }
    addArea(el, events, showfn = this.showContextMenu.bind(this)) {
        if (events.contextmenu) {
            el.oncontextmenu = function () {
                return false;
            }
            el.addEventListener('contextmenu', (e) => {
                showfn(el, e);
            });
        }
        if (events.click) {
            el.addEventListener('click', e => {
                this.childmenu.forEach(x => x.close());
                showfn(el, e);
                e.stopPropagation();
            });
        }
        if (events.mouseover) {
            el.addEventListener('mouseover', e => {
                this.childmenu.forEach(x => x.close());
                showfn(el, e);
                e.stopPropagation();
            });
        }
    }
    showContextMenu(el, e, offset = {
        left: (e.clientX + this.size.width - window.innerWidth) > 0 ? e.clientX - this.size.width : e.clientX,
        top: (e.clientY + this.size.height - window.innerHeight) > 0 ? //下におけない
            (e.clientY >= this.size.height) ?
            e.clientY - this.size.height :
            0 : e.clientY,
    }) {
        this.isopen = true;
        this.setData(el.getAttribute('data-contextmenu'));
        this.contextmenu.style.display = 'block';
        this.contextmenu.style.top = offset.top + 'px';
        this.contextmenu.style.left = offset.left + 'px';
    }
    setData(data) {
        this.data = data;
        this.contextmenu.setAttribute('data-contextmenu', data);
    }
    close(e) {
        this.isopen = false;
        var _offset = ContextMenu.offset(this.contextmenu);
        if (!e || !((_offset.left <= e.pageX && (_offset.left + this.size.width) >= e.pageX) &&
                (_offset.top <= e.pageY && (_offset.top + this.size.height) >= e.pageY))) {
            this.contextmenu.style.display = 'none';
        }
        this.childmenu.forEach(c => c.close());
    }
    static offset(el, data) {
        if (data) {
            el.style.top = data.top + 'px';
            el.style.left = data.left + 'px';
        } else {
            var rect = el.getBoundingClientRect();
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var top = rect.top + scrollTop;
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
            var left = rect.left + scrollLeft;
            return {
                top,
                left
            }
        }
    }
    static rect(el) {
        el.style.display = 'block';
        return el.getBoundingClientRect();
    }
}