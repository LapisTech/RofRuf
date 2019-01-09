class Page {
    constructor(page) {
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
    }
    setUser(user) {
    }
}
class Ruf {
    constructor() {
    }
}
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Item"] = 0] = "Item";
    ItemType[ItemType["Food"] = 1] = "Food";
})(ItemType || (ItemType = {}));
class User {
    constructor() {
    }
    getRuf() { return null; }
    getItems() {
        const items = [];
        return items;
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
            ':host > div > button { width: var( --size ); height: var( --size ); border-radius: 50%; position: absolute; font-family: Icon; }',
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
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('top-menu', TopMenu);
    customElements.define('bottom-menu', BottomMenu);
    customElements.define('left-menu', LeftMenu);
    customElements.define('right-menu', RightMenu);
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
        style.push(':host-context( .on ) { top: calc( var( --size ) / -2 ); }', ':host { left: 0; right: 0; top: calc( var( --size ) * -1 ); }', ':host > button:before { line-height: calc( var( --size ) / 2 ); padding-top: 50%; }');
        return style;
    }
}
class BottomButton extends Button {
    initStyle(style) {
        style.push(':host-context( .on ) { bottom: calc( var( --size ) / -2 ); }', ':host { left: 0; right: 0; bottom: calc( var( --size ) * -1 ); }', ':host > button:before { line-height: calc( var( --size ) / 2 ); padding-bottom: 50%; }');
        return style;
    }
}
class LeftButton extends Button {
    initStyle(style) {
        style.push(':host-context( .on ) { left: calc( var( --size ) / -2 ); }', ':host { top: 0; bottom: 0; left: calc( var( --size ) * -1 ); }', ':host > button:before { line-height: var( --size ); padding-left: 50%; }');
        return style;
    }
}
class RightButton extends Button {
    initStyle(style) {
        style.push(':host-context( .on ) { right: calc( var( --size ) / -2 ); }', ':host { top: 0; bottom: 0; right: calc( var( --size ) * -1 ); }', ':host > button:before { line-height: var( --size ); padding-right: 50%; }');
        return style;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    customElements.define('top-button', TopButton);
    customElements.define('bottom-button', BottomButton);
    customElements.define('left-button', LeftButton);
    customElements.define('right-button', RightButton);
});
class App {
    constructor(config) {
        this.user = new User();
        this.egg = new Egg(config.egg);
        if (this.user.getRuf()) {
            this.egg.hide();
        }
        else {
            this.egg.setUser(this.user);
            this.egg.show();
            setTimeout(() => { this.egg.showMenu(); }, 1000);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const app = new App({
        main: document.getElementById('main'),
        egg: document.getElementById('egg'),
    });
});
