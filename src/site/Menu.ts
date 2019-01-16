class Menu extends HTMLElement
{
	private parent: HTMLElement;
	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = this.initStyle( [
			':host { --size: calc( 100vmin / 3 ); display: block; position: absolute; margin: auto; width: fit-content; height: fit-content; font-size: var( --fsize, 10vmin ); }',
			'button { cursor: pointer; display: block; padding: 0; margin:0; border:0; outline:none; }',
			':host > div { margin: 0; transition: left 0.5s, right 0.5s, top 0.5s, bottom 0.5s, width 0.5s, height 0.5s; position: relative; box-sizing: border-box; }',
			':host > div > button { width: var( --size ); height: var( --size ); border-radius: 50%; position: absolute; z-index: 10; font-family: Icon; }',
			':host > div > button:before, :host > div > button:after { display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; text-align: center; box-sizing: border-box; font-size: var( --fsize, 7vmin ); }',
			':host > div > button:before { content: var( --icon, "" ); }',
			':host > div > button:after { content: "×"; }',
			':host > div > scroll-area { width: 100%; height: 100%; overflow: hidden; }',
			':host > div > scroll-area > div { display: flex; }',
		] ).join( '' );

		this.parent = document.createElement( 'div' );

		const button = document.createElement( 'button' );
		button.addEventListener( 'click', () =>
		{
			const cls = (<HTMLElement>this.parentElement).classList;
			if ( cls.contains( 'on' ) )
			{
				// Hide all menu button & show this menu.
				cls.remove( 'on' );
				this.parent.classList.add( 'show' );
				return;
			}
			if ( !this.parent.classList.contains( 'show' ) ) { return; }
			// Show all menu button & hide this menu.
			cls.add( 'on' );
			this.parent.classList.remove( 'show' );
		} );
		this.parent.appendChild( button );

		const wrapper = new Scroll();
		const contents = document.createElement( 'div' );
		const slot = document.createElement( 'slot' );
		contents.appendChild( slot );
		wrapper.appendChild( contents );
		this.parent.appendChild( wrapper );

		shadow.appendChild( style );
		shadow.appendChild( this.parent );

		if ( this.tagName === 'LEFT-MENU' || this.tagName === 'RIGHT-MENU' )
		{
			wrapper.addEventListener( 'mousewheel', ( event: WheelEvent ) =>
			{
				if ( event.deltaX !== 0) { return; }
				event.stopPropagation();
				event.preventDefault();
				wrapper.scrollBy( event.deltaY, 0 );
			} );
		}
	}

	protected initStyle( style: string[] ) { return style; }

	private onOpen() { this.dispatchEvent( new Event( 'open' ) ); }

	private onClose() { this.dispatchEvent( new Event( 'close' ) ); }

	public clear()
	{
		const c = this.children;
		for ( let i = c.length - 1 ; 0 <= i ; --i ) { this.removeChild( c[ i ] ); }
	}
}

class TopMenu extends Menu
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host-context( .on ) > div { top: 0; }',
			':host { left: 0; right: 0; top: 0; width: var( --size ); }',
			':host > div { top: calc( var( --size ) / -2 ); height: 0; width: 100%; }',
			':host > div > button { left: 0; bottom: calc( var( --size ) / -2 ); }',
			':host > div.show { height: 100vmin; top: 0; }',
			':host > div > button:before { padding-top: 50%; line-height: calc( var( --size ) / 2 ); }',
			':host > div > button:after { padding-bottom: 50%; line-height: calc( var( --size ) / 2 ); }',
			':host > div > scroll-area { overflow-y: auto; }',
			':host > div > scroll-area > div { padding: calc( var( --size ) / 4 ) 0 calc( var( --size ) / 2 ); width: 100%; height: fit-content; }'
		);
		return style;
	}
}

class BottomMenu extends Menu
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host-context( .on ) > div { bottom: 0; }',
			':host { left: 0; right: 0; bottom: 0; width: var( --size ); }',
			':host > div { bottom: calc( var( --size ) / -2 ); height: 0; width: 100%; }',
			':host > div > button { left: 0; top: calc( var( --size ) / -2 ); }',
			':host > div.show { height: 100vmin; bottom: 0; }',
			':host > div > button:before { padding-bottom: 50%; line-height: calc( var( --size ) / 2 ); }',
			':host > div > button:after { padding-top: 50%; line-height: calc( var( --size ) / 2 ); }',
			':host > div > scroll-area { overflow-y: auto; }',
			':host > div > scroll-area > div { padding: calc( var( --size ) / 2 ) 0 calc( var( --size ) / 4 ); width: 100%; height: fit-content; }'
		);
		return style;
	}
}

class LeftMenu extends Menu
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host-context( .on ) > div { left: 0; }',
			':host { top: 0; bottom: 0; left: 0; height: var( --size ); }',
			':host > div { left: calc( var( --size ) / -2 ); width: 0; height: 100%; }',
			':host > div > button { top: 0; right: calc( var( --size ) / -2 ); }',
			':host > div.show { width: 100vmin; left: 0; }',
			':host > div > button:before { padding-left: 50%; line-height: var( --size ); }',
			':host > div > button:after { padding-right: 50%; line-height: var( --size ); }',
			':host > div > scroll-area { overflow-x: auto; }',
			':host > div > scroll-area > div { padding: 0 calc( var( --size ) / 2 ) 0 calc( var( --size ) / 4 ); width: fit-content; height: 100%; flex-wrap: nowrap; align-items: center; }'
		);
		return style;
	}
}

class RightMenu extends Menu
{
	protected initStyle( style: string[] )
	{
		style.push(
			':host-context( .on ) > div { right: 0; }',
			':host { top: 0; bottom: 0; right: 0; height: var( --size ); }',
			':host > div { right: calc( var( --size ) / -2 ); width: 0; height: 100%; }',
			':host > div > button { top: 0; left: calc( var( --size ) / -2 ); }',
			':host > div.show { width: 100vmin; right: 0; }',
			':host > div > button:before { padding-right: 50%; line-height: var( --size ); }',
			':host > div > button:after { padding-left: 50%; line-height: var( --size ); }',
			':host > div > scroll-area { overflow-x: auto; }',
			':host > div > scroll-area > div { padding: 0 calc( var( --size ) / 4 ) 0 calc( var( --size ) / 2 ); width: fit-content; height: 100%; flex-wrap: nowrap; align-items: center; }'
		);
		return style;
	}
}

class MenuItem extends HTMLElement
{

	private button: HTMLButtonElement;
	private count: HTMLElement;
	constructor()
	{
		super();
		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = this.initStyle( [
			':host { display: block; width:30vmin; height: fit-content; }',
			':host > div { width: 100%; padding-top: 100%; position: relative; overflow: hidden; }',
			':host > div > button { position: absolute; width: 95%; height: 95%; margin: auto; top: 0; bottom: 0; left: 0; right: 0; display: block; box-sizing: border-box; border-radius: 8%; overflow: hidden; cursor: pointer; border: 0.5vmin solid var( --border, #f7f7f7 ); background-color: var( --color, #afb1de ); }',
			':host > div > span { background-color: #e7e8f3; position: absolute; top: 0; right: 0; display: block; text-align: center; border-radius: 50%; font-size: 4vmin; width: 8vmin; height: 8vmin; line-height: 8vmin; }',
			':host > div > span:empty { display: none; }',
			':host( [ selected ] ) > div > button { background-color: var( --selected, #e6e494 ); }',
			':host( [ disabled ] ) > div > button:after { content: ""; width: 100%; height: 100%; display: block; position: absolute; top: 0; left: 0; background-color: var( --disabled, rgba( 0, 0, 0, 0.5 ) );}',
		] ).join( '' );

		const wrapper = this.initContents( document.createElement( 'div' ) );

		shadow.appendChild( style );
		shadow.appendChild( wrapper );

		if ( this.getAttribute( 'quantity' ) ) { this.quantity = parseInt( <string>this.getAttribute( 'quantity' ) ); }
	}

	protected initContents( wrapper: HTMLElement )
	{
		this.button = document.createElement( 'button' );
		const slot = document.createElement( 'slot' );
		this.button.appendChild( slot );
		wrapper.appendChild( this.button );
		this.count = document.createElement( 'span' );
		wrapper.appendChild( this.count );

		this.button.addEventListener( 'click', ( event ) => { this.onClick( event ); } );

		return wrapper;
	}

	protected initStyle( style: string[] ) { return style; }

	private onClick( event: MouseEvent )
	{
		event.stopPropagation();
		const newEvent = document.createEvent( 'MouseEvent' );
		newEvent.initMouseEvent( 'click', event.bubbles, event.cancelable, event.view, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, null );
		this.dispatchEvent( newEvent );
	}

	get quantity() { return parseInt( this.count.textContent || '' ) || 0; }
	set quantity( value )
	{
		const count = Math.floor( ( typeof value === 'number' ? value : parseInt( value ) ) || 0 );
		if ( count <= 0 ) { this.count.textContent = ''; return; }
		this.count.textContent = count < 100 ? count + '' : '99+';
	}
}

document.addEventListener( 'DOMContentLoaded', () =>
{
	customElements.define( 'top-menu', TopMenu );
	customElements.define( 'bottom-menu', BottomMenu );
	customElements.define( 'left-menu', LeftMenu );
	customElements.define( 'right-menu', RightMenu );
	customElements.define( 'menu-item', MenuItem );
} );
