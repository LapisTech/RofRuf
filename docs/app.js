function Fetch(input, init) {
    return fetch(input, init).then((result) => {
        if (result.ok) {
            return result;
        }
        throw result;
    });
}
function GetJson(input) {
    return fetch(input).then((result) => {
        if (result.ok) {
            return result.json();
        }
        throw result.json();
    });
}
function PostJson(input, data) {
    const header = { Accept: 'application/json', 'Content-Type': 'application/json' };
    const body = JSON.stringify(data);
    return fetch(input, { method: 'POST', headers: header, body: body }).then((result) => {
        if (result.ok) {
            return result.json();
        }
        throw result.json();
    });
}
class Page extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { width: 100vmin; height: 100vmin; border-radius: 50%; margin: auto; top: 0; bottom: 0; left: 0; right: 0; position: absolute; overflow: hidden; }',
            ':host( :not( [ show ] ) ) { visibility: hidden; }',
        ]).join('');
        const slot = document.createElement('slot');
        shadow.appendChild(style);
        shadow.appendChild(slot);
        this.init();
    }
    init() { }
    initStyle(style) { return style; }
    static get observedAttributes() { return ['show']; }
    attributeChangedCallback(attrName, oldVal, newVal) {
        switch (attrName) {
            case 'show':
                this.onChangeShow();
                break;
        }
    }
    onChangeShow() {
        if (this.hasAttribute('show')) {
            this.onShow();
        }
        else {
            this.onHide();
        }
    }
    onShow() { }
    onHide() { }
    setApp(app) { this.app = app; }
    show() { this.setAttribute('show', 'show'); }
    hide() { this.removeAttribute('show'); }
    showMenu() { this.classList.add('on'); }
    hideMenu() { this.classList.remove('on'); }
}
class Top extends Page {
    init() {
        TitleScreen.init();
        const title = this.querySelector('title-screen');
        if (!title) {
            return;
        }
        title.addEventListener('play', () => { this.app.showMypage(); });
    }
}
class TitleScreen extends HTMLElement {
    static init() {
        customElements.define('title-screen', this);
    }
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = [
            ':host { display: block; width: 100%; height: 100%; }',
            ':host > div { position: relative; width: 100%; height: 100%; }',
            ':host > div > div { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: black; color: white; overflow: hidden; opacity: 1; transition: opacity 1s; }',
            ':host > div > div > small { display: block; position: absolute; top: 0; bottom: 0; width: 100%; height: 1em; line-height: 1em; margin: auto; text-align: center; }',
        ].join('');
        const wrapper = document.createElement('div');
        const black1 = document.createElement('div');
        black1.addEventListener('transitionend', () => {
            wrapper.removeChild(black1);
            wrapper.removeChild(logo);
            wrapper.removeChild(black2);
        });
        wrapper.appendChild(black1);
        const logo = this.addLogo();
        logo.addEventListener('transitionend', () => { black1.style.opacity = '0'; });
        wrapper.appendChild(logo);
        const black2 = document.createElement('div');
        black2.addEventListener('transitionend', () => { logo.style.opacity = '0'; });
        wrapper.appendChild(black2);
        wrapper.addEventListener('click', (event) => {
            if (event.target !== wrapper) {
                return;
            }
            const newEvent = new Event('play');
            this.dispatchEvent(newEvent);
        });
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        setTimeout(() => { black1.style.opacity = '0'; }, 1000);
    }
    addLogo() {
        const contents = document.createElement('div');
        const small = document.createElement('small');
        small.textContent = 'aaa';
        contents.appendChild(small);
        return contents;
    }
}
class Main extends Page {
    init() {
    }
    onShow() {
        this.showMenu();
    }
    onHide() {
        this.hideMenu();
    }
}
class Egg extends Page {
    init() {
        this.itemmenu = this.querySelector('right-menu');
        this.itemmenu.addEventListener('close', (event) => {
            const item = this.selectedItem();
        });
        this.querySelector('bottom-button').addEventListener('click', (event) => {
            event.stopPropagation();
            const item = this.selectedItem();
            this.hatch();
        });
    }
    onShow() {
        this.showMenu();
    }
    onHide() {
        this.hideMenu();
    }
    hatch() {
        const contents = document.createElement('div');
        contents.classList.add('hatch');
        const modal = this.app.popup();
        modal.enableOK(() => { this.onHatch(); return false; });
        modal.clear();
        modal.appendChild(contents);
        modal.show();
    }
    onHatch() {
        this.app.goTo('main');
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
        return user.getItems().then((items) => {
            items.filter((item) => { return item.type === ItemType.Item; }).forEach((item) => {
                const mitem = new MenuItem();
                mitem.addEventListener('click', (event) => { this.selectItem(mitem); });
                this.itemmenu.appendChild(mitem);
            });
        });
    }
}
class Scroll extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { display: block; overflow: auto; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }',
            ':host::-webkit-scrollbar { width: var( --scr-size, 1vmin ); height: var( --scr-size, 1vmin ); }',
            ':host::-webkit-scrollbar-track { background: transparent;}',
            ':host::-webkit-scrollbar-thumb { background: var( --scr-color, #afb1de ); }',
        ]).join('');
        const slot = document.createElement('slot');
        shadow.appendChild(style);
        shadow.appendChild(slot);
    }
    initStyle(style) { return style; }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('scroll-area', Scroll);
});
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
            ':host > div > scroll-area { width: 100%; height: 100%; overflow: hidden; }',
            ':host > div > scroll-area > div { display: flex; }',
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
        const wrapper = new Scroll();
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
        style.push(':host-context( .on ) > div { top: 0; }', ':host { left: 0; right: 0; top: 0; width: var( --size ); }', ':host > div { top: calc( var( --size ) / -2 ); height: 0; width: 100%; }', ':host > div > button { left: 0; bottom: calc( var( --size ) / -2 ); }', ':host > div.show { height: 100vmin; top: 0; }', ':host > div > button:before { padding-top: 50%; line-height: calc( var( --size ) / 2 ); }', ':host > div > button:after { padding-bottom: 50%; line-height: calc( var( --size ) / 2 ); }', ':host > div > scroll-area { overflow-y: auto; }', ':host > div > scroll-area > div { padding: calc( var( --size ) / 4 ) 0 calc( var( --size ) / 2 ); width: 100%; height: fit-content; flex-direction: column; flex-wrap: wrap; align-items: center; }');
        return style;
    }
}
class BottomMenu extends Menu {
    initStyle(style) {
        style.push(':host-context( .on ) > div { bottom: 0; }', ':host { left: 0; right: 0; bottom: 0; width: var( --size ); }', ':host > div { bottom: calc( var( --size ) / -2 ); height: 0; width: 100%; }', ':host > div > button { left: 0; top: calc( var( --size ) / -2 ); }', ':host > div.show { height: 100vmin; bottom: 0; }', ':host > div > button:before { padding-bottom: 50%; line-height: calc( var( --size ) / 2 ); }', ':host > div > button:after { padding-top: 50%; line-height: calc( var( --size ) / 2 ); }', ':host > div > scroll-area { overflow-y: auto; }', ':host > div > scroll-area > div { padding: calc( var( --size ) / 2 ) 0 calc( var( --size ) / 4 ); width: 100%; height: fit-content; flex-direction: column; flex-wrap: wrap; align-items: center; }');
        return style;
    }
}
class LeftMenu extends Menu {
    initStyle(style) {
        style.push(':host-context( .on ) > div { left: 0; }', ':host { top: 0; bottom: 0; left: 0; height: var( --size ); }', ':host > div { left: calc( var( --size ) / -2 ); width: 0; height: 100%; }', ':host > div > button { top: 0; right: calc( var( --size ) / -2 ); }', ':host > div.show { width: 100vmin; left: 0; }', ':host > div > button:before { padding-left: 50%; line-height: var( --size ); }', ':host > div > button:after { padding-right: 50%; line-height: var( --size ); }', ':host > div > scroll-area { overflow-x: auto; }', ':host > div > scroll-area > div { padding: 0 calc( var( --size ) / 2 ) 0 calc( var( --size ) / 4 ); width: fit-content; height: 100%; flex-wrap: nowrap; align-items: center; }');
        return style;
    }
}
class RightMenu extends Menu {
    initStyle(style) {
        style.push(':host-context( .on ) > div { right: 0; }', ':host { top: 0; bottom: 0; right: 0; height: var( --size ); }', ':host > div { right: calc( var( --size ) / -2 ); width: 0; height: 100%; }', ':host > div > button { top: 0; left: calc( var( --size ) / -2 ); }', ':host > div.show { width: 100vmin; right: 0; }', ':host > div > button:before { padding-right: 50%; line-height: var( --size ); }', ':host > div > button:after { padding-left: 50%; line-height: var( --size ); }', ':host > div > scroll-area { overflow-x: auto; }', ':host > div > scroll-area > div { padding: 0 calc( var( --size ) / 4 ) 0 calc( var( --size ) / 2 ); width: fit-content; height: 100%; flex-wrap: nowrap; align-items: center; }');
        return style;
    }
}
class MenuItem extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { display: block; width:30vmin; height: fit-content; }',
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
        this.count.textContent = count < 100 ? count + '' : '99+';
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
            ':host([mode="ok"]) > button:before { content: "○"; background-color: var( --back, #34ef6e ); }',
            ':host([mode="cancel"]) > button:before { content: "×"; background-color: var( --back, #ff5252 ); }',
        ]).join('');
        const button = document.createElement('button');
        button.addEventListener('click', (event) => {
            event.stopPropagation();
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
class DefaultButton extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { --bsize: var( --size, 50vmin); display: block; margin: 5vmin; width: fit-content; height: fit-content; }',
            ':host > button { display: block; width: var( --bsize ); height: var( --bsize ); overflow: hidden; cursor: pointer; boxsizing: border-box; border: 0.5vmin solid var( --border, #f7f7f7 ); background-color: var( --back, #afb1de ); border-radius: 8%; outline: none; padding: 0; margin: 0; }',
        ]).join('');
        const button = document.createElement('button');
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const newEvent = document.createEvent('MouseEvent');
            newEvent.initMouseEvent('click', event.bubbles, event.cancelable, event.view, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, null);
            this.dispatchEvent(newEvent);
        });
        const slot = document.createElement('slot');
        button.appendChild(slot);
        shadow.appendChild(style);
        shadow.appendChild(button);
    }
    initStyle(style) { return style; }
}
class IconButton extends DefaultButton {
    initStyle(style) {
        style.push(':host > button { font-family: Icon; }');
        return style;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('top-button', TopButton);
    customElements.define('bottom-button', BottomButton);
    customElements.define('left-button', LeftButton);
    customElements.define('right-button', RightButton);
    customElements.define('def-button', DefaultButton);
    customElements.define('icon-button', IconButton);
});
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Unknown"] = 0] = "Unknown";
    ItemType[ItemType["Item"] = 1] = "Item";
    ItemType[ItemType["Food"] = 2] = "Food";
})(ItemType || (ItemType = {}));
class Item {
    static init() {
        this.initItemData();
    }
    static initItemData() {
        this.items[0] = { id: 0, type: ItemType.Unknown, text: '' };
    }
    static convert(items) {
        return items.map((item) => { return Object.assign({}, item, this.find(item)); });
    }
    static find(item) {
        const id = typeof item === 'number' ? item : item.id;
        for (let i = 1; i < this.length; ++i) {
            if (this.items[i].id === id) {
                return Object.assign({}, this.items[i]);
            }
        }
        return Object.assign({}, this.items[0]);
    }
    static getAll() {
        return this.items.map((item) => { return Object.assign({}, item); });
    }
}
Item.items = [];
class Modal extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { display: block; visibility: hidden; position: absolute; margin: auto; top:0; bottom: 0; left: 0; right: 0; width: 100vmin; height: 100vmin; overflow: hidden; font-size: var( --fsize, 10vmin ); }',
            ':host( [ show ] ) { visibility: visible; }',
            ':host > div { transition: width 0.5s, height 0.5s; margin: auto; width: 0; height: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0; border-radius: 50%; overflow: hidden; background-color: rgba( 0, 0, 0, 0.6 ); }',
            ':host( [ show ]:not( [ hide] ) ) > div { width: 100%; height: 100%; }',
            ':host( [ hide ] ) > div { transition: width 0.5s ease 0.5s, height 0.5s ease 0.5s; }',
            ':host > div > scroll-area { margin: auto; box-sizing: border-box; padding: 0; position: absolute; transition: height 0.5s ease 0.5s, padding 0.5s ease 0.5s; background-color: #57575f; display: flex; }',
        ]).join('');
        const wrapper = document.createElement('div');
        wrapper.addEventListener('transitionend', (event) => {
            event.stopPropagation();
            if (!this.hasAttribute('hide') || event.propertyName !== 'width') {
                return;
            }
            this.removeAttribute('show');
            this.removeAttribute('hide');
        });
        wrapper.addEventListener('click', (event) => { event.stopPropagation(); });
        const contents = new Scroll();
        contents.addEventListener('transitionend', (event) => {
            event.stopPropagation();
            if (event.propertyName !== 'width' && event.propertyName !== 'height') {
                return;
            }
            if (this.hasAttribute('hide')) {
                return;
            }
            this.enableCancel(this.onCancel);
            this.enableOK(this.onOK);
        });
        wrapper.appendChild(contents);
        const slot = document.createElement('slot');
        contents.appendChild(slot);
        this.initContents(wrapper);
        this.cbutton.setAttribute('mode', 'cancel');
        this.cbutton.addEventListener('click', () => { if (!this.onCancel || !this.onCancel()) {
            this.hide();
        } });
        wrapper.appendChild(this.cbutton);
        this.obutton.setAttribute('mode', 'ok');
        this.obutton.addEventListener('click', () => { if (!this.onOK || !this.onOK()) {
            this.hide();
        } });
        wrapper.appendChild(this.obutton);
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        if (this.tagName === 'DIALOG-WINDOW') {
            contents.addEventListener('mousewheel', (event) => {
                if (event.deltaX !== 0) {
                    return;
                }
                event.stopPropagation();
                event.preventDefault();
                contents.scrollBy(event.deltaY, 0);
            });
        }
    }
    initStyle(style) { return style; }
    initContents(wrapper) { }
    clear() {
        const c = this.children;
        for (let i = c.length - 1; 0 <= i; --i) {
            this.removeChild(c[i]);
        }
    }
    show() {
        if (!this.hasAttribute('show')) {
            this.setAttribute('show', 'show');
            return;
        }
    }
    hide() {
        if (!this.hasAttribute('show')) {
            return;
        }
        if (this.hasAttribute('hide')) {
            return;
        }
        this.setAttribute('hide', 'hide');
        this.cbutton.classList.remove('on');
        this.obutton.classList.remove('on');
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
    enableCancel(callback) { this.onCancel = callback; }
    enableOK(callback) { this.onOK = callback; }
}
class Popup extends Modal {
    initStyle(style) {
        style.push(':host { z-index: var( --z-index, 2100000000 ) }', ':host > div > scroll-area { width: 60%; height: 0; transition: height 0.5s ease 0.5s, padding 0.5s ease 0.5s; top: 0; left: 0; right: 0; }', ':host( [ hide ] ) > div > scroll-area { transition: height 0.5s, padding 0.5s; text-align: center; }', ':host( [ show ]:not( [ hide ] ) ) > div > scroll-area { height: 100%; padding: 5vmin 0; }');
        return style;
    }
    initContents() {
        this.cbutton = new LeftButton();
        this.obutton = new RightButton();
    }
    enableCancel(callback) {
        this.onCancel = callback;
        if (this.hasAttribute('show')) {
            this.cbutton.classList.add('on');
        }
    }
    enableOK(callback) {
        this.onOK = callback;
        if (this.hasAttribute('show')) {
            this.obutton.classList[callback ? 'add' : 'remove']('on');
        }
    }
}
class Dialog extends Modal {
    initStyle(style) {
        style.push(':host { z-index: var( --z-index, 2100000050 ) }', ':host > div > scroll-area { width: 0; height: 60%; transition: width 0.5s ease 0.5s, padding 0.5s ease 0.5s; top: 0; bottom: 0; left: 0; overflow-x: auto; }', ':host( [ hide ] ) > div > scroll-area { transition: width 0.5s, padding 0.5s; }', ':host( [ show ]:not( [ hide ] ) ) > div > scroll-area { width: 100%; padding: 0 5vmin; }');
        return style;
    }
    initContents(wrapper) {
        this.cbutton = new TopButton();
        this.obutton = new BottomButton();
    }
    enableCancel(callback) {
        this.onCancel = callback;
        if (this.hasAttribute('show')) {
            this.cbutton.classList[callback ? 'add' : 'remove']('on');
        }
    }
    enableOK(callback) {
        this.onOK = callback;
        if (this.hasAttribute('show')) {
            this.obutton.classList.add('on');
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('popup-window', Popup);
    customElements.define('dialog-window', Dialog);
});
class Message extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = this.initStyle([
            ':host { display: block; position: absolute; margin: auto; top:0; bottom: 0; left: 0; right: 0; width: 100vmin; height: fit-content; overflow: hidden; font-size: var( --fsize, 5vmin ); z-index: var( --z-index, 2100000100 ) }',
            ':host > div { width: 100%; height: fit-content; text-align: center; }',
            ':host > div > div { overflow: hidden; position: relative; width: 100%; height: 0; margin: 0; transition: height 0.5s, margin 0.5s; background-color: var( --back, #4a4e5e ); }',
            ':host > div > div.error { background-color: var( --error, #ff5252 ); }',
            ':host > div > div.success { background-color: var( --success, #34ef6e ); }',
            ':host > div > div + div { margin-top: 0.2rem; }',
        ]).join('');
        this.contents = document.createElement('div');
        shadow.appendChild(style);
        shadow.appendChild(this.contents);
    }
    initStyle(style) { return style; }
    addMessage(message, time = 2000, type = '') {
        const area = document.createElement('div');
        if (type) {
            area.classList.add(type);
        }
        const text = document.createElement('div');
        text.innerHTML = message;
        area.appendChild(text);
        this.contents.appendChild(area);
        const rect = text.getBoundingClientRect();
        area.style.height = rect.height + 'px';
        area.addEventListener('transitionend', (event) => {
            const rect = area.getBoundingClientRect();
            if (rect.height < 1) {
                this.contents.removeChild(area);
            }
        });
        setTimeout(() => { area.style.height = '0'; }, time);
    }
    errorMessage(message, time) { this.addMessage(message, time, 'error'); }
    successMessage(message, time) { this.addMessage(message, time, 'success'); }
    removeAllMessage() {
        const c = this.contents.children;
        for (let i = c.length - 1; 0 <= i; --i) {
            c[i].style.height = '0';
        }
    }
    clear() {
        const c = this.contents.children;
        for (let i = c.length - 1; 0 <= i; --i) {
            this.contents.removeChild(c[i]);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('system-message', Message);
});
class TextIcon extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        style.innerHTML = [
            ':host { font-family: Icon; }',
        ].join('');
        shadow.appendChild(style);
        shadow.appendChild(document.createElement('slot'));
    }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('text-icon', TextIcon);
});
class DB extends EventTarget {
    constructor() {
        super();
        this.storage = localStorage;
    }
    reset(version) {
        return new Promise((resolve, reject) => {
            this.db.close();
            const request = indexedDB.deleteDatabase(document.domain || 'rofruf.local');
            request.onerror = (event) => { reject(event); };
            request.onblocked = (event) => { reject(event); };
            request.onsuccess = (event) => { resolve(event); };
        }).then(() => { return this.connect(version); });
    }
    connect(version) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(document.domain || 'rofruf.local', version);
            request.onblocked = (event) => { reject(event); };
            request.onupgradeneeded = (event) => {
                this.db = request.result;
                this.db.onerror = (event) => { reject(event); };
                this.db.onabort = (event) => { reject(event); };
                this.createObjectStore();
            };
            request.onsuccess = (event) => {
                this.db = request.result;
                console.log('onsuccess', event, this.db.version);
                if (this.db.version !== DB.VERSION) {
                    this.db.close();
                    return reject('DB old.');
                }
                this.db.onerror = (event) => { this.dispatchEvent(event); };
                this.db.onabort = (event) => { this.dispatchEvent(event); };
                resolve({});
            };
            request.onerror = (event) => { console.log('onerror', event); reject(event); };
        }).catch((error) => {
            if (error !== 'DB old.') {
                throw error;
            }
            return this.connect(DB.VERSION);
        });
    }
    createObjectStore() {
        console.log('PrevVer:', this.db.version);
        for (let i = this.db.version || 1; i <= DB.VERSION; ++i) {
            const db = this.createVersionDB(i);
            db.convertFromPrev();
            db.createStores();
        }
    }
    createVersionDB(version) {
        switch (version) {
            case 1: return new DBv1(this.db);
        }
        return new DBvI(this.db);
    }
    getItems() {
        return new Promise((resolve, reject) => {
            const store = this.db.transaction('items', 'readonly').objectStore('items');
            const request = store.getAll();
            request.onerror = (event) => { reject(event); };
            request.onsuccess = (event) => {
                resolve(request.result.map((data) => { return { id: data.id, count: data.count }; }));
            };
        });
    }
    useItem(id) {
        return new Promise((resolve, reject) => {
            const store = this.db.transaction('items', 'readwrite').objectStore('items');
            const request = store.get('id');
            request.onerror = (event) => { reject(event); };
            request.onsuccess = (event) => {
                const data = { id: id, count: request.result.count - 1 };
                if (data.count < 0) {
                    return reject(new Error('Do not have item.'));
                }
                const request2 = store.put(data);
                request2.onerror = (event) => { reject(event); };
                request2.onsuccess = (event) => {
                    resolve({ id: data.id, count: data.count });
                };
            };
        });
    }
    addItem(id, count = 1) {
        return new Promise((resolve, reject) => {
            const store = this.db.transaction('items', 'readwrite').objectStore('items');
            const request = store.get(id);
            request.onerror = (event) => { update(count); };
            request.onsuccess = (event) => { const now = request.result ? request.result.count : 0; update(now + count); };
            const update = (count) => {
                const data = { id: id, count: count };
                const request = store.put(data);
                request.onerror = (event) => { reject(event); };
                request.onsuccess = (event) => {
                    resolve({ id: data.id, count: data.count });
                };
            };
        });
    }
}
DB.VERSION = 1;
class DBvI {
    constructor(db) { this.db = db; }
    createStores() { }
    convertFromPrev() { }
    createStore(name, keyPath, autoIncrement = false) {
        console.log('createObjectStore', name, keyPath, autoIncrement);
        return this.db.createObjectStore(name, { keyPath: keyPath, autoIncrement: autoIncrement });
    }
}
class DBv1 extends DBvI {
    createStores() {
        const items = this.createStore('items', 'id');
    }
}
class User {
    constructor(db) {
        this.db = db;
    }
    getRuf() { return null; }
    getItems() {
        return this.db.getItems().then((items) => { return Item.convert(items); });
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
class LanguageManager {
    constructor(targets, modal) {
        this.lang = new Language();
        this.targets = targets;
        this.modal = modal;
        if (document.body.lang) {
            this.addStyle();
            this.initObserver();
        }
        else {
            const observer = new MutationObserver((records) => {
                observer.disconnect();
                this.addStyle();
                this.setLanguage(document.body.lang);
                this.initObserver();
            });
            observer.observe(document.body, { attributes: true, attributeFilter: ['lang'] });
        }
        targets.forEach((target) => {
            target.addEventListener('click', () => { this.openChooseLanguage(); });
        });
    }
    addStyle() {
        const style = document.createElement('style');
        style.innerHTML = this.lang.get().map((l) => { return 'body[lang="' + l + '"] def-button[lang="' + l + '"]{--back:var(--choose-language);}'; }).join('');
        document.head.appendChild(style);
    }
    initObserver() {
        const observer = new MutationObserver((records) => {
            this.setLanguage(document.body.lang);
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['lang'] });
    }
    openChooseLanguage() {
        const contents = document.createElement('div');
        this.lang.get().forEach((lang) => {
            const button = new DefaultButton();
            button.textContent = lang;
            button.lang = lang;
            button.addEventListener('click', () => { this.setLanguage(lang); });
            contents.appendChild(button);
        });
        this.modal.enableOK(() => { return false; });
        this.modal.clear();
        this.modal.appendChild(contents);
        this.modal.show();
    }
    setLanguage(lang) {
        if (document.body.lang !== lang) {
            this.lang.setLanguage(lang);
        }
        this.targets.forEach((target) => { target.textContent = lang; });
    }
}
class App {
    constructor(config) {
        this.config = config;
        this.lang = new LanguageManager(config.menu.lang, config.dialog);
        this.initPages();
        this.db = new DB();
        this.db.addEventListener('abort', (error) => { console.log(error); });
        this.db.addEventListener('error', (error) => { console.log(error); });
        this.db.connect().then(() => { this.init(); }).catch((error) => { console.log(error); });
    }
    init() {
        this.user = new User(this.db);
        if (this.user.getRuf()) {
            this.config.page.main.show();
        }
        else {
            this.config.page.top.show();
        }
    }
    showMypage() {
        if (this.user.getRuf()) {
            this.goTo('main');
        }
        else {
            this.config.page.egg.setUser(this.user).then(() => {
                this.goTo('egg');
            });
        }
    }
    initPages() {
        customElements.define('page-top', Top);
        customElements.define('page-main', Main);
        customElements.define('page-egg', Egg);
        Object.keys(this.config.page).forEach((key) => {
            this.config.page[key].setApp(this);
        });
    }
    goTo(page) {
        if (!this.config.page[page]) {
            return false;
        }
        Object.keys(this.config.page).forEach((key) => {
            this.config.page[key][key === page ? 'show' : 'hide']();
        });
    }
    popup() { return this.config.popup; }
    dialog() { return this.config.dialog; }
    message() { return this.config.message; }
    error(message, time) { return this.message().errorMessage(message, time); }
    success(message, time) { return this.message().successMessage(message, time); }
}
document.addEventListener('DOMContentLoaded', () => {
    const app = new App({
        popup: document.getElementById('popup'),
        dialog: document.getElementById('dialog'),
        message: document.getElementById('message'),
        page: {
            top: document.querySelector('page-top'),
            main: document.querySelector('page-main'),
            egg: document.querySelector('page-egg'),
        },
        menu: {
            lang: document.querySelectorAll('.lang'),
        },
    });
});
