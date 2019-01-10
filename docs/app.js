class Page {
    constructor(app, page) {
        this.app = app;
        this.parent = page;
        this.init();
    }
    init() { }
    hide() { this.parent.classList.remove('show'); }
    show() { this.parent.classList.add('show'); }
    hideMenu() { this.parent.classList.remove('on'); }
    showMenu() { this.parent.classList.add('on'); }
}
class Egg extends Page {
    init() {
        this.itemmenu = this.parent.querySelector('right-menu');
        this.itemmenu.addEventListener('close', (event) => {
            const item = this.selectedItem();
        });
        this.parent.querySelector('bottom-button').addEventListener('click', (event) => {
            event.stopPropagation();
            const item = this.selectedItem();
            this.hatch();
        });
    }
    hatch() {
        const popup = this.app.popup();
        popup.clear();
    }
    selectedItem() {
        const items = this.itemmenu.children;
        for (let i = items.length - 1; 0 <= i; --i) {
            if (items[i].getAttribute('selected')) {
                return items[i];
            }
        }
        return null;
    }
    selectItem(item) {
        const items = this.itemmenu.children;
        for (let i = items.length - 1; 0 <= i; --i) {
            if (items[i] === item && !items[i].getAttribute('selected')) {
                items[i].setAttribute('selected', 'selected');
            }
            else {
                items[i].removeAttribute('selected');
            }
        }
    }
    setUser(user) {
        user.getItems().filter((item) => { return item.type === ItemType.Item; }).forEach((item) => {
            const mitem = new MenuItem();
            mitem.addEventListener('click', (event) => { this.selectItem(mitem); });
            this.itemmenu.appendChild(mitem);
        });
    }
}
class Menu extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { --size: calc( 100vmin / 3 ); display: block; position: absolute; margin: auto; width: fit-content; height: fit-content; font-size: var( --fsize, 10vmin ); }',
            'button { cursor: pointer; display: block; padding: 0; margin:0; border:0; outline:none; }',
            ':host > div { margin: 0; transition: left 0.5s, right 0.5s, top 0.5s, bottom 0.5s, width 0.5s, height 0.5s; position: relative; box-sizing: border-box; }',
            ':host > div > button { width: var( --size ); height: var( --size ); border-radius: 50%; position: absolute; z-index: 10; font-family: Icon; }',
            ':host > div > button:before, :host > div > button:after { display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; text-align: center; box-sizing: border-box; font-size: var( --fsize, 7vmin ); }',
            ':host > div > button:before { content: var( --icon, "" ); }',
            ':host > div > button:after { content: "×"; }',
            ':host > div > div { width: 100%; height: 100%; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; overflow: hidden; }',
            ':host > div > div > div { display: flex; }',
        ]).join('');
        this.parent = document.createElement('div');
        const button = document.createElement('button');
        button.addEventListener('click', () => {
            const cls = this.parentElement.classList;
            if (cls.contains('on')) {
                cls.remove('on');
                this.parent.classList.add('show');
                return;
            }
            if (!this.parent.classList.contains('show')) {
                return;
            }
            cls.add('on');
            this.parent.classList.remove('show');
        });
        this.parent.appendChild(button);
        const wrapper = document.createElement('div');
        const contents = document.createElement('div');
        const slot = document.createElement('slot');
        contents.appendChild(slot);
        wrapper.appendChild(contents);
        this.parent.appendChild(wrapper);
        shadow.appendChild(style);
        shadow.appendChild(this.parent);
        if (this.tagName === 'LEFT-MENU' || this.tagName === 'RIGHT-MENU') {
            wrapper.addEventListener('mousewheel', (event) => {
                if (event.deltaX !== 0) {
                    return;
                }
                event.stopPropagation();
                event.preventDefault();
                wrapper.scrollBy(event.deltaY, 0);
            });
        }
    }
    initStyle(style) { return style; }
    onOpen() { this.dispatchEvent(new Event('open')); }
    onClose() { this.dispatchEvent(new Event('close')); }
    clear() {
        const c = this.children;
        for (let i = c.length - 1; 0 <= i; --i) {
            this.removeChild(c[i]);
        }
    }
}
class TopMenu extends Menu {
    initStyle(style) {
        style.push(':host-context( .on ) > div { top: 0; }', ':host { left: 0; right: 0; top: 0; width: var( --size ); }', ':host > div { top: calc( var( --size ) / -2 ); height: 0; width: 100%; }', ':host > div > button { left: 0; bottom: calc( var( --size ) / -2 ); }', ':host > div.show { height: 100vmin; top: 0; }', ':host > div > button:before { padding-top: 50%; line-height: calc( var( --size ) / 2 ); }', ':host > div > button:after { padding-bottom: 50%; line-height: calc( var( --size ) / 2 ); }', ':host > div > div { overflow-y: auto; }', ':host > div > div > div { padding: calc( var( --size ) / 4 ) 0 calc( var( --size ) / 2 ); width: 100%; height: fit-content; }');
        return style;
    }
}
class BottomMenu extends Menu {
    initStyle(style) {
        style.push(':host-context( .on ) > div { bottom: 0; }', ':host { left: 0; right: 0; bottom: 0; width: var( --size ); }', ':host > div { bottom: calc( var( --size ) / -2 ); height: 0; width: 100%; }', ':host > div > button { left: 0; top: calc( var( --size ) / -2 ); }', ':host > div.show { height: 100vmin; bottom: 0; }', ':host > div > button:before { padding-bottom: 50%; line-height: calc( var( --size ) / 2 ); }', ':host > div > button:after { padding-top: 50%; line-height: calc( var( --size ) / 2 ); }', ':host > div > div { overflow-y: auto; }', ':host > div > div > div { padding: calc( var( --size ) / 2 ) 0 calc( var( --size ) / 4 ); width: 100%; height: fit-content; }');
        return style;
    }
}
class LeftMenu extends Menu {
    initStyle(style) {
        style.push(':host-context( .on ) > div { left: 0; }', ':host { top: 0; bottom: 0; left: 0; height: var( --size ); }', ':host > div { left: calc( var( --size ) / -2 ); width: 0; height: 100%; }', ':host > div > button { top: 0; right: calc( var( --size ) / -2 ); }', ':host > div.show { width: 100vmin; left: 0; }', ':host > div > button:before { padding-left: 50%; line-height: var( --size ); }', ':host > div > button:after { padding-right: 50%; line-height: var( --size ); }', ':host > div > div { overflow-x: auto; }', ':host > div > div > div { padding: 0 calc( var( --size ) / 2 ) 0 calc( var( --size ) / 4 ); width: fit-content; height: 100%; }');
        return style;
    }
}
class RightMenu extends Menu {
    initStyle(style) {
        style.push(':host-context( .on ) > div { right: 0; }', ':host { top: 0; bottom: 0; right: 0; height: var( --size ); }', ':host > div { right: calc( var( --size ) / -2 ); width: 0; height: 100%; }', ':host > div > button { top: 0; left: calc( var( --size ) / -2 ); }', ':host > div.show { width: 100vmin; right: 0; }', ':host > div > button:before { padding-right: 50%; line-height: var( --size ); }', ':host > div > button:after { padding-left: 50%; line-height: var( --size ); }', ':host > div > div { overflow-x: auto; }', ':host > div > div > div { padding: 0 calc( var( --size ) / 4 ) 0 calc( var( --size ) / 2 ); width: fit-content; height: 100%; }');
        return style;
    }
}
class MenuItem extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { display: block; height: fit-content; }',
            ':host > div { width: 100%; padding-top: 100%; position: relative; overflow: hidden; }',
            ':host > div > button { position: absolute; width: 95%; height: 95%; margin: auto; top: 0; bottom: 0; left: 0; right: 0; display: block; box-sizing: border-box; border-radius: 8%; overflow: hidden; cursor: pointer; border: 0.5vmin solid var( --border, #f7f7f7 ); background-color: var( --color, #afb1de ); }',
            ':host > div > span { background-color: #e7e8f3; position: absolute; top: 0; right: 0; display: block; text-align: center; border-radius: 50%; font-size: 4vmin; width: 8vmin; height: 8vmin; line-height: 8vmin; }',
            ':host > div > span:empty { display: none; }',
            ':host( [ selected ] ) > div > button { background-color: var( --selected, #e6e494 ); }',
            ':host( [ disabled ] ) > div > button:after { content: ""; width: 100%; height: 100%; display: block; position: absolute; top: 0; left: 0; background-color: var( --disabled, rgba( 0, 0, 0, 0.5 ) );}',
        ]).join('');
        const wrapper = this.initContents(document.createElement('div'));
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        if (this.getAttribute('quantity')) {
            this.quantity = parseInt(this.getAttribute('quantity'));
        }
    }
    initContents(wrapper) {
        this.button = document.createElement('button');
        const slot = document.createElement('slot');
        this.button.appendChild(slot);
        wrapper.appendChild(this.button);
        this.count = document.createElement('span');
        wrapper.appendChild(this.count);
        this.button.addEventListener('click', (event) => { this.onClick(event); });
        return wrapper;
    }
    initStyle(style) { return style; }
    onClick(event) {
        event.stopPropagation();
        const newEvent = document.createEvent('MouseEvent');
        newEvent.initMouseEvent('click', event.bubbles, event.cancelable, event.view, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, null);
        this.dispatchEvent(newEvent);
    }
    get quantity() { return parseInt(this.count.textContent || '') || 0; }
    set quantity(value) {
        const count = Math.floor((typeof value === 'number' ? value : parseInt(value)) || 0);
        if (count <= 0) {
            this.count.textContent = '';
            return;
        }
        this.count.textContent = count < 100 ? count + '' : '+99';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('top-menu', TopMenu);
    customElements.define('bottom-menu', BottomMenu);
    customElements.define('left-menu', LeftMenu);
    customElements.define('right-menu', RightMenu);
    customElements.define('menu-item', MenuItem);
});
class Button extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { --size: calc(100vmin / 3); display: block; position: absolute; margin: auto; width: fit-content; height: fit-content; transition: top 0.5s, bottom 0.5s, left 0.5s, right 0.5s; }',
            ':host > button { display: block; width: var( --size ); height: var( --size ); border-radius:50%; overflow: hidden; cursor: pointer; boxsizing: border-box; border: 0; outline: none; padding: 0; margin: 0; font-family: Icon; }',
            ':host > button:before { content: var( --icon, "" ); display: block; width: 100%; height: 100%; box-sizing: border-box; text-align: center; font-size: var( --fsize, 7vmin ); }',
            ':host([mode="ok"]) > button:before { content: "○"; background-color: var( --back-color, #34ef6e ); }',
            ':host([mode="cancel"]) > button:before { content: "×"; background-color: var( --back-color, #ff5252 ); }',
        ]).join('');
        const button = document.createElement('button');
        button.addEventListener('click', (event) => {
            const newEvent = document.createEvent('MouseEvent');
            newEvent.initMouseEvent('click', event.bubbles, event.cancelable, event.view, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, null);
            this.dispatchEvent(newEvent);
        });
        shadow.appendChild(style);
        shadow.appendChild(button);
    }
    initStyle(style) { return style; }
}
class TopButton extends Button {
    initStyle(style) {
        style.push(':host-context( .on ), :host( .on ) { top: calc( var( --size ) / -2 ); }', ':host { left: 0; right: 0; top: calc( var( --size ) * -1 ); }', ':host > button:before { line-height: calc( var( --size ) / 2 ); padding-top: 50%; }');
        return style;
    }
}
class BottomButton extends Button {
    initStyle(style) {
        style.push(':host-context( .on ), :host( .on ) { bottom: calc( var( --size ) / -2 ); }', ':host { left: 0; right: 0; bottom: calc( var( --size ) * -1 ); }', ':host > button:before { line-height: calc( var( --size ) / 2 ); padding-bottom: 50%; }');
        return style;
    }
}
class LeftButton extends Button {
    initStyle(style) {
        style.push(':host-context( .on ), :host( .on ) { left: calc( var( --size ) / -2 ); }', ':host { top: 0; bottom: 0; left: calc( var( --size ) * -1 ); }', ':host > button:before { line-height: var( --size ); padding-left: 50%; }');
        return style;
    }
}
class RightButton extends Button {
    initStyle(style) {
        style.push(':host-context( .on ), :host( .on ) { right: calc( var( --size ) / -2 ); }', ':host { top: 0; bottom: 0; right: calc( var( --size ) * -1 ); }', ':host > button:before { line-height: var( --size ); padding-right: 50%; }');
        return style;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('top-button', TopButton);
    customElements.define('bottom-button', BottomButton);
    customElements.define('left-button', LeftButton);
    customElements.define('right-button', RightButton);
});
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Item"] = 0] = "Item";
    ItemType[ItemType["Food"] = 1] = "Food";
})(ItemType || (ItemType = {}));
class Popup extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { display: block; visibility: hidden; position: absolute; margin: auto; top:0; bottom: 0; left: 0; right: 0; width: 100vmin; height: 100vmin; overflow: hidden; font-size: var( --fsize, 10vmin ); z-index: var( --z-index, 2147483647 ) }',
            ':host( [ show ] ) { visibility: visible; }',
            ':host > div { transition: width 0.5s, height 0.5s; margin: auto; width: 0; height: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0; border-radius: 50%; overflow: hidden; background-color: rgba( 0, 0, 0, 0.6 ); }',
            ':host( [ show ] ) > div { width: 100%; height: 100%; }',
            ':host > div > div { width: 60%; height: 0; margin: auto; box-sizing: border-box; padding: 0; overflow: auto; transition: height 0.5s ease 1s, padding 0.5s ease 1s; background-color: #57575f; }',
            ':host( [ show ] ) > div > div { height: 100%; padding: 5vmin 0; }',
        ]).join('');
        const wrapper = document.createElement('div');
        wrapper.addEventListener('click', (event) => { event.stopPropagation(); });
        const contents = document.createElement('div');
        wrapper.appendChild(contents);
        const slot = document.createElement('slot');
        contents.appendChild(slot);
        this.lbutton = new LeftButton();
        this.lbutton.setAttribute('mode', 'cancel');
        this.lbutton.addEventListener('click', () => { if (!this.onCancel || !this.onCancel()) {
            this.hide();
        } });
        wrapper.appendChild(this.lbutton);
        this.rbutton = new RightButton();
        this.rbutton.setAttribute('mode', 'ok');
        this.lbutton.addEventListener('click', () => { if (!this.onOK || !this.onOK()) {
            this.hide();
        } });
        wrapper.appendChild(this.rbutton);
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
    }
    initStyle(style) { return style; }
    clear() {
        const c = this.children;
        for (let i = c.length - 1; 0 <= i; --i) {
            this.removeChild(c[i]);
        }
    }
    enableCancel(callback) {
        this.onCancel = callback;
        if (this.hasAttribute('show')) {
            this.lbutton.classList.add('on');
        }
    }
    enableOK(callback) {
        this.onOK = callback;
        if (this.hasAttribute('show')) {
            this.rbutton.classList[callback ? 'add' : 'remove']('on');
        }
    }
    show() {
        if (!this.hasAttribute('show')) {
            this.setAttribute('show', 'show');
            return;
        }
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            this.enableCancel(this.onCancel);
            this.enableOK(this.onOK);
            this.timer = 0;
        }, 1000);
    }
    hide() {
        if (this.hasAttribute('show')) {
            this.removeAttribute('show');
            return;
        }
        clearTimeout(this.timer);
        this.timer = 0;
        this.lbutton.classList.remove('on');
        this.rbutton.classList.remove('on');
        this.clear();
        this.onCancel = this.onOK = undefined;
    }
    updateShow(show) {
        if (show) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    static get observedAttributes() { return ['show']; }
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case 'show':
                this.updateShow(this.hasAttribute('show'));
                break;
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('popup-window', Popup);
});
class User {
    constructor() {
    }
    getRuf() { return null; }
    getItems() {
        const items = [{ type: ItemType.Food }, { type: ItemType.Item }, { type: ItemType.Food }, { type: ItemType.Item }, { type: ItemType.Item }];
        return items;
    }
}
class Ruf {
    constructor() {
    }
}
class Language {
    constructor(select) {
        this.langs = [];
        const list = [];
        if (navigator.languages) {
            navigator.languages.forEach((lang) => { list.push(lang); });
        }
        if (list.indexOf(Language.DEFAULT) < 0) {
            list.push(Language.DEFAULT);
        }
        console.log('Language list:', list);
        const load = (index) => {
            if (list.length <= index) {
                this.setEnableLanguage(select);
                return;
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.onload = () => {
                this.langs.push(list[index]);
                load(index + 1);
            };
            link.onerror = () => { load(index + 1); };
            link.href = Language.PATH + list[index] + '.css?' + Language.SUFFIX;
            document.head.appendChild(link);
        };
        setTimeout(() => { load(0); }, 0);
    }
    get() { return this.langs; }
    setEnableLanguage(select) {
        if (select) {
            this.langs.forEach((lang) => {
                const option = document.createElement('option');
                option.value = lang;
                option.textContent = lang;
                select.appendChild(option);
            });
            select.onchange = (event) => {
                const selected = select.selectedOptions[0];
                this.setLanguage(selected.value || 'en');
            };
        }
        this.setLanguage(this.langs[0] || 'en');
    }
    setLanguage(language) { document.body.lang = language; }
}
Language.DEFAULT = 'en';
Language.PATH = './lang/';
Language.SUFFIX = '';
class App {
    constructor(config) {
        this.config = config;
        this.lang = new Language();
        this.user = new User();
        this.egg = new Egg(this, config.egg);
        if (this.user.getRuf()) {
            this.egg.hide();
        }
        else {
            this.egg.setUser(this.user);
            this.egg.show();
            setTimeout(() => { this.egg.showMenu(); }, 1000);
        }
    }
    popup() { return this.config.popup; }
}
document.addEventListener('DOMContentLoaded', () => {
    const app = new App({
        popup: document.getElementById('popup'),
        main: document.getElementById('main'),
        egg: document.getElementById('egg'),
    });
});
