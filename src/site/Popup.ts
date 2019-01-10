interface PopupClickCallback { (): boolean }

class Popup extends HTMLElement
{
	private lbutton: LeftButton;
	private rbutton: RightButton;
	private onCancel: undefined | PopupClickCallback;
	private onOK: undefined | PopupClickCallback;
	private timer: number;

	constructor()
	{
		super();

		const shadow = this.attachShadow( { mode: 'open' } );

		const style = document.createElement( 'style' );
		style.innerHTML = this.initStyle( [
			':host { display: block; visibility: hidden; position: absolute; margin: auto; top:0; bottom: 0; left: 0; right: 0; width: 100vmin; height: 100vmin; overflow: hidden; font-size: var( --fsize, 10vmin ); z-index: var( --z-index, 2147483647 ) }',
			':host( [ show ] ) { visibility: visible; }',
			':host > div { transition: width 0.5s, height 0.5s; margin: auto; width: 0; height: 0; position: absolute; top: 0; bottom: 0; left: 0; right: 0; border-radius: 50%; overflow: hidden; background-color: rgba( 0, 0, 0, 0.6 ); }',
			':host( [ show ] ) > div { width: 100%; height: 100%; }',
			':host > div > div { width: 60%; height: 0; margin: auto; box-sizing: border-box; padding: 0; overflow: auto; transition: height 0.5s ease 1s, padding 0.5s ease 1s; background-color: #57575f; }',
			':host( [ show ] ) > div > div { height: 100%; padding: 5vmin 0; }',
		] ).join( '' );

		const wrapper = document.createElement( 'div' );
		wrapper.addEventListener( 'click', ( event ) => { event.stopPropagation(); } );

		const contents = document.createElement( 'div' );
		wrapper.appendChild( contents );

		const slot = document.createElement( 'slot' );
		contents.appendChild( slot );

		this.lbutton = new LeftButton();
		this.lbutton.setAttribute( 'mode', 'cancel' );
		this.lbutton.addEventListener( 'click', () => { if ( !this.onCancel || !this.onCancel() ) { this.hide(); } } );
		wrapper.appendChild( this.lbutton );

		this.rbutton = new RightButton();
		this.rbutton.setAttribute( 'mode', 'ok' );
		this.lbutton.addEventListener( 'click', () => { if ( !this.onOK || !this.onOK() ) { this.hide(); } } );
		wrapper.appendChild( this.rbutton );

		shadow.appendChild( style );
		shadow.appendChild( wrapper );
	}

	protected initStyle( style: string[] ) { return style; }

	public clear()
	{
		const c = this.children;
		for ( let i = c.length - 1 ; 0 <= i ; --i ) { this.removeChild( c[ i ] ); }
	}

	public enableCancel( callback?: PopupClickCallback )
	{
		this.onCancel = callback;
		if ( this.hasAttribute( 'show' ) ) { this.lbutton.classList.add( 'on' ); }
	}

	public enableOK( callback?: PopupClickCallback )
	{
		this.onOK = callback;
		if ( this.hasAttribute( 'show' ) ) { this.rbutton.classList[ callback ? 'add' : 'remove' ]( 'on' ); }
	}

	public show()
	{
		if ( !this.hasAttribute( 'show' ) )
		{
			this.setAttribute( 'show', 'show' );
			return;
		}
		if ( this.timer ) { clearTimeout( this.timer ); }
		this.timer = setTimeout( () =>
		{
			this.enableCancel( this.onCancel );
			this.enableOK( this.onOK );
			this.timer = 0;
		}, 1000 );
	}

	public hide()
	{
		if ( this.hasAttribute( 'show' ) )
		{
			this.removeAttribute( 'show' );
			return;
		}
		clearTimeout( this.timer );
		this.timer = 0;
		this.lbutton.classList.remove( 'on' );
		this.rbutton.classList.remove( 'on' );
		this.clear();
		this.onCancel = this.onOK = undefined;
	}

	private updateShow( show: boolean )
	{
		if ( show ) { this.show(); } else { this.hide(); }
	}

	static get observedAttributes() { return [ 'show' ]; }
	public attributeChangedCallback( attrName: string, oldVal: any, newVal: any )
	{
		switch ( attrName )
		{
			case 'show': this.updateShow( this.hasAttribute( 'show' ) ); break;
		}
	}
}

document.addEventListener( 'DOMContentLoaded', () =>
{
	customElements.define( 'popup-window', Popup );
} );
